import swaggerJsDoc from 'swagger-jsdoc';

export const useSwaggerOptions = () => {
  const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.3',
      info: {
        version: '1.0.0',
        title: 'Template TS API',
        termsOfService: 'http://swagger.io/terms/',
        description: 'Template TS API',
        contact: {
          name: 'MuXeD',
          url: 'https://github.com/juananmuxed',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server',
        },
      ],
    },
    apis: ['src/docs/**/*.yml'],
  };
  if (process.env.NODE_ENV === 'production' && swaggerOptions.definition) {
    swaggerOptions.definition.servers = [{
      url: 'https://example.com/api',
      description: 'Template TS API',
    }];
  }
  return swaggerOptions;
};

export const useSwagger = () => {
  const swaggerDocs = swaggerJsDoc(useSwaggerOptions());
  return swaggerDocs;
};
