import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCvZuRYKfMsGVdSbd2AluVBa5i3qYPNkbo',
  authDomain: 'pdf-resummer-d822e.firebaseapp.com',
  projectId: 'pdf-resummer-d822e',
  storageBucket: 'pdf-resummer-d822e.appspot.com',
  messagingSenderId: '1062965900700',
  appId: '1:1062965900700:web:1338c5916c0e9819f48459',
  measurementId: "G-RKFN294VGW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
