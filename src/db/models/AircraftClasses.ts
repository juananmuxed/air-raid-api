import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface AircraftClassItem extends Record<string, unknown> {
  id: number;
  name: string;
}

export interface AircraftClassModel extends Model<InferAttributes<AircraftClassModel>, InferCreationAttributes<AircraftClassModel>>, AircraftClassItem {}

export const AircraftClasses = db.define<AircraftClassModel>(
  'aircraftClasses',
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
  },
  { underscored: true, timestamps: false },
);
