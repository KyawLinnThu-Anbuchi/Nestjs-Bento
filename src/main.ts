import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.CONSUMER_PORT || 8004;

  /**
   * Create Nest Fastify Application
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn', 'debug'] },
  );

  /**
   * Global Prefix
   * Exclude root path from global prefix
   */
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  /**
   * API Versioning
   * Enable URI versioning with default version '1'
   */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /**
   * Enable CORS
   * Allow requests from any origin
   */
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  /**
   * Global Validation Pipe
   * - whitelist: true - Strip properties that do not have any decorators
   * - forbidNonWhitelisted: true - Throw an error if non-whitelisted properties are present
   * - transform: true - Automatically transform payloads to be objects typed according to their DTO classes
   * - stopAtFirstError: true - Stop validation on the first error encountered
   * - exceptionFactory: Custom factory to generate I18nValidationException with validation errors
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => new I18nValidationException(errors),
    }),
  );

  /**
   * Global Exception Filter
   * - I18nValidationExceptionFilter - Custom filter to handle I18nValidationException
   */
  app.useGlobalFilters(new I18nValidationExceptionFilter({}));

  /**
   * Start Application
   */
  await app
    .listen(PORT)
    .then(() => {
      console.debug(`🚀 Application is running on: ${PORT}`);
      Logger.log(`🚀 Application is running on: ${PORT}`);
    })
    .catch((err) => {
      console.error('Error starting application:', err);
    });
}
void bootstrap();
