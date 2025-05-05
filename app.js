import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, get } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyC81DB6fOMtulZJc8FHXF0vqAc66ciTSPQ",
  authDomain: "draconic-dictionarry.firebaseapp.com",
  databaseURL: "https://draconic-dictionarry-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "draconic-dictionarry",
  storageBucket: "draconic-dictionarry.firebasestorage.app",
  messagingSenderId: "182070316296",
  appId: "1:182070316296:web:f872bd47ab2c1623e670bd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const PASSWORD = "omega";

let showAuth = false;
function toggleAuth() {
  showAuth = !showAuth;
  document.getElementById("auth").style.display = showAuth ? "block" : "none";
}
window.toggleAuth = toggleAuth;

function unlockEdit() {
  const pw = document.getElementById("editPassword").value;
  if (pw === PASSWORD) {
    document.getElementById("editSection").style.display = "block";
  } else {
    alert("Incorrect password");
  }
}
window.unlockEdit = unlockEdit;

function addWord() {
  const word = document.getElementById("conlangWord").value.trim();
  const english = document.getElementById("englishWord").value.trim();
  const cats = Array.from(document.getElementById("categories").selectedOptions).map(opt => opt.value);
  if (!word || !english || cats.length === 0) return;
  push(ref(db, "words"), { conlang: word, english, categories: cats });
  document.getElementById("conlangWord").value = "";
  document.getElementById("englishWord").value = "";
}
window.addWord = addWord;

function loadWords() {
  const wordList = document.getElementById("wordList");
  onValue(ref(db, "words"), (snapshot) => {
    const data = snapshot.val();
    wordList.innerHTML = "";
    if (!data) return;
    const words = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    words.sort((a, b) => a.conlang.localeCompare(b.conlang));
    for (const word of words) {
      const item = document.createElement("div");
      item.className = "word-item";
      item.innerHTML = `<strong>${word.conlang}</strong> (${word.english}) [${word.categories.join(", ")}]
        <button onclick="deleteWord('${word.id}')">❌</button>`;
      wordList.appendChild(item);
    }
  });
}
window.deleteWord = function(id) {
  const pw = prompt("Enter password to delete:");
  if (pw === PASSWORD) {
    remove(ref(db, "words/" + id));
  }
};

function translateWord() {
  const input = document.getElementById("translateInput").value.trim().toLowerCase();
  get(ref(db, "words")).then(snapshot => {
    const data = snapshot.val();
    let result = "Not found.";
    if (data) {
      Object.values(data).forEach(w => {
        if (w.conlang.toLowerCase() === input || w.english.toLowerCase() === input) {
          result = `${w.conlang} = ${w.english}`;
        }
      });
    }
    document.getElementById("translationResult").innerText = result;
  });
}
window.translateWord = translateWord;

loadWords();
