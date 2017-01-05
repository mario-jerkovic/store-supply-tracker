import jwt from 'jsonwebtoken';
import config from '../config/environment';

const ANONYMOUS_TOKEN_DATA = {
  personId: null,
  accessLevel: 128,
  locationAccessLevel: [],
  locations: []
};

function createToken(req, res, userData) {
  const token = jwt.sign(userData, config.jwt.secret, { expiresIn: config.jwt.expires }); // eslint-disable-line no-param-reassign
  req.user = userData;                                                                    // eslint-disable-line no-param-reassign
  req.session.token = token;                                                              // eslint-disable-line no-param-reassign

  return token;
}

function createAnonymousToken(req, res) {
  return createToken(req, res, ANONYMOUS_TOKEN_DATA);
}

function getSessionData(req, res, next) {
  const token = req.session.token; // eslint-disable-line dot-notation

  if (!token) {
    createAnonymousToken(req, res);
  } else {
    try {
      const user = jwt.verify(token, config.jwt.secret); // eslint-disable-line no-unused-vars
      // console.log('USER:', user);
    } catch (e) {
      console.log(e); // eslint-disable-line no-console
    }
  }

  next();
}

export {
  createToken,
  createAnonymousToken,
  getSessionData,
};
