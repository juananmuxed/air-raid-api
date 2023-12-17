import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface SpecialAbilityItem extends Record<string, unknown> {
  id: number;
  name: string;
  valueNumber?: number;
  valueString?: string;
}

export interface SpecialAbilityModel extends Model<InferAttributes<SpecialAbilityModel>, InferCreationAttributes<SpecialAbilityModel>>, SpecialAbilityItem {}

export const SpecialAbilities = db.define<SpecialAbilityModel>(
  'specialAbilities',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    valueNumber: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    valueString: {
      type: DataTypes.STRING(2),
    },
  },
  { underscored: true, timestamps: false },
);
