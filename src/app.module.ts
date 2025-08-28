import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidationOptions, envValidationSchema } from './env.validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      validationOptions: envValidationOptions,
      isGlobal: true, // Make ConfigModule global to avoid importing it in other modules
      expandVariables: true, // Enable variable expansion for environment variables
      cache: true, // Enable caching for improved performance
    }),
    I18nModule.forRoot({
      logging: true,
      fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
