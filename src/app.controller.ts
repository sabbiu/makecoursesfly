import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('url-metadata')
  getUrlMetadata(@Query('url') url: string): any {
    return this.appService.getUrlMetadata(url);
  }
}
