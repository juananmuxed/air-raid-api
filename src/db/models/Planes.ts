import {
  DataTypes,
  HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { SpecialAbilities, SpecialAbilityModel } from './SpecialAbilities';
import { db } from '@db/Connection';
import { Costs } from './Costs';
import { AircraftClasses } from './AircraftClasses';
import { Stats } from './Stats';
import { NationYearModel, NationYears } from './NationYears';

export interface PlaneItem extends Record<string, unknown> {
  id: number;
  designation: string;
  nickname: string;
  costId: number;
  aircraftClassId: number;
  statZeroId: number;
  statOneId: number;
  statTwoId: number;
  statThreeId: number;
  specialAbilities?: number[];
  specialAbilitiesVeteran?: number[];
  nationYears?: number[];
  setSpecialAbilities: HasManySetAssociationsMixin<SpecialAbilityModel, number>;
  setSpecialAbilitiesVeteran: HasManySetAssociationsMixin<SpecialAbilityModel, number>;
  setNationYears: HasManySetAssociationsMixin<NationYearModel, number>;
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
    beta: {
      type: DataTypes.BOOLEAN,
    },
  },
  { underscored: true, timestamps: false },
);

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

export const PlanesNationYears = db.define(
  'planes_nation_years',
  {
    planeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Planes,
        key: 'id',
      },
    },
    nationYearId: {
      type: DataTypes.INTEGER,
      references: {
        model: NationYears,
        key: 'id',
      },
    },
  },
  { underscored: true, timestamps: false },
);

Planes.belongsToMany(NationYears, { through: PlanesNationYears, as: 'nationYears' });
NationYears.belongsToMany(Planes, { through: PlanesNationYears, as: 'planesNation' });

Planes.belongsTo(Costs, { foreignKey: 'costId', as: 'cost' });
Planes.belongsTo(AircraftClasses, { foreignKey: 'aircraftClassId', as: 'class' });
Planes.belongsTo(Stats, { foreignKey: 'statZeroId', as: 'statZero' });
Planes.belongsTo(Stats, { foreignKey: 'statOneId', as: 'statOne' });
Planes.belongsTo(Stats, { foreignKey: 'statTwoId', as: 'statTwo' });
Planes.belongsTo(Stats, { foreignKey: 'statThreeId', as: 'statThree' });
