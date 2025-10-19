const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "../private/serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const bucket = admin.storage().bucket("cloud-database-92e90.appspot.com");

module.exports = bucket;
