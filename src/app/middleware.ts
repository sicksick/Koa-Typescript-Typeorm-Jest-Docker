import * as Koa from 'koa';
import * as winston from 'winston';
import {
  Middleware,
  Ctx,
  KoaMiddlewareInterface,
} from 'routing-controllers';
import CustomError from '../helpers/error';


@Middleware({ type: 'before' })
export class WinstonLoggingMiddleware implements KoaMiddlewareInterface {

  async use(@Ctx() ctx, next: (err?: any) => any): Promise<void> {
    const start = new Date().getMilliseconds();

    await next();

    const ms = new Date().getMilliseconds() - start;

    let logLevel: string;

    if (ctx.res.statusCode >= 100) {
      logLevel = 'info';
    }
    if (ctx.res.statusCode >= 400) {
      logLevel = 'warn';
    }
    if (ctx.res.statusCode >= 500) {
      logLevel = 'error';
    }

    let msg: string = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;

    winston.configure({
      level: process.env.NODE_ENV == 'development' ? 'debug' : 'info',
      transports: [
        // - Write to all logs with specified level to console.
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
    if (ctx.res.statusCode >= 400) {
      msg = msg + `
      body: ${ctx.request.body && JSON.stringify(ctx.request.body)},
      params: ${ctx.params && JSON.stringify(ctx.params)},
      query: ${ctx.query && JSON.stringify(ctx.query)}`;
    }
    winston.log(logLevel, msg + '\n');
  }

}

@Middleware({ type: 'before' })
export class CustomErrorHandler implements KoaMiddlewareInterface {
  async use(@Ctx() ctx, next: (err?: any) => Promise<any>): Promise<any> {
    try {
      await next();
    } catch (e) {
      if (e instanceof CustomError) {
        if (e.message) ctx.body = e.message;
        ctx.res.statusCode = e.status;
        return ctx.res;
      }

      ctx.body = {
        message: 'Internal Server Error',
      };
      ctx.res.statusCode = 500;
      return ctx.res;
    }
  }
}
