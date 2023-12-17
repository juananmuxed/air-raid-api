import { Application } from 'express';

import aircraftClassesRoutes from '@routes/aircraft/AircraftClasses';
import usersRoutes from '@routes/users/Users';
import rolesRoutes from '@routes/users/Roles';
import yearsRoutes from '@routes/manufacturers/Years';
import nationsRoutes from '@routes/manufacturers/Nations';
import authenticationRoutes from '@routes/auth/Auth';

const Paths = [
  'docs',
  'users',
  'roles',
  'years',
  'nations',
  'aircraftClasses',
  'authentication',
] as const;

type ApiPaths = typeof Paths[number];

const rootPath = '/api/';
export const apiPaths: Record<ApiPaths, string> = {
  docs: `${rootPath}docs`,
  users: `${rootPath}users`,
  roles: `${rootPath}roles`,
  years: `${rootPath}years`,
  nations: `${rootPath}nations`,
  aircraftClasses: `${rootPath}aircraftClasses`,
  authentication: `${rootPath}auth`,
};

export const setRoutes = (app: Application) => {
  app.use(apiPaths.authentication, authenticationRoutes);
  app.use(apiPaths.users, usersRoutes);
  app.use(apiPaths.roles, rolesRoutes);
  app.use(apiPaths.years, yearsRoutes);
  app.use(apiPaths.nations, nationsRoutes);
  app.use(apiPaths.aircraftClasses, aircraftClassesRoutes);
};
