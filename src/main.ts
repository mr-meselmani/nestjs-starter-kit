import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { SWAGGER_API_ENDPOINT } from './_middlewares/routes';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  // https://docs.nestjs.com/security/cors
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allowed origin(s)
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  // https://docs.nestjs.com/security/helmet
  app.use(helmet());

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1');

  // https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
  app.enableShutdownHooks();

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('NestJS Starter Kit 🚀 API Documentation')
    .setDescription(
      '🏹👑 A starter kit for NestJS with Prisma, Passport, Zod, Swagger, and more. Built to be a solid foundation for YOUR next project 👑🏹.',
    )
    .setVersion('0.1')
    .addServer('http://localhost:3000/', 'Local environment')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();

  SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
      filter: true,
    },
    customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
  });

  await app.listen(port);
}
bootstrap();
