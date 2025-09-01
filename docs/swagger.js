const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API',
      version: '1.0.0',
      description: 'A simple CRUD API with Express and Swagger',
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJSDoc(options);
