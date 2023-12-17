import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { getPagination, getOrder, pagedResponse } from '@controllers/utils/Pagination';
import { SpecialAbilityItem, SpecialAbilityModel, SpecialAbilities } from '@db/models/SpecialAbilities';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { ERRORS } from '@config/data/Errors';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { convertCsv } from '@controllers/utils/ConvertCsv';

export class SpecialAbilitiesController {
  private getSpecialAbilityById(id?: number) {
    return SpecialAbilities.findByPk(id);
  }

  getSpecialAbilities = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const specialAbilities = await SpecialAbilities.findAll();

      res.json(specialAbilities);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getSpecialAbilitiesPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedSpecialAbilities = await SpecialAbilities.findAndCountAll({
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<SpecialAbilityModel>(pagedSpecialAbilities, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createSpecialAbility = async (req: TypedRequest<SpecialAbilityItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newSpecialAbility = await SpecialAbilities.create(body);

      res.status(201).json(await this.getSpecialAbilityById(newSpecialAbility.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateSpecialAbilities = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<SpecialAbilityItem>(file);

      const specialAbilities = await SpecialAbilities.bulkCreate(dataFromCSV);

      res.status(201).json(specialAbilities);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateSpecialAbility = async (req: TypedRequest<SpecialAbilityItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const specialAbility = await SpecialAbilities.findByPk(body.id);

      if (!specialAbility) next(new NotFoundError(ERRORS.NOT_FOUND('SpecialAbility')));

      const newSpecialAbility = await specialAbility?.update(body);

      res.json(await this.getSpecialAbilityById(newSpecialAbility?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteSpecialAbility = async (req: TypedRequest<SpecialAbilityItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const specialAbility = await SpecialAbilities.findByPk(body.id);

      if (!specialAbility) next(new NotFoundError(ERRORS.NOT_FOUND('SpecialAbility')));

      const newSpecialAbility = await specialAbility?.destroy();

      res.json(newSpecialAbility);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
