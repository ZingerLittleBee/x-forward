import { Controller, Get } from '@nestjs/common';

@Controller('env')
export class EnvController {

  @Get('')
  test() {
    return '123'
  }
}
