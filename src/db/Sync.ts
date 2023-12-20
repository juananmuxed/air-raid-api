import { Users } from '@db/models/Users';
import { Roles } from '@db/models/Roles';
import { AircraftClasses } from '@db/models/AircraftClasses';
import { Years } from '@db/models/Years';
import { Nations } from './models/Nations';
import { SpecialAbilities } from './models/SpecialAbilities';
import { Costs } from './models/Costs';
import { Stats } from './models/Stats';
import {
  Planes, PlanesSpecialAbilities, PlanesSpecialAbilitiesVeteran, PlanesYears,
} from './models/Planes';

export const syncDatabase = async () => {
  await Roles.sync();
  await Users.sync();
  await AircraftClasses.sync();
  await Years.sync();
  await Nations.sync();
  await SpecialAbilities.sync();
  await Costs.sync();
  await Stats.sync();
  await Planes.sync();
  await PlanesYears.sync();
  await PlanesSpecialAbilities.sync();
  await PlanesSpecialAbilitiesVeteran.sync();
};
