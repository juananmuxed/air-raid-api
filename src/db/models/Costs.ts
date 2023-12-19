import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface CostItem extends Record<string, unknown> {
  id: number;
  rookie: number;
  regular: number;
  veteran: number;
}

export interface CostModel extends Model<InferAttributes<CostModel>, InferCreationAttributes<CostModel>>, CostItem {}

export const Costs = db.define<CostModel>(
  'costs',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    rookie: {
      type: DataTypes.INTEGER({ length: 4 }),
    },
    regular: {
      type: DataTypes.INTEGER({ length: 4 }),
    },
    veteran: {
      type: DataTypes.INTEGER({ length: 4 }),
    },
  },
  { underscored: true, timestamps: false },
);
