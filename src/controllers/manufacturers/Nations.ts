import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { NationItem, NationModel, Nations } from '@db/models/Nations';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class NationsController {
  private getNationById(id?: number) {
    return Nations.findByPk(id);
  }

  getNations = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const nations = await Nations.findAll();

      res.json(nations);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getNationsPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedNations = await Nations.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<NationModel>(pagedNations, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createNation = async (req: TypedRequest<NationItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newNation = await Nations.create(body);

      res.status(201).json(await this.getNationById(newNation.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateNations = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<NationItem>(file);

      const nations = await Nations.bulkCreate(dataFromCSV);

      res.status(201).json(nations);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateNation = async (req: TypedRequest<NationItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const nation = await Nations.findByPk(body.id);

      if (!nation) next(new NotFoundError(ERRORS.NOT_FOUND('Nation')));

      const newNation = await nation?.update(body);

      res.json(await this.getNationById(newNation?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteNation = async (req: TypedRequest<NationItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const nation = await Nations.findByPk(body.id);

      if (!nation) next(new NotFoundError(ERRORS.NOT_FOUND('Nation')));

      const newNation = await nation?.destroy();

      res.json(newNation);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
