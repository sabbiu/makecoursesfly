import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAPIStatus(): { status: string } {
    return this.appService.getAPIStatus();
  }

  @Get('url-metadata')
  getUrlMetadata(@Query('url') url: string): any {
    console.log(url);
    return this.appService.getUrlMetadata(url);
  }
}
