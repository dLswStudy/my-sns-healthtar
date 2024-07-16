// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from "firebase/app";
import {
    getAuth,
    sendSignInLinkToEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    deleteUser,
    onAuthStateChanged
} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseClientConfig = {
    apiKey: "AIzaSyCQFhQ-YCKW7LRPGY1oOmRXiFjCn5FqiUw",
    authDomain: "my-sns-healthtar.firebaseapp.com",
    projectId: "my-sns-healthtar",
    storageBucket: "my-sns-healthtar.appspot.com",
    messagingSenderId: "863416519237",
    appId: "1:863416519237:web:c60c1964308462f046f12c",
    measurementId: "G-ZZLGX486K8"
};

// Initialize Firebase

// Firebase 앱 초기화
export const app = initializeApp(firebaseClientConfig,'clientApp');
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

const actionCodeSettings = {
    url: process.env.NEXT_PUBLIC_APP_DOMAIN+'/signUp/sentEmail?isEmailSignIn=true',
    handleCodeInApp: true,
    // dynamicLinkDomain: 'example.page.link'
};

export {
    signOut,
    sendSignInLinkToEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    deleteUser,
    onAuthStateChanged,
    actionCodeSettings
}