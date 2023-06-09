import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjSOybPGTNdG4YmmWbUHnPZ1CJvtwB24c",
  authDomain: "chat-app-assets.firebaseapp.com",
  projectId: "chat-app-assets",
  storageBucket: "chat-app-assets.appspot.com",
  messagingSenderId: "189754727129",
  appId: "1:189754727129:web:9c565da75659fc47fd7cc8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;

// apiKey: process.env.FIREBASE_APIKEY,
// authDomain: process.env.FIREBASE_AUTHDOMAIN,
// projectId: process.env.FIREBASE_PROJECTID,
// storageBucket: process.env.FIREBASE_STORAGE,
// messagingSenderId: process.env.FIREBASE_SENDERID,
// appId: process.env.FIREBASE_APPID,
