
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

document.getElementById("toggleLock").addEventListener("click", () => {
  const input = document.getElementById("editPassword");
  input.style.display = input.style.display === "none" ? "block" : "none";
});

document.getElementById("editPassword").addEventListener("change", () => {
  if (document.getElementById("editPassword").value === PASSWORD) {
    document.getElementById("editSection").style.display = "block";
  } else {
    alert("Incorrect password.");
  }
});

window.addWord = () => {
  const conlang = document.getElementById("conlangWord").value.trim();
  const english = document.getElementById("englishWord").value.trim();
  const categories = Array.from(document.getElementById("categories").selectedOptions).map(opt => opt.value);
  if (!conlang || !english || categories.length === 0) return;
  push(ref(db, "words"), { conlang, english, categories });
  document.getElementById("conlangWord").value = "";
  document.getElementById("englishWord").value = "";
};

window.translateWord = () => {
  const input = document.getElementById("translateWord").value.trim().toLowerCase();
  const dir = document.querySelector("input[name='direction']:checked").value;
  get(ref(db, "words")).then(snapshot => {
    const data = snapshot.val();
    let result = "Not found.";
    for (const id in data) {
      const word = data[id];
      if ((dir === "conlangToEnglish" && word.conlang.toLowerCase() === input) ||
          (dir === "englishToConlang" && word.english.toLowerCase() === input)) {
        result = `${word.conlang} = ${word.english}`;
        break;
      }
    }
    document.getElementById("translationResult").innerText = result;
  });
};

function loadWords() {
  onValue(ref(db, "words"), snapshot => {
    const data = snapshot.val();
    const container = document.getElementById("wordList");
    container.innerHTML = "";
    if (!data) return;
    const words = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    words.sort((a, b) => a.conlang.localeCompare(b.conlang));
    for (const word of words) {
      const div = document.createElement("div");
      div.innerText = `${word.conlang} (${word.english}) - ${word.categories.join(", ")}`;
      container.appendChild(div);
    }
  });
}

loadWords();
