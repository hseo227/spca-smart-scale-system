/* eslint-disable no-undef */
var admin = require('firebase-admin');

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.replace(/\\n/gm, '\n') : undefined,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

const HTTP_UNAUTHORISED = 401;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default async function auth(req, res, next) {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_UNAUTHORISED);
  } else {
    const idToken = req.headers.authorization.split(' ')[1];
    console.log(idToken);

    admin
      .auth()
      .verifyIdToken(idToken)
      .then((token) => {
        const { uid } = token;
        req.body.uid = uid;
        next();
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(HTTP_UNAUTHORISED);
      });
  }
}
