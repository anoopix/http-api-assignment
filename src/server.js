const http = require('http');
const query = require('querystring');
const url = require('url');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responses.getIndex,
  '/style.css': responses.getStyle,
  '/success': responses.success,
  '/badRequest': responses.badRequest,
  '/unauthorized': responses.unauthorized,
  '/forbidden': responses.forbidden,
  '/internal': responses.internal,
  '/notImplemented': responses.notImplemented,
  notFound: responses.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');

  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    if (parsedUrl.pathname === '/') {
      urlStruct[parsedUrl.pathname](request, response);
    } else if (parsedUrl.pathname === '/badRequest' || parsedUrl.pathname === '/unauthorized') {
      urlStruct[parsedUrl.pathname](request, response, params, acceptedTypes);
    } else {
      urlStruct[parsedUrl.pathname](request, response, acceptedTypes);
    }
  } else {
    urlStruct.notFound(request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);

// console.log(`Listening on 127.0.0.1: ${port}`);
