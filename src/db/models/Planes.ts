import {
  DataTypes,
  HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { SpecialAbilities, SpecialAbilityModel } from './SpecialAbilities';
import { YearModel, Years } from './Years';
import { db } from '@db/Connection';
import { Nations } from './Nations';
import { Costs } from './Costs';
import { AircraftClasses } from './AircraftClasses';
import { Stats } from './Stats';

export interface PlaneItem extends Record<string, unknown> {
  id: number;
  designation: string;
  nickname: string;
  nationId: number;
  costId: number;
  aircraftClassId: number;
  statZeroId: number;
  statOneId: number;
  statTwoId: number;
  statThreeId: number;
  years?: number[];
  specialAbilities?: number[];
  specialAbilitiesVeteran?: number[];
  setYears: HasManySetAssociationsMixin<YearModel, number>;
  setSpecialAbilities: HasManySetAssociationsMixin<SpecialAbilityModel, number>;
  setSpecialAbilitiesVeteran: HasManySetAssociationsMixin<SpecialAbilityModel, number>;
}

export interface PlaneModel extends Model<InferAttributes<PlaneModel>, InferCreationAttributes<PlaneModel>>, PlaneItem {}

export const Planes = db.define<PlaneModel>(
  'planes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    designation: {
      type: DataTypes.STRING(90),
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(40),
      unique: true,
    },
    nationId: {
      type: DataTypes.INTEGER,
    },
    costId: {
      type: DataTypes.INTEGER,
    },
    aircraftClassId: {
      type: DataTypes.INTEGER,
    },
    statZeroId: {
      type: DataTypes.INTEGER,
    },
    statOneId: {
      type: DataTypes.INTEGER,
    },
    statTwoId: {
      type: DataTypes.INTEGER,
    },
    statThreeId: {
      type: DataTypes.INTEGER,
    },
  },
  { underscored: true, timestamps: false },
);

export const PlanesYears = db.define(
  'planes_years',
  {
    planeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Planes,
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

Planes.belongsToMany(Years, { through: PlanesYears, as: 'years' });
Years.belongsToMany(Planes, { through: PlanesYears, as: 'planes' });

export const PlanesSpecialAbilities = db.define(
  'planes_sp_abilities',
  {
    planeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Planes,
        key: 'id',
      },
    },
    specialAbilityId: {
      type: DataTypes.INTEGER,
      references: {
        model: SpecialAbilities,
        key: 'id',
      },
    },
  },
  { underscored: true, timestamps: false },
);

Planes.belongsToMany(SpecialAbilities, { through: PlanesSpecialAbilities, as: 'specialAbilities', otherKey: 'specialAbilityId' });
SpecialAbilities.belongsToMany(Planes, { through: PlanesSpecialAbilities, as: 'planes' });

export const PlanesSpecialAbilitiesVeteran = db.define(
  'planes_sp_abilities_v',
  {
    planeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Planes,
        key: 'id',
      },
    },
    specialAbilityId: {
      type: DataTypes.INTEGER,
      references: {
        model: SpecialAbilities,
        key: 'id',
      },
    },
  },
  { underscored: true, timestamps: false },
);

Planes.belongsToMany(SpecialAbilities, { through: PlanesSpecialAbilitiesVeteran, as: 'specialAbilitiesVeteran', otherKey: 'specialAbilityId' });
SpecialAbilities.belongsToMany(Planes, { through: PlanesSpecialAbilitiesVeteran, as: 'planesVeteran' });

Planes.belongsTo(Nations, { foreignKey: 'nationId', as: 'nation' });
Planes.belongsTo(Costs, { foreignKey: 'costId', as: 'cost' });
Planes.belongsTo(AircraftClasses, { foreignKey: 'aircraftClassId', as: 'class' });
Planes.belongsTo(Stats, { foreignKey: 'statZeroId', as: 'statZero' });
Planes.belongsTo(Stats, { foreignKey: 'statOneId', as: 'statOne' });
Planes.belongsTo(Stats, { foreignKey: 'statTwoId', as: 'statTwo' });
Planes.belongsTo(Stats, { foreignKey: 'statThreeId', as: 'statThree' });
