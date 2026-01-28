require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: '../../migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: '../../seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 2, max: 20 },
    migrations: {
      directory: '../../migrations',
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 1, max: 5 },
    migrations: {
      directory: '../../migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: '../../seeds',
    },
  },
};
