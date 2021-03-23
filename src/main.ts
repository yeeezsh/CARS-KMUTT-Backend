import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { APP_CONFIG } from './config/config.constant';
import { ConfigModule } from './config/config.module';
import { ConfigProvider } from './config/configuration.provider.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigProvider = app.select(ConfigModule).get(APP_CONFIG);

  app.use(compression());
  app.enableCors({
    origin: [config.origin],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');
  app.use(cookieParser());

  if (config.node_env === 'development') {
    const options = new DocumentBuilder()
      .setTitle('CARs API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
  }

  await app.listen(3000);
}
bootstrap();
