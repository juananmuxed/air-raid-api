import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { StatItem, StatModel, Stats } from '@db/models/Stats';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class StatsController {
  private getStatById(id?: number) {
    return Stats.findByPk(id);
  }

  getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await Stats.findAll();

      res.json(stats);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getStatsPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedStats = await Stats.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<StatModel>(pagedStats, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createStat = async (req: TypedRequest<StatItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newStat = await Stats.create(body);

      res.status(201).json(await this.getStatById(newStat.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateStats = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<StatItem>(file);

      const stats = await Stats.bulkCreate(dataFromCSV);

      res.status(201).json(stats);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateStat = async (req: TypedRequest<StatItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const stat = await Stats.findByPk(body.id);

      if (!stat) next(new NotFoundError(ERRORS.NOT_FOUND('Stat')));

      const newStat = await stat?.update(body);

      res.json(await this.getStatById(newStat?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteStat = async (req: TypedRequest<StatItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const stat = await Stats.findByPk(body.id);

      if (!stat) next(new NotFoundError(ERRORS.NOT_FOUND('Stat')));

      const newStat = await stat?.destroy();

      res.json(newStat);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
