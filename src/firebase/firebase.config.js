// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCQFhQ-YCKW7LRPGY1oOmRXiFjCn5FqiUw",
    authDomain: "my-sns-healthtar.firebaseapp.com",
    projectId: "my-sns-healthtar",
    storageBucket: "my-sns-healthtar.appspot.com",
    messagingSenderId: "863416519237",
    appId: "1:863416519237:web:c60c1964308462f046f12c",
    measurementId: "G-ZZLGX486K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export {createUserWithEmailAndPassword}