const firebaseConfig = {
    apiKey: "AIzaSyBZbXG5VwkJkNHKx9RLXM9jvc-b6rCTmqA",
    authDomain: "moodsphere-340e3.firebaseapp.com",
    projectId: "moodsphere-340e3",
    storageBucket: "moodsphere-340e3.firebasestorage.app",
    messagingSenderId: "134296091890",
    appId: "1:134296091890:web:c4eef6265dc58cdf7a246b"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();