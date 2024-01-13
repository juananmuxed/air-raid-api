import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'sequelize';

import { SpecialAbilities } from '@db/models/SpecialAbilities';
import { Nations } from '@db/models/Nations';
import { Costs } from '@db/models/Costs';
import { AircraftClasses } from '@db/models/AircraftClasses';
import { Stats } from '@db/models/Stats';
import { PlaneItem, PlaneModel, Planes } from '@db/models/Planes';
import { InternalError, NotFileError, NotFoundError } from '@models/Errors';
import { TypedRequest } from '@db/models/common/ExpressTypes';
import { Pagination } from '@models/Pagination';
import { getOrder, getPagination, pagedResponse } from '@controllers/utils/Pagination';
import { MIME_TYPES } from '@config/data/MimeTypes';
import { ERRORS } from '@config/data/Errors';
import { convertCsv } from '@controllers/utils/ConvertCsv';
import { NationYears } from '@db/models/NationYears';
import { Years } from '@db/models/Years';
import { includeNationYears } from '@controllers/manufacturers/NationYears';

const include = [
  {
    model: Costs,
    as: 'cost',
    required: false,
  },
  {
    model: AircraftClasses,
    as: 'class',
    required: false,
  },
  {
    model: Stats,
    as: 'statZero',
    required: false,
  },
  {
    model: Stats,
    as: 'statOne',
    required: false,
  },
  {
    model: Stats,
    as: 'statTwo',
    required: false,
  },
  {
    model: Stats,
    as: 'statThree',
    required: false,
  },
  {
    model: SpecialAbilities,
    as: 'specialAbilities',
    required: false,
    through: {
      attributes: [],
    },
  },
  {
    model: SpecialAbilities,
    as: 'specialAbilitiesVeteran',
    required: false,
    through: {
      attributes: [],
    },
  },
  {
    model: NationYears,
    as: 'nationYears',
    required: false,
    through: {
      attributes: [],
    },
    include: includeNationYears,
  },
];

export { include as includePlanes };

export class PlanesController {
  private getPlaneById(id?: number) {
    return Planes.findByPk(id, { include });
  }

  private async setIncludes(item: PlaneItem, plane?: PlaneModel) {
    if (item.specialAbilities) await plane?.setSpecialAbilities(item.specialAbilities);
    if (item.specialAbilitiesVeteran) await plane?.setSpecialAbilitiesVeteran(item.specialAbilitiesVeteran);
    if (item.nationYears) await plane?.setNationYears(item.nationYears);
  }

  getPlanes = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const planes = await Planes.findAll({
        include,
      });

      res.json(planes);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getPlanesByNationAndYear = async (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;

    try {
      const nation = await Nations.findByPk(params.nationId);

      if (!nation) next(new NotFoundError(ERRORS.NOT_FOUND('Nation')));
      let _include;

      if (Number(params.yearId) > 0) {
        const year = await Years.findByPk(params.yearId);

        if (!year) next(new NotFoundError(ERRORS.NOT_FOUND('Year')));

        _include = [
          ...includeNationYears,
          {
            model: Years,
            as: 'years',
            required: true,
            where: {
              id: params.yearId,
            },
          },
        ];
      } else {
        _include = includeNationYears;
      }

      const nationYears = await NationYears.findAll({
        where: {
          nationId: params.nationId,
        },
        include: _include,
      });

      const filteredNationYears = nationYears
        .map((nationYear) => nationYear.id);

      const planes = await Planes.findAll({
        include: [
          ...include,
          ...[{
            model: NationYears,
            as: 'nationYears',
            required: true,
            where: {
              id: filteredNationYears,
            },
          }],
        ],
      });

      res.json(planes);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  getPlanesPaginated = async (req: TypedRequest<Pagination>, res: Response, next: NextFunction) => {
    const {
      page, rowsPerPage, sortBy, descending,
    } = req.query;

    try {
      const pagination = getPagination(Number(page), Number(rowsPerPage));
      const order = getOrder(sortBy?.toString(), descending?.toString());

      const pagedPlanes = await Planes.findAndCountAll({
        include,
        ...pagination,
        distinct: true,
        order,
      });

      res.json(pagedResponse<PlaneModel>(pagedPlanes, pagination, order));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  createPlane = async (req: TypedRequest<PlaneItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const newPlane = await Planes.create(body);

      await this.setIncludes(body, newPlane);

      res.status(201).json(await this.getPlaneById(newPlane.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  bulkCreatePlanes = async (req: Request, res: Response, next: NextFunction) => {
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

      const dataFromCSV = convertCsv<PlaneItem>(file);

      const planes = await Planes.bulkCreate(dataFromCSV);

      planes.forEach(async (plane, index) => {
        await this.setIncludes(dataFromCSV[index], plane);
      });

      res.status(201).json(planes);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  updatePlane = async (req: TypedRequest<PlaneItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const plane = await Planes.findByPk(body.id);

      if (!plane) next(new NotFoundError(ERRORS.NOT_FOUND('Plane')));

      const newPlane = await plane?.update(body);

      await this.setIncludes(body, newPlane);

      res.json(await this.getPlaneById(newPlane?.id));
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };

  deletePlane = async (req: TypedRequest<PlaneItem>, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      const weapon = await Planes.findByPk(body.id);

      if (!weapon) next(new NotFoundError(ERRORS.NOT_FOUND('Plane')));

      const newPlane = await weapon?.destroy();

      res.json(newPlane);
    } catch (error) {
      next(new InternalError(undefined, error as ValidationError));
    }
  };
}
