import {
  DataTypes, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';
import { YearItem, YearModel, Years } from './Years';
import { Nations } from './Nations';

export interface NationYearItem extends Record<string, unknown> {
  id: number;
  nationId: number;
  years?: number[] | YearItem[];
  setYears: HasManySetAssociationsMixin<YearModel, number>;
}

export interface NationYearModel extends Model<InferAttributes<NationYearModel>, InferCreationAttributes<NationYearModel>>, NationYearItem {}

export const NationYears = db.define<NationYearModel>(
  'nation_years',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    nationId: {
      type: DataTypes.INTEGER,
    },
  },
  { underscored: true, timestamps: false },
);

export const NationYearsYears = db.define(
  'planes_years_years',
  {
    planeId: {
      type: DataTypes.INTEGER,
      references: {
        model: NationYears,
        key: 'id',
      },
    },
    yearId: {
      type: DataTypes.INTEGER,
      references: {
        model: Years,
        key: 'id',
      },
    },
  },
  { underscored: true, timestamps: false },
);

NationYears.belongsToMany(Years, { through: NationYearsYears, as: 'years' });
Years.belongsToMany(NationYears, { through: NationYearsYears, as: 'planes' });

NationYears.belongsTo(Nations, { foreignKey: 'nationId', as: 'nation' });
