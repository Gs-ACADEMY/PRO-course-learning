// じゃんけんゲーム（講師の見本）
// 手の番号：0 = グー、1 = チョキ、2 = パー
const HANDS = ["グー", "チョキ", "パー"];
const ICONS = ["✊", "✌️", "✋"];

const meIcon = document.getElementById("me-icon");
const meName = document.getElementById("me-name");
const cpuIcon = document.getElementById("cpu-icon");
const cpuName = document.getElementById("cpu-name");
const resultEl = document.getElementById("result");
const score = { 勝ち: 0, 負け: 0, あいこ: 0 };

// 勝ち負けを決める（あいこではないとき）
// グー → チョキ → パー → グー の順に、相手が 1 つ先なら勝ち
function judge(me, cpu) {
  if ((me - cpu + 3) % 3 === 2) {
    return "勝ち";
  }
  return "負け";
}

// 画面に出す
function show(me, cpu, result) {
  meIcon.textContent = ICONS[me];
  meName.textContent = HANDS[me];
  cpuIcon.textContent = ICONS[cpu];
  cpuName.textContent = HANDS[cpu];
  resultEl.textContent = result === "あいこ" ? "あいこ" : `あなたの${result}！`;
  resultEl.className = "result " + { 勝ち: "win", 負け: "lose", あいこ: "draw" }[result];
  score[result] += 1;
  document.getElementById("win").textContent = score["勝ち"];
  document.getElementById("lose").textContent = score["負け"];
  document.getElementById("draw").textContent = score["あいこ"];
}

// ボタンを押したとき
function play(button) {
  const me = button.dataset.hand;
  const cpu = Math.floor(Math.random() * 3);
  let result;
  if (me === cpu) {
    result = "あいこ";
  } else {
    result = judge(me, cpu);
  }
  show(me, cpu, result);
}

document.querySelectorAll(".hand").forEach((button) => {
  button.addEventListener("click", () => play(button));
});
