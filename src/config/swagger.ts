import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SDA E-Commerce API',
      version: '1.0.0',
      description: 'API Documentation for SDA E-Commerce',
      contact: {
        name: 'Memed',
        email: 'muhammametd@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app: Express, port: number) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`📝 Docs available at http://localhost:${port}/api/docs`);
};

export default swaggerDocs;