// Load environment variables from .env
require('dotenv').config();

const convict = require('convict');

const config = convict({
  NODE_ENV: {
    env: 'NODE_ENV',
    default: 'development',
    format: ['production', 'development', 'test'],
    doc: 'The application environment.'
  },
  PORT: {
    env: 'PORT',
    default: 3000,
    format: 'port',
    doc: 'The port to start the http-server.'
  },
  LOG_LEVEL: {
    env: 'LOG_LEVEL',
    default: 'debug',
    format: ['error', 'warn', 'info', 'debug', 'trace'],
    doc: 'The application logging level.'
  },
  DATABASE_URL: {
    env: 'DATABASE_URL',
    default: null,
    format: String,
    doc:
      'Database connection in the following format: postgres://user:password@localhost:5432/database'
  },
  SESSION_SECRET: {
    env: 'SESSION_SECRET',
    default: 'oletussessiosekret',
    format: String,
    doc: 'The session secret to encrypt cookie'
  },
  MAILGUN_API_KEY: {
    env: 'MAILGUN_API_KEY',
    default: '',
    format: String,
    doc: 'Mailgun api key for sending emails'
  },
  // Constant not probably modified using environment variable
  DEFAULT_REMINDER_DAYS: {
    env: 'DEFAULT_REMINDER_DAYS',
    default: 30,
    format: 'int',
    doc:
      'Default value for the amount of days before booster reminder emails are sent'
  },
  DATE_FORMAT: {
    env: 'DATE_FORMAT',
    default: 'D.M.YYYY',
    format: String,
    doc: 'The date format used when parsing date strings'
  }
});

config.validate({ allowed: 'strict' }); // throws error if config does not conform to schema

module.exports = config;
