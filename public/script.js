const $ = e => document.getElementById(e);

// from https://sheeptester.github.io/javascripts/anonchat.html
const consonants = 'bdfghjklmnprstvwz';
const vowels = 'aeiou';
function randomWord(syllables = 3, nasalChances = 0.3) {
  let word = '';
  for (let i = 0; i < syllables; i++) {
    const consonant = consonants[Math.random() * consonants.length >> 0];
    if (consonant !== word[word.length - 1])
      word += consonant; // no double n
    word += vowels[Math.random() * vowels.length >> 0];
    if (Math.random() < nasalChances) word += 'n';
  }
  return word;
}

$("new").href="/"+randomWord();

$("join").onsubmit = e => {
  e.preventDefault();
  location.href=$("channel");
}