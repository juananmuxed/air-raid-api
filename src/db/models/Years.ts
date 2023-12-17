import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface YearItem extends Record<string, unknown> {
  id: number;
  year: number;
}

export interface YearModel extends Model<InferAttributes<YearModel>, InferCreationAttributes<YearModel>>, YearItem {}

export const Years = db.define<YearModel>(
  'years',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    year: {
      type: DataTypes.INTEGER({ length: 4 }),
      unique: true,
    },
  },
  { underscored: true, timestamps: false },
);
