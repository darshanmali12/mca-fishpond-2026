// Firebase Authentication
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTF9PonOdOnPhAFam5DHg6Cm-j-I650Uo",
    authDomain: "mca-fishpond-2026.firebaseapp.com",
    projectId: "mca-fishpond-2026",
    storageBucket: "mca-fishpond-2026.firebasestorage.app",
    messagingSenderId: "492218394656",
    appId: "1:492218394656:web:87402a0ea67b3af2e1f445",
    measurementId: "G-SMFYY665EH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);


// Get HTML elements
const adminLoginForm = document.getElementById("adminLoginForm");
const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const loginMessage = document.getElementById("loginMessage");


// Login
adminLoginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = adminEmail.value.trim();
    const password = adminPassword.value;

    loginMessage.textContent = "Logging in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent = "Login successful!";

        // Open Admin Dashboard
        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Login failed. Please check your email and password.";

    }

});