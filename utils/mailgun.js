const Mailgun = require('mailgun-js');

const config = require('../config');
const log = require('./logger');

let mailgun = Mailgun({
  apiKey: config.get('MAILGUN_API_KEY'),
  domain: 'mg.rokotuskortti.com',
  host: 'api.eu.mailgun.net'
});

function send(msg) {
  log.debug('Preparing to send an email', { msg });

  if (msg == null || typeof msg !== 'object') {
    log.warn('Incorrent message: msg must be object');
    return false;
  }

  if (msg.to == null) {
    log.warn('Email recipient must be specified');
    return false;
  }

  if (msg.subject == null) {
    log.warn('Email subject must be specified');
    return false;
  }

  if (msg.text == null) {
    log.warn('Email text must be specified');
    return false;
  }

  if (msg.from == null) {
    msg.from = 'noreply@mg.rokotuskortti.com';
    log.debug('Using default from address ', { from: msg.from });
  }

  mailgun.messages().send(msg, function(error, body) {
    if (error != null) {
      log.warn('Error sending email', { error: error });
    } else {
      log.info('Email sent succesfully');
      log.debug('Email sent succesfully - server reply', { status: body });
    }
  });

  return true;
}

module.exports.mailgun = mailgun;
module.exports.send = send;
