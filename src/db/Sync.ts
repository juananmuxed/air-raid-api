import { Users } from '@db/models/Users';
import { Roles } from '@db/models/Roles';
import { AircraftClasses } from './models/AircraftClasses';

export const syncDatabase = async () => {
  await Roles.sync();
  await Users.sync();
  await AircraftClasses.sync();
};
