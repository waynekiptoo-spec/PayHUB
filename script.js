const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();

  // Edge case: empty input
  if (!word) {
    resultDiv.innerHTML = "<p class='error'>Please enter a word.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    // Handle invalid word
    if (!res.ok) {
      throw new Error("Word not found");
    }

    const data = await res.json();

    displayData(data[0]);

  } catch (error) {
    resultDiv.innerHTML = `<p class="error">${error.message}</p>`;
  }
});

function displayData(data) {
  const word = data.word;
  const phonetic = data.phonetic || "";
  const meanings = data.meanings;

  let html = `
    <h2>${word}</h2>
    <p>${phonetic}</p>
  `;

  meanings.forEach((meaning) => {
    html += `<p><b>${meaning.partOfSpeech}</b></p>`;

    meaning.definitions.slice(0,2).forEach(def => {
      html += `<p>• ${def.definition}</p>`;
    });
  });

  resultDiv.innerHTML = html;
}