import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';

@Injectable()
export class FileService {
  private fileModel: MongoGridFS;

  constructor(@Inject('DATABASE_CONNECTION') private readonly db) {
    const connector = this.db.connections[0].db;
    this.fileModel = new MongoGridFS(connector, 'fs');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<any> {
    try {
      const result = await this.fileModel.findById(id);

      return {
        filename: result.filename,
        length: result.length,
        chunkSize: result.chunkSize,
        md5: result.md5,
        contentType: result.contentType,
      };
    } catch (err) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }
}
