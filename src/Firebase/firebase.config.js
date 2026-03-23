// import { initializeApp } from 'firebase/app';
// // import { getAnalytics } from 'firebase/analytics';

// import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyALu9X1znQC4w7KLr8cQ7yMj68OnN-xCAQ',
//   authDomain: 'pet-adoption-b3a72.firebaseapp.com',
//   projectId: 'pet-adoption-b3a72',
//   storageBucket: 'pet-adoption-b3a72.firebasestorage.app',
//   messagingSenderId: '465958224446',
//   appId: '1:465958224446:web:f16381b5cf33b5978ac76f',
//   measurementId: 'G-WBJ4Q9SQLW',
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyALu9X1znQC4w7KLr8cQ7yMj68OnN-xCAQ',
  authDomain: 'pet-adoption-b3a72.firebaseapp.com',
  projectId: 'pet-adoption-b3a72',
  storageBucket: 'pet-adoption-b3a72.firebasestorage.app',
  messagingSenderId: '465958224446',
  appId: '1:465958224446:web:f16381b5cf33b5978ac76f',
  measurementId: 'G-WBJ4Q9SQLW',
};

// ✅ Prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
