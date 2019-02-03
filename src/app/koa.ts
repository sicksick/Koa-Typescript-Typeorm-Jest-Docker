import 'reflect-metadata';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as Router from 'koa-router';
import { config } from './config';
import { CustomErrorHandler, WinstonLoggingMiddleware } from './middleware';
import { useKoaServer } from 'routing-controllers';
import serve = require('koa-static');

const passport = require('./passport');

const router = new Router();
const app = new Koa();

app.use(helmet());

app.use(serve(config.homeDir + 'public'));

app.use(bodyParser());

app.use(passport.initialize());

router.all('/api/*', passport.authenticate('jwt'));
app.use(router.routes());

useKoaServer(app, {
  defaultErrorHandler: false,
  development: true,
  middlewares: [WinstonLoggingMiddleware, CustomErrorHandler],
  controllers: [__dirname + '/../routes/*.js'] // we specify controllers we want to use
});

export default app;
