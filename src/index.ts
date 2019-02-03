require('dotenv').config({path: `.env`});
import * as Koa from 'koa';
import 'reflect-metadata';
import * as typeorm from 'typeorm';
import * as appInstance from './app/koa';

typeorm.createConnection().then(async () => {
  const app: Koa = appInstance.default;
  app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT} \n`));
}).catch(error => console.log('TypeORM connection error: ', error));


