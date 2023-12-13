import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Modules } from '..';

@Module({
  imports: [...Object.values(Modules).filter(m => m && m !== AppModule)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

export default AppModule;
