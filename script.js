const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

/* Append number/operator */
function append(val) {
  display.value += val;
}

/* Clear display */
function clearDisplay() {
  display.value = "";
}

/* Delete last char */
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

/* Calculate result with real calculator % logic */
function calculate() {
  try {
    let exp = display.value;

    

    // 1️⃣ Handle +% and -%
    exp = exp.replace(/(\d+(\.\d+)?)([\+\-])(\d+(\.\d+)?)%/g, (match, base, _, operator, percent) => {
      return `${base}${operator}(${base}*${percent}/100)`;
    });

    // 2️⃣ Handle *% and /%
    exp = exp.replace(/(\d+(\.\d+)?)([\*\/])(\d+(\.\d+)?)%/g, (match, base, _, operator, percent) => {
      return `${base}${operator}(${percent}/100)`;
    });

    // 3️⃣ Handle standalone % like "50%" -> 0.5
    exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    const result = eval(exp); // Safe now
    saveHistory(display.value + " = " + result);
    display.value = result;
  } catch {
    display.value = "Error";
    setTimeout(clearDisplay, 1000);
  }
}

/* Save calculation history */
function saveHistory(item) {
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.push(item);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

/* Render history list */
function renderHistory() {
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    historyList.appendChild(li);
  });
}

/* Clear history */
function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}

/* Dark Mode */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
};

renderHistory();
