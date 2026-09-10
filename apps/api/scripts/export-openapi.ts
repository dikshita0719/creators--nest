import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { stringify } from 'yaml';
import { OpenApiModule } from '../src/openapi.module';

async function exportOpenApi() {
  const app = await NestFactory.create(OpenApiModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Creators Marketplace API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  await writeFile(resolve(__dirname, '../../../docs/api/openapi.yaml'), stringify(document));
  console.log('Wrote docs/api/openapi.yaml');
}

exportOpenApi()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
