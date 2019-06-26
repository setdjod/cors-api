var port = process.env.PORT || 8080;

var originWhitelist = parseEnvList(process.env.WHITELIST);
var originBlacklist = parseEnvList(process.env.BLACKLIST);

function parseEnvList(env) {
  if (!env) {
    return [];
  }
  return env.split(',');
}

var cors_proxy = require('./src');

cors_proxy.createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: [
    'cookie',
    'cookie2',
    // Strip Heroku-specific headers
    'x-heroku-queue-wait-time',
    'x-heroku-queue-depth',
    'x-heroku-dynos-in-use',
    'x-request-start',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    // Do not add X-Forwarded-For, etc. headers, because Heroku already adds it.
    xfwd: false,
  },
}).listen(port);
