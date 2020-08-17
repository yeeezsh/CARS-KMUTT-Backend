import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateFileDto } from './dtos/file.create.dto';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private filesService: FileService) {}

  @Post('/')
  @UseGuards(AuthGuard('requestor'))
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateFileDto,
  })
  upload(@UploadedFile() file) {
    return file;
  }

  @Get('/:id')
  @UseGuards(AuthGuard('requestor'))
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header(
      'Content-Disposition',
      `name=${file.filename}; filename=${file.filename}`,
    );
    return filestream.pipe(res);
  }

  @Get('/download/:id')
  @UseGuards(AuthGuard('requestor'))
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);

    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('requestor'))
  async deleteFile(@Param('id') id: string): Promise<any> {
    const filestream = await this.filesService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return;
  }
}
