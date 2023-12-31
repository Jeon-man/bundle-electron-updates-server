import { LoggerMiddleware } from '@module/logger';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Modules } from '..';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [...Object.values(Modules).filter(m => m && m !== AppModule)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

export default AppModule;
