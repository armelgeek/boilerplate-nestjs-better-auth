import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable cookie parser
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: true, // In production, specify your frontend URL
    credentials: true,
  });

  // Swagger API documentation with Scalar UI
  const config = new DocumentBuilder()
    .setTitle('NestJS + Better Auth Boilerplate')
    .setDescription(
      'A boilerplate API built with NestJS, Better Auth, and Hexagonal Architecture',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Set up Swagger documentation
  SwaggerModule.setup('api', app, document, {
    customfavIcon: 'https://avatars.githubusercontent.com/u/11062800?s=32&v=4',
    customSiteTitle: 'NestJS Better Auth API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Create a separate Scalar endpoint
  app.use('/api/scalar', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>NestJS Better Auth API - Scalar Documentation</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <script
            id="api-reference"
            data-url="/api-json"
            data-configuration='{"theme":"default","layout":"sidebar","showSidebar":true}'
          ></script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.24.24/dist/browser/standalone.min.js"></script>
        </body>
      </html>
    `);
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Standard Swagger UI: http://localhost:${port}/api`);
  console.log(`📚 Scalar API documentation: http://localhost:${port}/api/scalar`);
}

bootstrap();
