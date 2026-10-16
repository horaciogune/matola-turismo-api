import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Matola Turismo API está a correr! 🚀';
  }
}