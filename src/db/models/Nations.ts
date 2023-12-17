import {
  DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { db } from '@db/Connection';

export interface NationItem extends Record<string, unknown> {
  id: number;
  name: string;
  imgUrl: string;
}

export interface NationModel extends Model<InferAttributes<NationModel>, InferCreationAttributes<NationModel>>, NationItem {}

export const Nations = db.define<NationModel>(
  'nations',
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
    imgUrl: {
      type: DataTypes.STRING(),
    },
  },
  { underscored: true, timestamps: false },
);
