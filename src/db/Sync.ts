import { Users } from '@db/models/Users';
import { Roles } from '@db/models/Roles';

export const syncDatabase = async () => {
  await Roles.sync();
  await Users.sync();
};
