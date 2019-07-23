import Constants from "expo-constants";
import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp(Constants.manifest.extra.FIREBASE_CONFIG);

export const db = firebase.firestore();
