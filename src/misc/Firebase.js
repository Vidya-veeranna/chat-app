import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyBHtKwvaZuvflfFlnK7as-47e5im89Ozc4',
  authDomain: 'chat-web-app-1eb05.firebaseapp.com',
  databaseURL:
    'https://chat-web-app-1eb05-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chat-web-app-1eb05',
  storageBucket: 'chat-web-app-1eb05.appspot.com',
  messagingSenderId: '527417942352',
  appId: '1:527417942352:web:aed5f1018da5ccdbb70c55',
};

const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
