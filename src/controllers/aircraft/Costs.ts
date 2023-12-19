import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { CostItem, CostModel, Costs } from '@db/models/Costs';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class CostsController {
  private getCostById(id?: number) {
    return Costs.findByPk(id);
  }

  getCosts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const costs = await Costs.findAll();

      res.json(costs);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getCostsPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedCosts = await Costs.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<CostModel>(pagedCosts, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createCost = async (req: TypedRequest<CostItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newCost = await Costs.create(body);

      res.status(201).json(await this.getCostById(newCost.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateCosts = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<CostItem>(file);

      const costs = await Costs.bulkCreate(dataFromCSV);

      res.status(201).json(costs);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateCost = async (req: TypedRequest<CostItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const cost = await Costs.findByPk(body.id);

      if (!cost) next(new NotFoundError(ERRORS.NOT_FOUND('Cost')));

      const newCost = await cost?.update(body);

      res.json(await this.getCostById(newCost?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteCost = async (req: TypedRequest<CostItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const cost = await Costs.findByPk(body.id);

      if (!cost) next(new NotFoundError(ERRORS.NOT_FOUND('Cost')));

      const newCost = await cost?.destroy();

      res.json(newCost);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
