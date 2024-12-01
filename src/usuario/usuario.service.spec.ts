import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { BonoEntity } from '../bono/bono.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let bonoRepository: Repository<BonoEntity>;

  const mockUsuarioRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockBonoRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(BonoEntity),
          useValue: mockBonoRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearUsuario', () => {
    it('should throw an exception if the group is not allowed for Profesor role', async () => {
      const usuario = {
        rol: 'Profesor',
        grupo: 'INVALID_GROUP',
        extension: 12345678,
      } as UsuarioEntity;

      await expect(service.crearUsuario(usuario)).rejects.toThrowError(
        new HttpException(
          'El grupo de investigación no es válido para un Profesor',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an exception if the extension is invalid for Decana role', async () => {
      const usuario = {
        rol: 'Decana',
        grupo: 'TICSW',
        extension: 12345, // invalid extension
      } as UsuarioEntity;

      await expect(service.crearUsuario(usuario)).rejects.toThrowError(
        new HttpException(
          'El número de extensión debe tener 8 dígitos para una Decana',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should successfully create a user if all validations pass', async () => {
      const usuario = {
        rol: 'Profesor',
        grupo: 'TICSW',
        extension: 12345678,
      } as UsuarioEntity;

      mockUsuarioRepository.save.mockResolvedValue(usuario);

      const result = await service.crearUsuario(usuario);
      expect(result).toEqual(usuario);
    });
  });

  describe('findUsuarioById', () => {
    it('should throw an exception if the user is not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.findUsuarioById(1)).rejects.toThrowError(
        new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should return a user if found', async () => {
      const usuario = { id: 1, nombre: 'Juan' } as UsuarioEntity;
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      const result = await service.findUsuarioById(1);
      expect(result).toEqual(usuario);
    });
  });

  describe('eliminarUsuario', () => {
    it('should throw an exception if the user is not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.eliminarUsuario(1)).rejects.toThrowError(
        new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the user is a Decana', async () => {
      const usuario = { id: 1, rol: 'Decana' } as UsuarioEntity;
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(service.eliminarUsuario(1)).rejects.toThrowError(
        new HttpException('No se puede eliminar a un usuario con rol Decana', HttpStatus.FORBIDDEN),
      );
    });

    it('should throw an exception if the user has an associated bono', async () => {
      const usuario = { id: 1, rol: 'Profesor', bonos: [{}] } as UsuarioEntity;
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);

      await expect(service.eliminarUsuario(1)).rejects.toThrowError(
        new HttpException('El usuario tiene un bono asociado y no puede ser eliminado', HttpStatus.FORBIDDEN),
      );
    });

    it('should successfully delete a user if no bonos and not Decana', async () => {
      const usuario = { id: 1, rol: 'Profesor' } as UsuarioEntity;
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockUsuarioRepository.remove.mockResolvedValue(usuario);

      await expect(service.eliminarUsuario(1)).resolves.not.toThrow();
    });
  });

  describe('asociarBonoAUsuario', () => {
    it('should throw an exception if the user is not found', async () => {
      mockUsuarioRepository.findOne.mockResolvedValue(null);

      await expect(service.asociarBonoAUsuario(1, 1)).rejects.toThrowError(
        new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the bono is not found', async () => {
      const usuario = { id: 1, bonos: [] } as UsuarioEntity;
      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockBonoRepository.findOne.mockResolvedValue(null);

      await expect(service.asociarBonoAUsuario(1, 1)).rejects.toThrowError(
        new HttpException('Bono no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should successfully associate a bono to a user', async () => {
      const usuario = { id: 1, bonos: [] } as UsuarioEntity;
      const bono = { id: 1 } as BonoEntity;

      mockUsuarioRepository.findOne.mockResolvedValue(usuario);
      mockBonoRepository.findOne.mockResolvedValue(bono);
      mockUsuarioRepository.save.mockResolvedValue({ ...usuario, bonos: [bono] });

      const result = await service.asociarBonoAUsuario(1, 1);
      expect(result.bonos).toContain(bono);
    });
  });
});
