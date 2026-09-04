import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA5l-8xOAHBlJXGOD4wvI-2IrtfeMJ_doU",
  authDomain: "casa-manager-a15cb.firebaseapp.com",
  projectId: "casa-manager-a15cb",
  storageBucket: "casa-manager-a15cb.firebasestorage.app",
  messagingSenderId: "598603920219",
  appId: "1:598603920219:web:b20ead5b4e16b12717607e"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
