const admin = require('firebase-admin');
const serviceAccount = require("./my-sns-healthtar-firebase-adminsdk-rzzkd-dbd3258b98.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://my-sns-healthtar.appspot.com"
});

export const db = admin.firestore();
export const bucket = admin.storage().bucket();