import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface StatItem extends Record<string, unknown> {
  id: number;
  speedMinRegular: number;
  speedMaxRegular: number;
  speedMinMaximum: number;
  speedMaxMaximum: number;
  agilityRegular: number;
  agilityMaximum: number;
  firepower: string;
  maneuverRookieRegular: number;
  maneuverRookieMaximum: number;
  maneuverRegularRegular: number;
  maneuverRegularMaximum: number;
  maneuverVeteranRegular: number;
  maneuverVeteranMaximum: number;
}

export interface StatModel extends Model<InferAttributes<StatModel>, InferCreationAttributes<StatModel>>, StatItem {}

export const Stats = db.define<StatModel>(
  'stats',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    speedMinRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    speedMaxRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    speedMinMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    speedMaxMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    agilityRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    agilityMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    firepower: {
      type: DataTypes.STRING(1),
    },
    maneuverRookieRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    maneuverRookieMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    maneuverRegularRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    maneuverRegularMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    maneuverVeteranRegular: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
    maneuverVeteranMaximum: {
      type: DataTypes.INTEGER({ length: 2 }),
    },
  },
  { underscored: true, timestamps: false },
);
