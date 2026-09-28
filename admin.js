import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyDTF9PonOdOnPhAFam5DHg6Cm-j-I650Uo",
    authDomain: "mca-fishpond-2026.firebaseapp.com",
    projectId: "mca-fishpond-2026",
    storageBucket: "mca-fishpond-2026.firebasestorage.app",
    messagingSenderId: "492218394656",
    appId: "1:492218394656:web:87402a0ea67b3af2e1f445",
    measurementId: "G-SMFYY665EH"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminEmail =
    document.getElementById("adminEmail");

const adminPassword =
    document.getElementById("adminPassword");

const loginMessage =
    document.getElementById("loginMessage");


adminLoginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = adminEmail.value.trim();
    const password = adminPassword.value;

    loginMessage.textContent = "Logging in...";

    try {

        // Firebase login
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        console.log("Login successful!");
        console.log("Admin:", userCredential.user.email);
        console.log("UID:", userCredential.user.uid);

        loginMessage.textContent =
            "Login successful! Opening dashboard...";


        // Redirect to dashboard
        window.location.assign("dashboard.html");


    } catch (error) {

        console.error("Firebase Login Error:", error);

        loginMessage.textContent =
            "Login failed: " + error.code;

    }

});
