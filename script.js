let current = "0";
let previous = null;
let operator = null;
let waiting = false;
let nepali = false;

const big = document.getElementById("big");
const small = document.getElementById("small");
const list = document.getElementById("list");
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// show English or Nepali digits
function show(text) {
  if (!nepali) return text;
  return text.replace(/[0-9]/g, d => "०१२३४५६७८९"[d]);
}

function update() {
  big.textContent = show(current);
  small.textContent = operator ? show(previous) + " " + symbols[operator] : "";
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  let r = 0;
  if (op === "+") r = a + b;
  if (op === "-") r = a - b;
  if (op === "*") r = a * b;
  if (op === "/") {
    if (b === 0) return "Error";
    r = a / b;
  }
  return String(parseFloat(r.toFixed(10)));
}

function addNumber(n) {
  if (current === "Error") current = "0";
  if (waiting) { current = "0"; waiting = false; }
  if (n === "." && current.includes(".")) return;
  current = (current === "0" && n !== ".") ? n : current + n;
  update();
}

function chooseOperator(op) {
  if (current === "Error") return;
  if (operator && !waiting) {
    current = calculate(previous, current, operator);
  }
  previous = current;
  operator = op;
  waiting = true;
  update();
}

function equals() {
  if (!operator || waiting) return;
  const result = calculate(previous, current, operator);
  addHistory(show(previous) + " " + symbols[operator] + " " + show(current) + " = " + show(result));
  current = result;
  operator = null;
  previous = null;
  update();
}

function addHistory(text) {
  const empty = list.querySelector(".empty");
  if (empty) empty.remove();
  const p = document.createElement("p");
  p.textContent = text;
  list.prepend(p);
}

function action(a) {
  if (a === "equals") return equals();
  if (current === "Error" && a !== "clear") return;

  const num = parseFloat(current);

  if (a === "clear") { current = "0"; previous = null; operator = null; waiting = false; }
  if (a === "sign") current = String(-num);
  if (a === "percent") current = String(num / 100);
  if (a === "back") current = current.length > 1 ? current.slice(0, -1) : "0";
  if (a === "sqrt") current = num < 0 ? "Error" : String(parseFloat(Math.sqrt(num).toFixed(10)));
  if (a === "square") current = String(parseFloat((num * num).toFixed(10)));
  if (a === "pi") { current = "3.1415926535"; waiting = false; }
  if (a === "inverse") current = num === 0 ? "Error" : String(parseFloat((1 / num).toFixed(10)));

  update();
}

// mouse / touch clicks
document.querySelectorAll(".keys button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.num) addNumber(btn.dataset.num);
    else if (btn.dataset.op) chooseOperator(btn.dataset.op);
    else action(btn.dataset.act);
    btn.blur();
  });
});

// keyboard
document.addEventListener("keydown", e => {
  if ("0123456789.".includes(e.key)) addNumber(e.key);
  else if ("+-*/".includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
  else if (e.key === "Backspace") action("back");
  else if (e.key === "Escape") action("clear");
});

// theme button
const themeBtn = document.getElementById("themeBtn");
themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
};

// Nepali digits button
const langBtn = document.getElementById("langBtn");
langBtn.onclick = () => {
  nepali = !nepali;
  langBtn.textContent = nepali ? "English" : "नेपाली";
  update();
};

// clear history
document.getElementById("clearHist").onclick = () => {
  list.innerHTML = '<p class="empty">Nothing yet</p>';
};

update();