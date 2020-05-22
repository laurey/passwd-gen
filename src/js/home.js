import "../style/normal.css";
import "../style/index.less";

const resultEl = document.getElementById("result");
const clipboard = document.getElementById("clipboard");
const generateEl = document.getElementById("generate");
const modeEl = document.getElementsByName("mode");

const basicContainer = document.getElementById("basic-panel");
const lengthEl = basicContainer.querySelector("#length");
const uppercaseEl = basicContainer.querySelector("#uppercase");
const lowercaseEl = basicContainer.querySelector("#lowercase");
const numbersEl = basicContainer.querySelector("#numbers");
const symbolsEl = basicContainer.querySelector("#symbols");

const advanceContainer = document.getElementById("advance-panel");
const minLengthEl = advanceContainer.querySelector("#min_length");
const maxLengthEl = advanceContainer.querySelector("#max_length");
const allow_duplicate = advanceContainer.querySelector("#allow_duplicate");
const disallowEl = advanceContainer.querySelector("#disallow_duplicate");

const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

let mode = "1";

clipboard.addEventListener("click", () => {
  const textarea = document.createElement("textarea");
  const password = resultEl.innerText;

  if (!password) {
    return;
  }

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
});

Array.prototype.forEach.call(modeEl, function (radio) {
  radio.addEventListener("change", function () {
    const value = this.value;
    mode = value;
    if (value === "2") {
      basicContainer.classList.add('hide');
      advanceContainer.classList.remove('hide');
    } else {
      basicContainer.classList.remove('hide');
      advanceContainer.classList.add('hide');
    }
  });
});

generateEl.addEventListener("click", () => {
  if (mode === "1") {
    basicPasswdGenerator();
  }
});

lengthEl.addEventListener("change", function(e) {
  const length = +lengthEl.value;
  document.getElementById("len").textContent = length;
});

function generatePassword(lower, upper, number, symbol, length) {
  let generatedPassword = "";
  const typesCount = lower + upper + number + symbol;
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  // Doesn't have a selected type
  if (typesCount === 0) {
    return "";
  }

  // create a loop
  for (let i = 0; i < length; i += typesCount) {
    typesArr.forEach((type) => {
      const funcName = Object.keys(type)[0];
      generatedPassword += randomFunc[funcName]();
    });
  }

  const finalPassword = generatedPassword.slice(0, length);

  return finalPassword;
}

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return +String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

// basic method
function basicPasswdGenerator() {
  const hasLower = lowercaseEl.checked;
  const hasUpper = uppercaseEl.checked;
  const hasNumber = numbersEl.checked;
  const hasSymbol = symbolsEl.checked;
  const length = +lengthEl.value;

 resultEl.innerText = generatePassword(
   hasLower,
   hasUpper,
   hasNumber,
   hasSymbol,
   length
 ); 
}

// advance method
function advanceGenerator({chars, pattern, min_length, max_length}) {
  
}
