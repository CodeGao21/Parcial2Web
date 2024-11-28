import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { BonoEntity } from '../bono/bono.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ClaseService', () => {
  let service: ClaseService;
  let claseRepository: Repository<ClaseEntity>;
  let bonoRepository: Repository<BonoEntity>;

  const mockClaseRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockBonoRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClaseService,
        {
          provide: getRepositoryToken(ClaseEntity),
          useValue: mockClaseRepository,
        },
        {
          provide: getRepositoryToken(BonoEntity),
          useValue: mockBonoRepository,
        },
      ],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CrearClase', () => {
    it('should throw an exception if the code does not have exactly 10 characters', async () => {
      const clase = { codigo: '123', nombre: 'Matematicas', creditos: 3 } as ClaseEntity;

      await expect(service.CrearClase(clase)).rejects.toThrowError(
        new HttpException('El código de la clase debe tener exactamente 10 caracteres', HttpStatus.BAD_REQUEST),
      );
    });

    it('should successfully create a class if the code is valid', async () => {
      const clase = { codigo: '1234567890', nombre: 'Matematicas', creditos: 3 } as ClaseEntity;
      mockClaseRepository.save.mockResolvedValue(clase);

      const result = await service.CrearClase(clase);
      expect(result).toEqual(clase);
    });
  });

  describe('findClaseById', () => {
    it('should throw an exception if the class is not found', async () => {
      mockClaseRepository.findOne.mockResolvedValue(null);

      await expect(service.findClaseById(1)).rejects.toThrowError(
        new HttpException('Clase no encontrada', HttpStatus.NOT_FOUND),
      );
    });

    it('should return the class if it is found', async () => {
      const clase = { id: 1, nombre: 'Matematicas', codigo: '1234567890', creditos: 3 } as ClaseEntity;
      mockClaseRepository.findOne.mockResolvedValue(clase);

      const result = await service.findClaseById(1);
      expect(result).toEqual(clase);
    });
  });

  describe('asociarBonoAClase', () => {
    it('should throw an exception if the class is not found', async () => {
      mockClaseRepository.findOne.mockResolvedValue(null);

      await expect(service.asociarBonoAClase(1, 1)).rejects.toThrowError(
        new HttpException('Clase no encontrada', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an exception if the bono is not found', async () => {
      const clase = { id: 1, bonos: [] } as ClaseEntity;
      mockClaseRepository.findOne.mockResolvedValue(clase);
      mockBonoRepository.findOne.mockResolvedValue(null);

      await expect(service.asociarBonoAClase(1, 1)).rejects.toThrowError(
        new HttpException('Bono no encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('should successfully associate a bono to a class', async () => {
      const clase = { id: 1, bonos: [] } as ClaseEntity;
      const bono = { id: 1 } as BonoEntity;

      mockClaseRepository.findOne.mockResolvedValue(clase);
      mockBonoRepository.findOne.mockResolvedValue(bono);
      mockClaseRepository.save.mockResolvedValue({ ...clase, bonos: [bono] });

      const result = await service.asociarBonoAClase(1, 1);
      expect(result.bonos).toContain(bono);
    });
  });
});
