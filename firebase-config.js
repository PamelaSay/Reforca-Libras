// Configuração compartilhada do Firebase.
// A senha dos usuários é administrada pelo Firebase Authentication e não é
// armazenada no código nem no Firestore.
const firebaseConfig = {
    apiKey: "AIzaSyCA5nHe1MRdnYR70flitnIjI75IOkh0ji8",
    authDomain: "reforca-app-25554.firebaseapp.com",
    projectId: "reforca-app-25554",
    storageBucket: "reforca-app-25554.firebasestorage.app",
    messagingSenderId: "469342727365",
    appId: "1:469342727365:web:cd2def6eafd29e615114ac",
    measurementId: "G-0YVN46JS8W"
};

let db = null;
let auth = null;

try {
    if (typeof firebase === "undefined") {
        throw new Error("Firebase não foi carregado pelo HTML.");
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();
    auth = firebase.auth();
} catch (erro) {
    console.error("Erro ao iniciar o Firebase:", erro);
}
