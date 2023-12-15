import { Application } from 'express';

import authenticationRoutes from '@routes/auth/Auth';

const Paths = [
  'docs',
  'authentication',
] as const;

type ApiPaths = typeof Paths[number];

const rootPath = '/api/';
export const apiPaths: Record<ApiPaths, string> = {
  docs: `${rootPath}docs`,
  authentication: `${rootPath}auth`,
};

export const setRoutes = (app: Application) => {
  app.use(apiPaths.authentication, authenticationRoutes);
};
