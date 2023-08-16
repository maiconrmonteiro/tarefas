import { initializeApp } from "firebase/app";


// foi importado manualmente para poder conectar o fire
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDb6Q_XqwmGw41CrL_NhORETZFFHTeU_Ao",
  authDomain: "tarefas-mais.firebaseapp.com",
  projectId: "tarefas-mais",
  storageBucket: "tarefas-mais.appspot.com",
  messagingSenderId: "1073301207968",
  appId: "1:1073301207968:web:611531337fdf3488f082c5"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export { db }