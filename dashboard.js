// =========================================================
// FIREBASE IMPORTS
// =========================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =========================================================
// FIREBASE CONFIGURATION
// =========================================================

const firebaseConfig = {
    apiKey: "AIzaSyDTF9PonOdOnPhAFam5DHg6Cm-j-I650Uo",
    authDomain: "mca-fishpond-2026.firebaseapp.com",
    projectId: "mca-fishpond-2026",
    storageBucket: "mca-fishpond-2026.firebasestorage.app",
    messagingSenderId: "492218394656",
    appId: "1:492218394656:web:87402a0ea67b3af2e1f445",
    measurementId: "G-SMFYY665EH"
};


// =========================================================
// INITIALIZE FIREBASE
// =========================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =========================================================
// GET HTML ELEMENTS
// =========================================================

// Statistics
const totalFishponds =
    document.getElementById("totalFishponds");

const danceCount =
    document.getElementById("danceCount");

const musicCount =
    document.getElementById("musicCount");

const taskCount =
    document.getElementById("taskCount");


// Table
const tableBody =
    document.getElementById("fishpondTableBody");

const loadingMessage =
    document.getElementById("loadingMessage");


// Filters
const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const classFilter =
    document.getElementById("classFilter");


// Buttons
const refreshBtn =
    document.getElementById("refreshBtn");

const exportBtn =
    document.getElementById("exportBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// Modal
const fishpondModal =
    document.getElementById("fishpondModal");

const closeModal =
    document.getElementById("closeModal");

const fishpondDetails =
    document.getElementById("fishpondDetails");


// =========================================================
// SUBMISSION CONTROL ELEMENTS
// =========================================================

const toggleSubmissionBtn =
    document.getElementById("toggleSubmissionBtn");

const submissionStatusText =
    document.getElementById("submissionStatusText");

const submissionStatusBadge =
    document.getElementById("submissionStatusBadge");

const submissionStatusDot =
    document.getElementById("submissionStatusDot");

const submissionStatusLabel =
    document.getElementById("submissionStatusLabel");


// =========================================================
// STORE ALL FISHPONDS
// =========================================================

let allFishponds = [];


// =========================================================
// STORE SUBMISSION STATUS
// =========================================================

// true = students can submit
// false = students cannot submit

let acceptingSubmissions = true;


// =========================================================
// CHECK ADMIN LOGIN
// =========================================================

onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log(
            "Logged-in admin:",
            user.email
        );


        // Load both dashboard data and submission status

        loadFishponds();

        loadSubmissionStatus();

    } else {

        console.log(
            "No authenticated user."
        );

        window.location.href =
            "admin.html";

    }

});


// =========================================================
// LOAD FISHPONDS FROM FIRESTORE
// =========================================================

async function loadFishponds() {

    try {

        console.log(
            "Loading fishponds from Firestore..."
        );


        loadingMessage.style.display =
            "block";

        loadingMessage.textContent =
            "Loading fishpond submissions...";


        const fishpondQuery = query(
            collection(db, "fishponds"),
            orderBy("createdAt", "desc")
        );


        const snapshot =
            await getDocs(fishpondQuery);


        allFishponds = [];


        snapshot.forEach((firebaseDoc) => {

            const data =
                firebaseDoc.data();


            allFishponds.push({

                id: firebaseDoc.id,

                ...data

            });

        });


        console.log(
            "Fishponds loaded:",
            allFishponds
        );


        loadingMessage.style.display =
            "none";


        updateStatistics();

        displayFishponds(
            allFishponds
        );


    } catch (error) {

        console.error(
            "Firestore loading error:",
            error
        );


        loadingMessage.style.display =
            "block";


        loadingMessage.textContent =
            "Unable to load fishpond data.";


        alert(
            "Unable to load Fishpond data. Please check Firebase Authentication and Firestore rules."
        );

    }

}


// =========================================================
// LOAD SUBMISSION STATUS
// =========================================================

async function loadSubmissionStatus() {

    try {

        console.log(
            "Checking Fishpond submission status..."
        );


        const settingsRef =
            doc(
                db,
                "settings",
                "fishpond"
            );


        const settingsSnapshot =
            await getDoc(settingsRef);


        if (
            settingsSnapshot.exists()
        ) {

            const data =
                settingsSnapshot.data();


            // If field exists, use it

            if (
                typeof data.acceptingSubmissions ===
                "boolean"
            ) {

                acceptingSubmissions =
                    data.acceptingSubmissions;

            } else {

                acceptingSubmissions =
                    true;

            }

        } else {

            // First time:
            // create default OPEN status

            acceptingSubmissions =
                true;


            await setDoc(
                settingsRef,
                {
                    acceptingSubmissions: true,
                    updatedAt: serverTimestamp(),
                    updatedBy:
                        auth.currentUser?.email || ""
                }
            );

        }


        updateSubmissionStatus();


    } catch (error) {

        console.error(
            "Submission status error:",
            error
        );


        // Keep default open if status
        // cannot be loaded

        acceptingSubmissions =
            true;


        updateSubmissionStatus();


        alert(
            "Unable to load Fishpond submission status."
        );

    }

}


// =========================================================
// UPDATE SUBMISSION STATUS UI
// =========================================================

function updateSubmissionStatus() {

    if (
        acceptingSubmissions
    ) {

        // =========================================
        // OPEN
        // =========================================

        submissionStatusLabel.textContent =
            "OPEN";

        submissionStatusText.textContent =
            "Students can submit Fishponds.";

        toggleSubmissionBtn.textContent =
            "🛑 Stop Taking Fishponds";


        submissionStatusBadge.classList.remove(
            "submission-closed"
        );

        submissionStatusBadge.classList.add(
            "submission-open"
        );


        submissionStatusDot.classList.remove(
            "submission-closed-dot"
        );

        submissionStatusDot.classList.add(
            "submission-open-dot"
        );


        toggleSubmissionBtn.classList.remove(
            "start-submission-btn"
        );

        toggleSubmissionBtn.classList.add(
            "stop-submission-btn"
        );


    } else {

        // =========================================
        // CLOSED
        // =========================================

        submissionStatusLabel.textContent =
            "CLOSED";

        submissionStatusText.textContent =
            "Students cannot submit new Fishponds.";

        toggleSubmissionBtn.textContent =
            "🟢 Start Taking Fishponds";


        submissionStatusBadge.classList.remove(
            "submission-open"
        );

        submissionStatusBadge.classList.add(
            "submission-closed"
        );


        submissionStatusDot.classList.remove(
            "submission-open-dot"
        );

        submissionStatusDot.classList.add(
            "submission-closed-dot"
        );


        toggleSubmissionBtn.classList.remove(
            "stop-submission-btn"
        );

        toggleSubmissionBtn.classList.add(
            "start-submission-btn"
        );

    }

}


// =========================================================
// TOGGLE SUBMISSION STATUS
// =========================================================

toggleSubmissionBtn.addEventListener(
    "click",
    async () => {

        // =========================================
        // CLOSING SUBMISSIONS
        // =========================================

        if (
            acceptingSubmissions
        ) {

            const confirmClose =
                confirm(
                    "Are you sure you want to STOP taking Fishpond submissions?\n\nStudents will no longer be able to submit new Fishponds."
                );


            if (!confirmClose) {

                return;

            }


        // =========================================
        // OPENING SUBMISSIONS
        // =========================================

        } else {

            const confirmOpen =
                confirm(
                    "Do you want to START taking Fishpond submissions again?"
                );


            if (!confirmOpen) {

                return;

            }

        }


        try {

            // Disable button while saving

            toggleSubmissionBtn.disabled =
                true;

            toggleSubmissionBtn.textContent =
                "Saving...";


            const newStatus =
                !acceptingSubmissions;


            const settingsRef =
                doc(
                    db,
                    "settings",
                    "fishpond"
                );


            await setDoc(
                settingsRef,
                {
                    acceptingSubmissions:
                        newStatus,

                    updatedAt:
                        serverTimestamp(),

                    updatedBy:
                        auth.currentUser?.email || ""
                },
                {
                    merge: true
                }
            );


            // Update local status

            acceptingSubmissions =
                newStatus;


            updateSubmissionStatus();


            if (
                acceptingSubmissions
            ) {

                alert(
                    "Fishpond submissions are now OPEN."
                );

            } else {

                alert(
                    "Fishpond submissions are now CLOSED."
                );

            }


        } catch (error) {

            console.error(
                "Error changing submission status:",
                error
            );


            alert(
                "Unable to change Fishpond submission status."
            );


            updateSubmissionStatus();


        } finally {

            toggleSubmissionBtn.disabled =
                false;

        }

    }
);


// =========================================================
// UPDATE DASHBOARD STATISTICS
// =========================================================

function updateStatistics() {

    const total =
        allFishponds.length;


    const dance =
        allFishponds.filter(
            fishpond =>
                fishpond.fishpondType === "Dance"
        ).length;


    const music =
        allFishponds.filter(
            fishpond =>
                fishpond.fishpondType === "Music/Song"
        ).length;


    const task =
        allFishponds.filter(
            fishpond =>
                fishpond.fishpondType === "Task/Challenge"
        ).length;


    if (totalFishponds) {

        totalFishponds.textContent =
            total;

    }


    if (danceCount) {

        danceCount.textContent =
            dance;

    }


    if (musicCount) {

        musicCount.textContent =
            music;

    }


    if (taskCount) {

        taskCount.textContent =
            task;

    }


    console.log(
        "Statistics:",
        {
            total,
            dance,
            music,
            task
        }
    );

}


// =========================================================
// FORMAT DATE & TIME
// =========================================================

function formatDateTime(timestamp) {

    if (!timestamp) {

        return "Not available";

    }


    try {

        let date;


        if (
            typeof timestamp.toDate ===
            "function"
        ) {

            date =
                timestamp.toDate();

        }

        else if (
            timestamp instanceof Date
        ) {

            date =
                timestamp;

        }

        else {

            date =
                new Date(timestamp);

        }


        if (
            isNaN(date.getTime())
        ) {

            return "Not available";

        }


        return date.toLocaleString(
            "en-IN"
        );


    } catch (error) {

        console.error(
            "Date formatting error:",
            error
        );

        return "Not available";

    }

}


// =========================================================
// DISPLAY FISHPONDS
// =========================================================

function displayFishponds(fishponds) {

    tableBody.innerHTML = "";


    if (
        fishponds.length === 0
    ) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    No Fishpond submissions found.
                </td>

            </tr>

        `;

        return;

    }


    fishponds.forEach(
        (fishpond, index) => {

            const row =
                document.createElement("tr");


            const dateTime =
                formatDateTime(
                    fishpond.createdAt
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <strong>
                        ${escapeHTML(
                            fishpond.giverName
                        )}
                    </strong>

                    <br>

                    <span>
                        Roll No:
                        ${escapeHTML(
                            fishpond.giverRoll
                        )}
                    </span>

                    <br>

                    <span>
                        ${escapeHTML(
                            fishpond.giverClass
                        )}
                    </span>

                </td>


                <td>

                    <strong>
                        ${escapeHTML(
                            fishpond.receiverName
                        )}
                    </strong>

                    <br>

                    <span>
                        Roll No:
                        ${escapeHTML(
                            fishpond.receiverRoll
                        )}
                    </span>

                    <br>

                    <span>
                        ${escapeHTML(
                            fishpond.receiverClass
                        )}
                    </span>

                </td>


                <td>

                    ${escapeHTML(
                        fishpond.fishpondType
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        fishpond.fishpondContent
                    )}

                </td>


                <td>

                    ${dateTime}

                </td>


                <td>

                    <button
                        class="view-btn"
                        onclick="viewFishpond('${fishpond.id}')"
                    >
                        👁️ View
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteFishpond('${fishpond.id}')"
                    >
                        🗑️ Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// SEARCH + FILTER
// =========================================================

function applyFilters() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedType =
        typeFilter.value;


    const selectedClass =
        classFilter.value;


    const filteredFishponds =
        allFishponds.filter(
            (fishpond) => {

                const giverName =
                    String(
                        fishpond.giverName || ""
                    ).toLowerCase();


                const receiverName =
                    String(
                        fishpond.receiverName || ""
                    ).toLowerCase();


                const fishpondType =
                    String(
                        fishpond.fishpondType || ""
                    ).toLowerCase();


                const fishpondContent =
                    String(
                        fishpond.fishpondContent || ""
                    ).toLowerCase();


                const giverRoll =
                    String(
                        fishpond.giverRoll || ""
                    );


                const receiverRoll =
                    String(
                        fishpond.receiverRoll || ""
                    );


                const matchesSearch =

                    giverRoll.includes(
                        searchText
                    )

                    ||

                    receiverRoll.includes(
                        searchText
                    )

                    ||

                    giverName.includes(
                        searchText
                    )

                    ||

                    receiverName.includes(
                        searchText
                    )

                    ||

                    fishpondType.includes(
                        searchText
                    )

                    ||

                    fishpondContent.includes(
                        searchText
                    );


                const matchesType =

                    selectedType === "all"

                    ||

                    fishpond.fishpondType ===
                    selectedType;


                const matchesClass =

                    selectedClass === "all"

                    ||

                    fishpond.giverClass ===
                    selectedClass

                    ||

                    fishpond.receiverClass ===
                    selectedClass;


                return (

                    matchesSearch

                    &&

                    matchesType

                    &&

                    matchesClass

                );

            }
        );


    displayFishponds(
        filteredFishponds
    );

}


// =========================================================
// SEARCH EVENT
// =========================================================

searchInput.addEventListener(
    "input",
    applyFilters
);


// =========================================================
// TYPE FILTER EVENT
// =========================================================

typeFilter.addEventListener(
    "change",
    applyFilters
);


// =========================================================
// CLASS FILTER EVENT
// =========================================================

classFilter.addEventListener(
    "change",
    applyFilters
);


// =========================================================
// REFRESH
// =========================================================

refreshBtn.addEventListener(
    "click",
    async () => {

        await loadFishponds();

        await loadSubmissionStatus();

    }
);


// =========================================================
// LOGOUT
// =========================================================

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "admin.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Unable to logout."
            );

        }

    }
);


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================================
// VIEW FISHPOND
// =========================================================

window.viewFishpond =
    function (id) {


        const fishpond =
            allFishponds.find(
                item =>
                    item.id === id
            );


        if (!fishpond) {

            return;

        }


        const dateTime =
            formatDateTime(
                fishpond.createdAt
            );


        fishpondDetails.innerHTML = `

            <div class="detail-row">

                <strong>
                    Giver:
                </strong>

                ${escapeHTML(
                    fishpond.giverName
                )}

            </div>


            <div class="detail-row">

                <strong>
                    Giver Roll No:
                </strong>

                ${escapeHTML(
                    fishpond.giverRoll
                )}

            </div>


            <div class="detail-row">

                <strong>
                    Giver Class:
                </strong>

                ${escapeHTML(
                    fishpond.giverClass
                )}

            </div>


            <hr>


            <div class="detail-row">

                <strong>
                    Receiver:
                </strong>

                ${escapeHTML(
                    fishpond.receiverName
                )}

            </div>


            <div class="detail-row">

                <strong>
                    Receiver Roll No:
                </strong>

                ${escapeHTML(
                    fishpond.receiverRoll
                )}

            </div>


            <div class="detail-row">

                <strong>
                    Receiver Class:
                </strong>

                ${escapeHTML(
                    fishpond.receiverClass
                )}

            </div>


            <hr>


            <div class="detail-row">

                <strong>
                    Fishpond Type:
                </strong>

                ${escapeHTML(
                    fishpond.fishpondType
                )}

            </div>


            <div class="detail-row">

                <strong>
                    Fishpond Content:
                </strong>

                <p>
                    ${escapeHTML(
                        fishpond.fishpondContent
                    )}
                </p>

            </div>


            <div class="detail-row">

                <strong>
                    Audio File:
                </strong>

                ${
                    fishpond.audioFileName
                    ? escapeHTML(
                        fishpond.audioFileName
                    )
                    : "No audio uploaded"
                }

            </div>


            <div class="detail-row">

                <strong>
                    Submitted:
                </strong>

                ${dateTime}

            </div>

        `;


        fishpondModal.style.display =
            "block";

    };


// =========================================================
// CLOSE MODAL
// =========================================================

closeModal.addEventListener(
    "click",
    () => {

        fishpondModal.style.display =
            "none";

    }
);


// =========================================================
// CLOSE MODAL OUTSIDE
// =========================================================

window.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            fishpondModal
        ) {

            fishpondModal.style.display =
                "none";

        }

    }
);


// =========================================================
// DELETE FISHPOND
// =========================================================

window.deleteFishpond =
    async function (id) {


        const fishpond =
            allFishponds.find(
                item =>
                    item.id === id
            );


        if (!fishpond) {

            return;

        }


        const confirmDelete =
            confirm(
                `Are you sure you want to delete the Fishpond submitted by ${fishpond.giverName}?`
            );


        if (!confirmDelete) {

            return;

        }


        try {

            await deleteDoc(
                doc(
                    db,
                    "fishponds",
                    id
                )
            );


            alert(
                "Fishpond deleted successfully."
            );


            await loadFishponds();


        } catch (error) {

            console.error(
                "Delete error:",
                error
            );


            alert(
                "Unable to delete Fishpond."
            );

        }

    };


// =========================================================
// EXPORT FISHPONDS TO CSV
// =========================================================

exportBtn.addEventListener(
    "click",
    () => {


        if (
            allFishponds.length === 0
        ) {

            alert(
                "There are no Fishponds to export."
            );

            return;

        }


        const headers = [

            "Giver Roll No",

            "Giver Name",

            "Giver Class",

            "Receiver Roll No",

            "Receiver Name",

            "Receiver Class",

            "Fishpond Type",

            "Fishpond Content",

            "Audio File",

            "Date & Time"

        ];


        const rows =
            allFishponds.map(
                (fishpond) => {


                    const dateTime =
                        formatDateTime(
                            fishpond.createdAt
                        );


                    return [

                        fishpond.giverRoll,

                        fishpond.giverName,

                        fishpond.giverClass,

                        fishpond.receiverRoll,

                        fishpond.receiverName,

                        fishpond.receiverClass,

                        fishpond.fishpondType,

                        fishpond.fishpondContent,

                        fishpond.audioFileName ||
                        "",

                        dateTime

                    ];

                }
            );


        const csvContent = [

            headers,

            ...rows

        ]

        .map(
            row =>

                row

                    .map(
                        value => {

                            const text =
                                String(
                                    value ?? ""
                                );


                            return `"${text.replace(
                                /"/g,
                                '""'
                            )}"`;

                        }
                    )

                    .join(",")

        )

        .join("\n");


        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "Fishpond_Report.csv";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        alert(
            "Fishpond CSV report downloaded successfully."
        );

    }
);