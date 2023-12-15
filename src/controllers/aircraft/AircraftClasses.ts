import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { AircraftClassItem, AircraftClassModel, AircraftClasses } from '@db/models/AircraftClasses';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class AircraftClassesController {
  private getAircraftClassById(id?: number) {
    return AircraftClasses.findByPk(id);
  }

  getAircraftClasses = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const aircraftClasses = await AircraftClasses.findAll();

      res.json(aircraftClasses);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getAircraftClassesPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedAircraftClasses = await AircraftClasses.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<AircraftClassModel>(pagedAircraftClasses, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createAircraftClass = async (req: TypedRequest<AircraftClassItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newAircraftClass = await AircraftClasses.create(body);

      res.status(201).json(await this.getAircraftClassById(newAircraftClass.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateAircraftClasses = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;

    try {
      if (!file) {
        next(new NotFileError());
        return;
      }

      if (!MIME_TYPES.CSV.includes(file.mimetype)) {
        next(new NotFileError(ERRORS.NOT_SUPPORTED_FILE));
        return;
      }

      const dataFromCSV = convertCsv<AircraftClassItem>(file);

      const aircraftClasses = await AircraftClasses.bulkCreate(dataFromCSV);

      res.status(201).json(aircraftClasses);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateAircraftClass = async (req: TypedRequest<AircraftClassItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const aircraftClass = await AircraftClasses.findByPk(body.id);

      if (!aircraftClass) next(new NotFoundError(ERRORS.NOT_FOUND('Aircraft class')));

      const newAircraftClass = await aircraftClass?.update(body);

      res.json(await this.getAircraftClassById(newAircraftClass?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteAircraftClass = async (req: TypedRequest<AircraftClassItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const aircraftClass = await AircraftClasses.findByPk(body.id);

      if (!aircraftClass) next(new NotFoundError(ERRORS.NOT_FOUND('Aircraft class')));

      const newAircraftClass = await aircraftClass?.destroy();

      res.json(newAircraftClass);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
