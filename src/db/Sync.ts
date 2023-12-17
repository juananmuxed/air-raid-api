import { Users } from '@db/models/Users';
import { Roles } from '@db/models/Roles';
import { AircraftClasses } from '@db/models/AircraftClasses';
import { Years } from '@db/models/Years';
import { Nations } from './models/Nations';

export const syncDatabase = async () => {
  await Roles.sync();
  await Users.sync();
  await AircraftClasses.sync();
  await Years.sync();
  await Nations.sync();
};
