import { Injectable, Inject } from '@nestjs/common';

import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as GridFsStorage from 'multer-gridfs-storage';

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  gridFsStorage: GridFsStorage;
  constructor(@Inject('DATABASE_CONNECTION') private readonly db) {
    this.gridFsStorage = new GridFsStorage({
      db: this.db,
      // tslint:disable-next-line: variable-name
      file: (_req, file) => {
        return file.originalname + '-' + Date.now();
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
      limits: {
        fileSize: 23437.5 * 1024, // 24MB
      },
    };
  }
}
