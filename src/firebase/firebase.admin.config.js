import {getFirestore} from "firebase-admin/firestore";
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require("./my-sns-healthtar-firebase-adminsdk-rzzkd-dbd3258b98.json");

const {initializeApp, getApp, getApps, cert} = require('firebase-admin/app');

let app;
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: "gs://my-sns-healthtar.appspot.com"
    });
} else {
    app = getApp();
}

export const db = getFirestore(app);
export const storage = getStorage(app)