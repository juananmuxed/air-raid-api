import { Application } from 'express';

import aircraftClassesRoutes from '@routes/aircraft/AircraftClasses';
import usersRoutes from '@routes/users/Users';
import rolesRoutes from '@routes/users/Roles';
import yearsRoutes from '@routes/manufacturers/Years';
import nationsRoutes from '@routes/manufacturers/Nations';
import costsRoutes from '@routes/aircraft/Costs';
import statsRoutes from '@routes/aircraft/Stats';
import specialAbilitiesRoutes from '@routes/specialAbilities/SpecialAbilities';
import authenticationRoutes from '@routes/auth/Auth';

const Paths = [
  'docs',
  'users',
  'roles',
  'years',
  'nations',
  'costs',
  'stats',
  'specialAbilities',
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
  costs: `${rootPath}costs`,
  stats: `${rootPath}stats`,
  specialAbilities: `${rootPath}specialAbilities`,
  aircraftClasses: `${rootPath}aircraftClasses`,
  authentication: `${rootPath}auth`,
};

export const setRoutes = (app: Application) => {
  app.use(apiPaths.authentication, authenticationRoutes);
  app.use(apiPaths.users, usersRoutes);
  app.use(apiPaths.roles, rolesRoutes);
  app.use(apiPaths.years, yearsRoutes);
  app.use(apiPaths.nations, nationsRoutes);
  app.use(apiPaths.costs, costsRoutes);
  app.use(apiPaths.stats, statsRoutes);
  app.use(apiPaths.specialAbilities, specialAbilitiesRoutes);
  app.use(apiPaths.aircraftClasses, aircraftClassesRoutes);
};
