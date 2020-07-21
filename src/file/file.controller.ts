import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateFileDto } from './dtos/file.create.dto';

@Controller('file')
export class FileController {
  constructor(private filesService: FileService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateFileDto,
  })
  upload(@UploadedFile() file) {
    return file;
  }

  // @Get('/:id')
  // async getFile(@Param('id') id: string) {}

  // @Get('info/:id')
  // async getFileInfo(@Param('id') id: string): Promise<any> {
  //   const file = await this.filesService.findInfo(id);
  //   const filestream = await this.filesService.readStream(id);
  //   if (!filestream) {
  //     throw new HttpException(
  //       'An error occurred while retrieving file info',
  //       HttpStatus.EXPECTATION_FAILED,
  //     );
  //   }
  //   return {
  //     message: 'File has been detected',
  //     file: file,
  //   };
  // }

  @Get('/:id')
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    console.log(file);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('/download/:id')
  // @ApiBadRequestResponse({ type: ApiException })
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

  @Get('/delete/:id')
  // @ApiBadRequestResponse({ type: ApiException })
  // @ApiCreatedResponse({ type: FileResponseVm })
  async deleteFile(@Param('id') id: string): Promise<any> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }
}
