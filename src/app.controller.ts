import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicEndpoint } from './_decorators/setters/publicEndpoint.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @PublicEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
