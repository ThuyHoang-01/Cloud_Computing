//  // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/compat/app";
// import { getAuth} from 'firebase/compat/auth';
// import {getFirestore} from 'firebase/compat/firestore';
// import { Constants } from "expo-constants";
// const firebaseConfig = {
//     apiKey: Constants.manifest.extra.apiKey,
//     projectId: Constants.manifest.extra.projectId,
//     storageBucket: Constants.manifest.extra.storageBucket,
//     messagingSenderId:Constants.manifest.extra.messagingSenderId,
//     appId: Constants.manifest.extra.appId,
//     databaseURL: Constants.manifest.extra.databaseURL

// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const database = getFirestore();

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/firebase-auth';
import { getFirestore } from 'firebase/firebase-firestore-compat';
import Constants from 'expo-constants';
// Firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  databaseURL: Constants.manifest.extra.databaseURL
};
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();