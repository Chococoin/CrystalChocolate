const got    = require('got');
const crypto = require('crypto');
const qs     = require('qs');

const methods = {
  private : [ 'Balance' ]
};

const defaults = {
  url     : 'https://api.kraken.com',
  version : 0,
  timeout : 5000,
};

const getMessageSignature = (path, request, secret, nonce) => {
  const message       = qs.stringify(request);
  const secret_buffer = new Buffer(secret, 'base64');
  const hash          = new crypto.createHash('sha256');
  const hmac          = new crypto.createHmac('sha512', secret_buffer);
  const hash_digest   = hash.update(nonce + message).digest('binary');
  const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

  return hmac_digest;
};

const rawRequest = async (url, headers, data, timeout) => {
  headers['User-Agent'] = 'Kraken Javascript API Client';

  const options = { headers, timeout };

  Object.assign(options, {
    method : 'POST',
    body   : qs.stringify(data),
  });

  const { body } = await got(url, options);
  const response = JSON.parse(body);

  if(response.error && response.error.length) {
    const error = response.error
      .filter((e) => e.startsWith('E'))
      .map((e) => e.substr(1));

    if(!error.length) {
      throw new Error("Kraken API returned an unknown error");
    }

    throw new Error(error.join(', '));
  }

  return response;
};

class KrakenClient {
  constructor(key, secret, options) {
    if(typeof options === 'string') {
      options = { otp : options };
    }

    this.config = Object.assign({ key, secret }, defaults, options);
  }

  api(method, params, callback) {
    if(typeof params === 'function') {
      callback = params;
      params   = {};
    }

    if(methods.private.includes(method)) {
      return this.privateMethod(method, params, callback);
    }
    else {
      throw new Error(method + ' is not a valid API method.');
    }
  }

  privateMethod(method, params, callback) {
    params = params || {};
    if(typeof params === 'function') {
      callback = params;
      params   = {};
    }

    const path = '/' + this.config.version + '/private/' + method;
    const url  = this.config.url + path;

    if(!params.nonce) {
      params.nonce = new Date() * 1000;
    }

    if(this.config.otp !== undefined) {
      params.otp = this.config.otp;
    }

    const signature = getMessageSignature(
      path,
      params,
      this.config.secret,
      params.nonce
    );

    const headers = {
      'API-Key'  : this.config.key,
      'API-Sign' : signature,
    };

    const response = rawRequest(url, headers, params, this.config.timeout);

    if(typeof callback === 'function') {
      response
        .then((result) => callback(null, result))
        .catch((error) => callback(error, null));
    }

    return response;
  }
}

module.exports = KrakenClient;