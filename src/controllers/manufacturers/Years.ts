import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { YearItem, YearModel, Years } from '@db/models/Years';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class YearsController {
  private getYearById(id?: number) {
    return Years.findByPk(id);
  }

  getYears = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const years = await Years.findAll();

      res.json(years);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getYearsPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedYears = await Years.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<YearModel>(pagedYears, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createYear = async (req: TypedRequest<YearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newYear = await Years.create(body);

      res.status(201).json(await this.getYearById(newYear.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateYears = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<YearItem>(file);

      const years = await Years.bulkCreate(dataFromCSV);

      res.status(201).json(years);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateYear = async (req: TypedRequest<YearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const year = await Years.findByPk(body.id);

      if (!year) next(new NotFoundError(ERRORS.NOT_FOUND('Year')));

      const newYear = await year?.update(body);

      res.json(await this.getYearById(newYear?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteYear = async (req: TypedRequest<YearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const year = await Years.findByPk(body.id);

      if (!year) next(new NotFoundError(ERRORS.NOT_FOUND('Year')));

      const newYear = await year?.destroy();

      res.json(newYear);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
