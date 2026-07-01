// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBAClQXyNUufgCF7QGSbO1MYD5gkEd-8tI",
//   authDomain: "invoice-gen-v2.firebaseapp.com",
//   projectId: "invoice-gen-v2",
//   // storageBucket: "invoice-gen-v2.firebasestorage.app",
//   storageBucket: "invoice-gen-v2.appspot.com",
//   messagingSenderId: "1020522331262",
//   appId: "1:1020522331262:web:813082a91f30badfa62c2f",
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "invoice-gen-v2.firebaseapp.com",
  projectId: "invoice-gen-v2",
  storageBucket: "invoice-gen-v2.firebasestorage.app",
  messagingSenderId: "1020522331262",
  appId: "1:1020522331262:web:813082a91f30badfa62c2f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
