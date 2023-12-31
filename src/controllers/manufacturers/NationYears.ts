import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { Nations } from '@db/models/Nations';
import { NationYearItem, NationYearModel, NationYears } from '@db/models/NationYears';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { getOrder, getPagination, pagedResponse } from '@controllers/utils/Pagination';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { ERRORS } from '@config/data/Errors';
import { convertCsv } from '@controllers/utils/ConvertCsv';
import { YearItem, Years } from '@db/models/Years';
import { getUnique } from '@controllers/utils/Arrays';

const include = [
  {
    model: Nations,
    as: 'nation',
    required: false,
  },
  {
    model: Years,
    as: 'years',
    required: false,
    through: {
      attributes: [],
    },
  },
];

export { include as includeNationYears };

export class NationYearsController {
  private getNationYearById(id?: number) {
    return NationYears.findByPk(id, { include });
  }

  private async setIncludes(item: NationYearItem, nationYear?: NationYearModel) {
    if (item.years) await nationYear?.setYears(item.years as number[]);
  }

  getNationYears = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const nationYears = await NationYears.findAll({
        include,
      });

      res.json(nationYears);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getNationYearsByNation = async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;

    try {
      const nation = await Nations.findByPk(params.nationId);

      if (!nation) next(new NotFoundError(ERRORS.NOT_FOUND('Nation')));

      const nationYears = await NationYears.findAll({
        where: {
          nationId: params.nationId,
        },
        include,
      });

      const uniqueYears = getUnique(nationYears.map((nationYear) => nationYear.years).flat(1) as YearItem[]);

      res.json(uniqueYears);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getNationYearsPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedNationYears = await NationYears.findAndCountAll({
        include,
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<NationYearModel>(pagedNationYears, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createNationYear = async (req: TypedRequest<NationYearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newNationYear = await NationYears.create(body);

      await this.setIncludes(body, newNationYear);

      res.status(201).json(await this.getNationYearById(newNationYear.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreateNationYears = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<NationYearItem>(file);

      const nationYears = await NationYears.bulkCreate(dataFromCSV);

      nationYears.forEach(async (nationYear, index) => {
        await this.setIncludes(dataFromCSV[index], nationYear);
      });

      res.status(201).json(nationYears);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updateNationYear = async (req: TypedRequest<NationYearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const nationYear = await NationYears.findByPk(body.id);

      if (!nationYear) next(new NotFoundError(ERRORS.NOT_FOUND('NationYear')));

      const newNationYear = await nationYear?.update(body);

      await this.setIncludes(body, newNationYear);

      res.json(await this.getNationYearById(newNationYear?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deleteNationYear = async (req: TypedRequest<NationYearItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const weapon = await NationYears.findByPk(body.id);

      if (!weapon) next(new NotFoundError(ERRORS.NOT_FOUND('NationYear')));

      const newNationYear = await weapon?.destroy();

      res.json(newNationYear);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
