// じゃんけんゲーム（JavaScript から TypeScript に移した版）
// any・as・!・@ts-ignore を使わずに赤線を 0 にした。同じ手なら「あいこ」と出る
// 手の番号：0 = グー、1 = チョキ、2 = パー
const HANDS = ["グー", "チョキ", "パー"];
const ICONS = ["✊", "✌️", "✋"];

// 結果は、この 3 つだけ（選べる値を決める型）
type Result = "勝ち" | "負け" | "あいこ";

// 画面の部品を探す。見つからなければ、ここで止める（null のまま先へ進めない）
function el(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) {
    throw new Error(`#${id} が画面にありません`);
  }
  return found;
}

const meIcon = el("me-icon");
const meName = el("me-name");
const cpuIcon = el("cpu-icon");
const cpuName = el("cpu-name");
const resultEl = el("result");
const score: Record<Result, number> = { 勝ち: 0, 負け: 0, あいこ: 0 };
const RESULT_CLASS: Record<Result, string> = { 勝ち: "win", 負け: "lose", あいこ: "draw" };

// 勝ち負けを決める（あいこではないとき）
// グー → チョキ → パー → グー の順に、相手が 1 つ先なら勝ち
function judge(me: number, cpu: number): Result {
  if ((me - cpu + 3) % 3 === 2) {
    return "勝ち";
  }
  return "負け";
}

// 画面に出す
function show(me: number, cpu: number, result: Result): void {
  meIcon.textContent = ICONS[me];
  meName.textContent = HANDS[me];
  cpuIcon.textContent = ICONS[cpu];
  cpuName.textContent = HANDS[cpu];
  resultEl.textContent = result === "あいこ" ? "あいこ" : `あなたの${result}！`;
  resultEl.className = `result ${RESULT_CLASS[result]}`;
  score[result] += 1;
  el("win").textContent = String(score["勝ち"]);
  el("lose").textContent = String(score["負け"]);
  el("draw").textContent = String(score["あいこ"]);
}

// ボタンを押したとき
function play(button: HTMLButtonElement): void {
  const me = Number(button.dataset.hand); // "0"（文字）を 0（数字）にする
  const cpu = Math.floor(Math.random() * 3);
  const result: Result = me === cpu ? "あいこ" : judge(me, cpu);
  show(me, cpu, result);
}

// 手のボタンは、ボタンだと確かめてから使う（as で言い切らない）
document.querySelectorAll(".hand").forEach((button) => {
  if (button instanceof HTMLButtonElement) {
    button.addEventListener("click", () => play(button));
  }
});
