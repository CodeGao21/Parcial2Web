import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;

  const mockBonoRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsuarioRepository = {
    findOneBy: jest.fn(),
  };

  const mockClaseRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BonoService,
        {
          provide: getRepositoryToken(BonoEntity),
          useValue: mockBonoRepository,
        },
        {
          provide: getRepositoryToken(UsuarioEntity),
          useValue: mockUsuarioRepository,
        },
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: mockClaseRepository,
        },
      ],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearBono', () => {
    it('should throw an exception if monto is not positive', async () => {
      const bono = { monto: -100, calificacion: 3, palabraclave: 'clave', usuario: {} } as BonoEntity;

      await expect(service.crearBono(bono, 1)).rejects.toThrowError(
        new HttpException('El monto del bono debe ser positivo y no vacío', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an exception if usuario is not found', async () => {
      const bono = { monto: 100, calificacion: 3, palabraclave: 'clave', usuario: {} } as BonoEntity;
      mockUsuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.crearBono(bono, 1)).rejects.toThrowError(
        new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if usuario is not a Profesor', async () => {
      const bono = { monto: 100, calificacion: 3, palabraclave: 'clave', usuario: {} } as BonoEntity;
      const usuario = { id: 1, rol: 'Decana' } as UsuarioEntity;
      mockUsuarioRepository.findOneBy.mockResolvedValue(usuario);

      await expect(service.crearBono(bono, 1)).rejects.toThrowError(
        new HttpException('El usuario debe tener rol de Profesor para crear un bono', HttpStatus.FORBIDDEN),
      );
    });

    it('should successfully create a bono', async () => {
      const bono = { monto: 100, calificacion: 3, palabraclave: 'clave', usuario: {} } as BonoEntity;
      const usuario = { id: 1, rol: 'Profesor' } as UsuarioEntity;
      mockUsuarioRepository.findOneBy.mockResolvedValue(usuario);
      mockBonoRepository.save.mockResolvedValue(bono);

      const result = await service.crearBono(bono, 1);
      expect(result).toEqual(bono);
    });
  });

  describe('findBonoByCodigo', () => {
    it('should throw an exception if clase is not found', async () => {
      mockClaseRepository.findOne.mockResolvedValue(null);

      await expect(service.findBonoByCodigo('1234567890')).rejects.toThrowError(
        new HttpException('Clase con ese código no encontrada', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if bono is not found for the class', async () => {
      const clase = { id: 1, codigo: '1234567890' } as ClaseEntity;
      mockClaseRepository.findOne.mockResolvedValue(clase);
      mockBonoRepository.findOne.mockResolvedValue(null);

      await expect(service.findBonoByCodigo('1234567890')).rejects.toThrowError(
        new HttpException('Bono asociado a la clase no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should successfully find a bono by class code', async () => {
      const clase = { id: 1, codigo: '1234567890' } as ClaseEntity;
      const bono = { id: 1, monto: 100, calificacion: 3, palabraclave: 'clave', clase } as BonoEntity;
      mockClaseRepository.findOne.mockResolvedValue(clase);
      mockBonoRepository.findOne.mockResolvedValue(bono);

      const result = await service.findBonoByCodigo('1234567890');
      expect(result).toEqual(bono);
    });
  });

  describe('findAllBonosByUsuario', () => {
    it('should return an empty array if no bonos are found for the user', async () => {
      mockBonoRepository.find.mockResolvedValue([]);

      const result = await service.findAllBonosByUsuario(1);
      expect(result).toEqual([]);
    });

    it('should return an array of bonos for the user', async () => {
      const bonos = [{ id: 1, monto: 100, calificacion: 3, palabraclave: 'clave' }] as BonoEntity[];
      mockBonoRepository.find.mockResolvedValue(bonos);

      const result = await service.findAllBonosByUsuario(1);
      expect(result).toEqual(bonos);
    });
  });

  describe('deleteBono', () => {
    it('should throw an exception if bono is not found', async () => {
      mockBonoRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteBono(1)).rejects.toThrowError(
        new HttpException('Bono no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the bono calificacion is greater than 4', async () => {
      const bono = { id: 1, calificacion: 5 } as BonoEntity;
      mockBonoRepository.findOne.mockResolvedValue(bono);

      await expect(service.deleteBono(1)).rejects.toThrowError(
        new HttpException('No se puede eliminar un bono con calificación mayor a 4', HttpStatus.FORBIDDEN),
      );
    });

    it('should successfully delete a bono', async () => {
      const bono = { id: 1, calificacion: 3 } as BonoEntity;
      mockBonoRepository.findOne.mockResolvedValue(bono);
      mockBonoRepository.remove.mockResolvedValue(undefined);

      await expect(service.deleteBono(1)).resolves.toBeUndefined();
    });
  });
});
