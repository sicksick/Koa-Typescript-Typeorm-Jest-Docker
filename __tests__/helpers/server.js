
const dotenv = require('dotenv');
const config = dotenv.config({path: '.env'}).parsed;
const typeorm = require("typeorm");
const app = require('../../dist/app/koa').default;


const createConncectionDB = function (migrationsRun) {
  return typeorm.createConnection({
    type: config.TEST_TYPEORM_CONNECTION,
    host: config.TEST_TYPEORM_HOST,
    port: config.TEST_TYPEORM_PORT,
    username: config.TEST_TYPEORM_USERNAME,
    password: config.TEST_TYPEORM_PASSWORD,
    database: config.TEST_TYPEORM_DATABASE,
    logging: false,
    migrationsRun: migrationsRun || true,
    entities: [
      "dist/entity/*.*"
    ],
    subscribers: [
      "dist/subscriber/*.js"
    ],
    migrations: [
      "dist/migration/*.js"
    ],
    cli: {
      entitiesDir: "dist/entity",
      migrationsDir: "dist/migration",
      subscribersDir: "dist/subscriber"
    }
  })
};

const clearDb = async function () {
  return createConncectionDB(false).then(async(connection) => {
    const queryRunner = connection.createQueryRunner();
    await queryRunner.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    await connection.close();
  }).catch(error => console.log('TypeORM connection error: ', error));
};

const start = async function () {
  return createConncectionDB().then(async(connection) => {
    const server = app.listen(process.env.TEST_PORT);
    const hostUrl = `http://localhost:${process.env.TEST_PORT}`;
    return {server, hostUrl}
  }).catch(error => console.log('TypeORM connection error: ', error));
};

module.exports = {start, clearDb};
