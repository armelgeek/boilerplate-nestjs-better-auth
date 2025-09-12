import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: true, 
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ClickNVape - API Documentation')
    .setDescription(
      'API documentation for ClickNVape application built with NestJS',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    customfavIcon: 'https://avatars.githubusercontent.com/u/11062800?s=32&v=4',
    customSiteTitle: 'ClickNVape - API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use('/api/docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ClickNVape - API Documentation</title>
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
