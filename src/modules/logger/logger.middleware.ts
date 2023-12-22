import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { Handler, Request, Response } from 'express';
import morgan, { format } from 'morgan';

format(
  'custom',
  ':remote-addr ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', // + ' :request-body :response-body'
);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  logger: Handler;
  constructor() {
    this.logger = morgan('custom', {
      stream: {
        write: (message: string) => {
          Logger.log(message, 'Morgan');
        },
      },
    });
  }

  use(req: Request, res: Response, next: () => void) {
    const originalSend = res.send;

    res.send = function (body: any) {
      (res as any).resBody = body;
      return originalSend.call(this, body);
    };

    this.logger(req, res, next);
  }
}
