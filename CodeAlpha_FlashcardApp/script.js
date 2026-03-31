const defaultCards = [
  {
    q: "What is the difference between '==' and '==='?",
    a: "'==' checks value with type coercion, while '===' checks both value and type.",
  },
  {
    q: "What is a Closure in JavaScript?",
    a: "A function that remembers its lexical scope even when executed outside that scope.",
  },
  {
    q: "Explain Hoisting.",
    a: "JS moves variable and function declarations to the top of their scope during compilation.",
  },
  {
    q: "What is the 'this' keyword?",
    a: "It refers to the object that is currently executing the code.",
  },
  {
    q: "Difference between let, const, and var?",
    a: "var is function-scoped; let and const are block-scoped. const cannot be reassigned.",
  },
];

// Load Data
let cards = JSON.parse(localStorage.getItem("proFlashCards")) || defaultCards;
let currentIndex = 0;

// DOM Elements
const flashcard = document.getElementById("flashcard");
const questionEl = document.getElementById("question-text");
const answerEl = document.getElementById("answer-text");
const counterEl = document.getElementById("card-index");
const progressBar = document.getElementById("progress-bar");
const flipBtn = document.getElementById("flip-btn");
const modal = document.getElementById("modal");

function updateUI() {
  // Reset flip state when moving between cards
  flashcard.classList.remove("flipped");
  updateFlipButtonIcon(false);

  if (cards.length > 0) {
    if (currentIndex >= cards.length) currentIndex = cards.length - 1;

    questionEl.innerText = cards[currentIndex].q;
    answerEl.innerText = cards[currentIndex].a;
    counterEl.innerText = `${currentIndex + 1} / ${cards.length}`;
    progressBar.style.width = `${((currentIndex + 1) / cards.length) * 100}%`;
  } else {
    questionEl.innerText = "Deck is empty!";
    answerEl.innerText = "Add cards in 'Manage' section.";
    counterEl.innerText = "0 / 0";
    progressBar.style.width = "0%";
  }
}

function updateFlipButtonIcon(isFlipped) {
  flipBtn.innerHTML = isFlipped
    ? `<i data-lucide="help-circle"></i> Show Question`
    : `<i data-lucide="refresh-cw"></i> Show Answer`;
  if (window.lucide) lucide.createIcons();
}

const toggleFlip = () => {
  if (cards.length === 0) return;
  flashcard.classList.toggle("flipped");
  const isFlipped = flashcard.classList.contains("flipped");
  updateFlipButtonIcon(isFlipped);
};

// Navigation
document.getElementById("next-btn").onclick = () => {
  if (cards.length === 0) return;
  currentIndex = (currentIndex + 1) % cards.length;
  updateUI();
};

document.getElementById("prev-btn").onclick = () => {
  if (cards.length === 0) return;
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateUI();
};

flipBtn.onclick = toggleFlip;
flashcard.onclick = toggleFlip;

// Modal Management
document.getElementById("open-settings").onclick = () => {
  modal.style.display = "flex";
  renderManager();
};

document.getElementById("close-modal").onclick = () =>
  (modal.style.display = "none");

// Close modal if user clicks outside of it
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

document.getElementById("add-card-btn").onclick = () => {
  const qInput = document.getElementById("new-q");
  const aInput = document.getElementById("new-a");

  if (qInput.value.trim() && aInput.value.trim()) {
    cards.push({ q: qInput.value.trim(), a: aInput.value.trim() });
    save();
    qInput.value = "";
    aInput.value = "";
    renderManager();
    updateUI();
  }
};

window.deleteCard = (i) => {
  cards.splice(i, 1);
  save();
  renderManager();
  updateUI();
};

function save() {
  localStorage.setItem("proFlashCards", JSON.stringify(cards));
}

function renderManager() {
  const list = document.getElementById("card-list");
  list.innerHTML =
    cards.length > 0
      ? cards
          .map(
            (c, i) => `
            <div class="manage-item">
                <div class="manage-text"><strong>Q:</strong> ${c.q.substring(0, 30)}...</div>
                <button onclick="deleteCard(${i})" class="del-btn">Delete</button>
            </div>
        `,
          )
          .join("")
      : "<p style='text-align:center; color:gray;'>No cards yet.</p>";
}

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "flex") return; // Disable shortcuts when typing in modal
  if (e.code === "Space") {
    e.preventDefault();
    toggleFlip();
  }
  if (e.code === "ArrowRight") document.getElementById("next-btn").click();
  if (e.code === "ArrowLeft") document.getElementById("prev-btn").click();
});

// Start
updateUI();
