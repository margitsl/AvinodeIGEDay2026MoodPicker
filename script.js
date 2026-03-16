const STORAGE_KEY = "mood_counts";

const buttons = document.querySelectorAll(".mood-button");
const totalText = document.getElementById("totalText");
const resetButton = document.getElementById("resetButton");

let counts = {
    sad: 0,
    okay: 0,
    good: 0,
    great: 0,
    party: 0
};

// Load saved counts from sessionStorage
function loadCounts() {
    let savedData = sessionStorage.getItem(STORAGE_KEY);

    if (savedData !== null) {
        counts = JSON.parse(savedData);
    }
}

// Save counts to sessionStorage
function saveCounts() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

// Work out the total number of clicks
function getTotalClicks() {
    let total = 0;

    for (let key in counts) {
        total = total + counts[key];
    }

    return total;
}

// Update the numbers on the screen
function updateScreen() {
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        let moodKey = button.dataset.key;
        let countBox = button.querySelector("[data-count]");

        countBox.textContent = counts[moodKey];
    }

    totalText.textContent = "Total clicks: " + getTotalClicks();
}

// Create the ripple effect (animation on click)
function addRipple(button, clickX, clickY) {
    let rect = button.getBoundingClientRect();

    let rippleX = clickX - rect.left;
    let rippleY = clickY - rect.top;

    let ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = rippleX + "px";
    ripple.style.top = rippleY + "px";

    button.appendChild(ripple);

    ripple.addEventListener("animationend", function () {
        ripple.remove();
    });
}

// Load saved data when the page opens
loadCounts();
updateScreen();

// Add click event to each emoji button
for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];

    button.addEventListener("click", function (event) {
        let moodKey = button.dataset.key;

        // Log which mood button was clicked
        console.log("Clicked mood:", moodKey);

        if (counts[moodKey] === undefined) {
            console.error("Mood key does not exist:", moodKey);
            return;
        }

        // Add 1 to this mood
        counts[moodKey] = counts[moodKey] + 1;

        // Save and show new numbers
        saveCounts();
        updateScreen();

        // Restart the pop animation
        button.classList.remove("pop");
        void button.offsetWidth;
        button.classList.add("pop");

        // Find where the user clicked
        let x = event.clientX;
        let y = event.clientY;

        // If the button was triggered by keyboard, use the center
        if (x === 0 && y === 0) {
            let rect = button.getBoundingClientRect();
            x = rect.left + button.offsetWidth / 2;
            y = rect.top + button.offsetHeight / 2;
        }

        // Add ripple effect
        addRipple(button, x, y);
    });
}

// Reset button
resetButton.addEventListener("click", function () {
    counts.sad = 0;
    counts.okay = 0;
    counts.good = 0;
    counts.great = 0;
    counts.party = 0;

    saveCounts();
    updateScreen();
});