const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://norma.nomoreparties.space',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug'
    })
  );
};
