import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAPIStatus(): { status: string } {
    return { status: 'success' };
  }
}
