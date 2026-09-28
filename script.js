/* ==========================================
   FIREBASE IMPORTS
========================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* ==========================================
   FIREBASE CONFIGURATION
========================================== */

const firebaseConfig = {

    apiKey: "AIzaSyDTF9PonOdOnPhAFam5dhg6Cm-j-I650Uo",

    authDomain: "mca-fishpond-2026.firebaseapp.com",

    projectId: "mca-fishpond-2026",

    storageBucket: "mca-fishpond-2026.firebasestorage.app",

    messagingSenderId: "492218394656",

    appId: "1:492218394656:web:87402a0ea67b3af2e1f445",

    measurementId: "G-SMFYY665EH"

};


/* ==========================================
   INITIALIZE FIREBASE
========================================== */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* ==========================================
   GET HTML ELEMENTS
========================================== */

// Receiver
const receiverRoll =
    document.getElementById("receiverRoll");

const receiverNameInput =
    document.getElementById("receiverNameInput");

const receiverClassInput =
    document.getElementById("receiverClassInput");


// Fishpond
const fishpondType =
    document.getElementById("fishpondType");

const fishpondContent =
    document.getElementById("fishpondContent");


// Media Link
const mediaLink =
    document.getElementById("mediaLink");


// Character counter
const characterCount =
    document.getElementById("characterCount");


// Form
const fishpondForm =
    document.getElementById("fishpondForm");


// Success card
const successReceiver =
    document.getElementById("successReceiver");

const successType =
    document.getElementById("successType");

const successContent =
    document.getElementById("successContent");


// Success card itself
const successCard =
    document.getElementById("successCard");


// New fishpond button
const newFishpondBtn =
    document.getElementById("newFishpondBtn");


/* ==========================================
   ROLL NUMBER VALIDATION
========================================== */

function isValidRollNumber(value) {

    const roll = Number(value);

    return (
        Number.isInteger(roll) &&
        roll >= 1 &&
        roll <= 70
    );

}


/* ==========================================
   NAME VALIDATION
========================================== */

function isValidName(name) {

    return /^[A-Za-z ]+$/.test(
        name.trim()
    );

}


/* ==========================================
   URL VALIDATION
========================================== */

function isValidURL(url) {

    try {

        const parsedURL =
            new URL(url);

        return (
            parsedURL.protocol === "http:" ||
            parsedURL.protocol === "https:"
        );

    }

    catch (error) {

        return false;

    }

}


/* ==========================================
   CHARACTER COUNTER
========================================== */

fishpondContent.addEventListener(
    "input",
    function () {

        characterCount.textContent =
            this.value.length;

    }
);


/* ==========================================
   FORM SUBMISSION
========================================== */

fishpondForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* ==========================================
           GET VALUES
        ========================================== */

        const receiverRollNumber =
            Number(receiverRoll.value);

        const receiverName =
            receiverNameInput.value.trim();

        const receiverClass =
            receiverClassInput.value;

        const type =
            fishpondType.value;

        const content =
            fishpondContent.value.trim();

        const mediaURL =
            mediaLink.value.trim();


        /* ==========================================
           VALIDATE RECEIVER ROLL NUMBER
        ========================================== */

        if (
            !isValidRollNumber(
                receiverRoll.value
            )
        ) {

            alert(
                "Receiver Roll Number must be between 1 and 70."
            );

            receiverRoll.focus();

            return;

        }


        /* ==========================================
           VALIDATE RECEIVER NAME
        ========================================== */

        if (!receiverName) {

            alert(
                "Please enter the receiver's full name."
            );

            receiverNameInput.focus();

            return;

        }


        if (!isValidName(receiverName)) {

            alert(
                "Receiver name should contain only letters and spaces."
            );

            receiverNameInput.focus();

            return;

        }


        /* ==========================================
           VALIDATE CLASS
        ========================================== */

        if (!receiverClass) {

            alert(
                "Please select the receiver's class."
            );

            receiverClassInput.focus();

            return;

        }


        /* ==========================================
           VALIDATE FISHPOND TYPE
        ========================================== */

        if (!type) {

            alert(
                "Please select a Fishpond type."
            );

            fishpondType.focus();

            return;

        }


        /* ==========================================
           VALIDATE CONTENT
        ========================================== */

        if (!content) {

            alert(
                "Please enter the Fishpond message."
            );

            fishpondContent.focus();

            return;

        }


        /* ==========================================
           VALIDATE MEDIA LINK
        ========================================== */

        if (mediaURL && !isValidURL(mediaURL)) {

            alert(
                "Please enter a valid media link starting with http:// or https://"
            );

            mediaLink.focus();

            return;

        }


        /* ==========================================
           DISABLE SUBMIT BUTTON
        ========================================== */

        const submitBtn =
            document.getElementById(
                "submitBtn"
            );


        submitBtn.disabled = true;

        submitBtn.textContent =
            "Saving Fishpond...";


        try {

            /* ==========================================
               CREATE FIRESTORE DOCUMENT
            ========================================== */

            const fishpondData = {

                // Receiver information

                receiverRoll:
                    receiverRollNumber,

                receiverName:
                    receiverName,

                receiverClass:
                    receiverClass,


                // Fishpond information

                fishpondType:
                    type,

                fishpondContent:
                    content,


                // Media information

                mediaLink:
                    mediaURL,


                // Timestamp

                createdAt:
                    serverTimestamp()

            };


            const fishpondDoc =
                await addDoc(
                    collection(
                        db,
                        "fishponds"
                    ),
                    fishpondData
                );


            console.log(
                "Fishpond saved successfully:",
                fishpondDoc.id
            );


            /* ==========================================
               SHOW SUCCESS INFORMATION
            ========================================== */

            successReceiver.textContent =
                `${receiverName} (Roll No. ${receiverRollNumber}, ${receiverClass})`;


            successType.textContent =
                type;


            successContent.textContent =
                content;


            /* ==========================================
               HIDE FORM
            ========================================== */

            fishpondForm.style.display =
                "none";


            /* ==========================================
               SHOW SUCCESS CARD
            ========================================== */

            successCard.style.display =
                "block";


            /* ==========================================
               SCROLL TO SUCCESS CARD
            ========================================== */

            successCard.scrollIntoView({

                behavior: "smooth"

            });


        }

        catch (error) {

            console.error(
                "Firebase Error:",
                error
            );


            alert(
                "Fishpond could not be saved.\n\n" +
                error.message
            );

        }

        finally {

            submitBtn.disabled =
                false;

            submitBtn.textContent =
                "🐟 Submit Fishpond";

        }

    }
);


/* ==========================================
   GIVE ANOTHER FISHPOND
========================================== */

newFishpondBtn.addEventListener(
    "click",
    function () {

        fishpondForm.reset();


        characterCount.textContent =
            "0";


        successReceiver.textContent =
            "-";


        successType.textContent =
            "-";


        successContent.textContent =
            "-";


        successCard.style.display =
            "none";


        fishpondForm.style.display =
            "block";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   FISHPOND SUBMISSION STATUS
========================================================= */

const submissionClosedBanner =
    document.getElementById(
        "submissionClosedBanner"
    );


const studentSubmissionStatus =
    document.getElementById(
        "studentSubmissionStatus"
    );


const fishpondFormElement =
    document.getElementById(
        "fishpondForm"
    );


const fishpondSettingsRef =
    doc(
        db,
        "settings",
        "fishpond"
    );


onSnapshot(
    fishpondSettingsRef,

    (snapshot) => {

        const acceptingSubmissions =
            snapshot.exists()
                ? snapshot.data().acceptingSubmissions !== false
                : true;


        if (acceptingSubmissions) {

            /* =========================
               SUBMISSIONS OPEN
            ========================= */

            if (submissionClosedBanner) {

                submissionClosedBanner.style.display =
                    "none";

            }


            if (fishpondFormElement) {

                fishpondFormElement.classList.remove(
                    "submissions-closed"
                );


                fishpondFormElement
                    .querySelectorAll(
                        "input, select, textarea, button"
                    )
                    .forEach((element) => {

                        element.disabled =
                            false;

                    });

            }

        }

        else {

            /* =========================
               SUBMISSIONS CLOSED
            ========================= */

            if (submissionClosedBanner) {

                submissionClosedBanner.style.display =
                    "flex";

            }


            if (studentSubmissionStatus) {

                studentSubmissionStatus.textContent =
                    "The admin has temporarily stopped accepting Fishponds. Please try again later.";

            }


            if (fishpondFormElement) {

                fishpondFormElement.classList.add(
                    "submissions-closed"
                );


                fishpondFormElement
                    .querySelectorAll(
                        "input, select, textarea, button"
                    )
                    .forEach((element) => {

                        element.disabled =
                            true;

                    });

            }

        }

    },


    (error) => {

        console.error(
            "Unable to check Fishpond submission status:",
            error
        );

    }

);
