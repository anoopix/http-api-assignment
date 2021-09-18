const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

const getStyle = (request, response) => respond(request, response, 200, style, 'text/css');

const getMessage = (request, response, responseObj, status, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${responseObj.message}</message>`;

    if (responseObj.id !== undefined) {
      responseXML = `${responseXML} <id>${responseObj.id}</id>`;
    }

    responseXML = `${responseXML} </response>`;

    return respond(request, response, status, responseXML, 'text/xml');
  }

  const msgString = JSON.stringify(responseObj);
  return respond(request, response, status, msgString, 'application/json');
};

// Success
const success = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'This is a successful response.',
    id: 'success',
  };

  getMessage(request, response, responseObj, 200, acceptedTypes);
};

// Bad request
const badRequest = (request, response, params, acceptedTypes) => {
  const responseObj = {
    message: 'This request has the required parameters.',
  };

  if (!params.valid || params.valid !== 'true') {
    responseObj.message = 'Missing valid query parameter set equal to true.';
    responseObj.id = 'badRequest';

    getMessage(request, response, responseObj, 400, acceptedTypes);
    return;
  }

  getMessage(request, response, responseObj, 200, acceptedTypes);
};

// Unauthorized
const unauthorized = (request, response, params, acceptedTypes) => {
  const responseObj = {
    message: 'This request is now authorized :)',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseObj.message = 'Missing loggedIn query parameter set to yes';
    responseObj.id = 'unauthorized';

    getMessage(request, response, responseObj, 401, acceptedTypes);
    return;
  }

  getMessage(request, response, responseObj, 200, acceptedTypes);
};

// Forbidden
const forbidden = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'You do not have access to this content',
    id: 'forbidden',
  };

  getMessage(request, response, responseObj, 403, acceptedTypes);
};

// Internal
const internal = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  getMessage(request, response, responseObj, 500, acceptedTypes);
};

// Not implemented
const notImplemented = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'The page you are looking for has not been implemented.',
    id: 'notImplemented',
  };

  getMessage(request, response, responseObj, 501, acceptedTypes);
};

// Not found
const notFound = (request, response, acceptedTypes) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  getMessage(request, response, responseObj, 404, acceptedTypes);
};

module.exports = {
  getIndex,
  getStyle,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
