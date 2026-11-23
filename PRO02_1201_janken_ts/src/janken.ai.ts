// じゃんけんゲーム（AI に「TypeScript に移して」とだけ頼んだ版）
// 赤線は 0 で、npm run build も通る。でも、同じ手で「負け」と出る間違いは残ったまま
// 赤線を消すだけの近道が 4 種類入っている：any・as・!・@ts-ignore
// 手の番号：0 = グー、1 = チョキ、2 = パー
const HANDS: string[] = ["グー", "チョキ", "パー"];
const ICONS: string[] = ["✊", "✌️", "✋"];

const meIcon = document.getElementById("me-icon")!;
const meName = document.getElementById("me-name")!;
const cpuIcon = document.getElementById("cpu-icon")!;
const cpuName = document.getElementById("cpu-name")!;
const resultEl = document.getElementById("result")!;
const score: any = { 勝ち: 0, 負け: 0, あいこ: 0 };

// 勝ち負けを決める（あいこではないとき）
// グー → チョキ → パー → グー の順に、相手が 1 つ先なら勝ち
function judge(me: number, cpu: number): string {
  if ((me - cpu + 3) % 3 === 2) {
    return "勝ち";
  }
  return "負け";
}

// 画面に出す
function show(me: number, cpu: number, result: string): void {
  meIcon.textContent = ICONS[me];
  meName.textContent = HANDS[me];
  cpuIcon.textContent = ICONS[cpu];
  cpuName.textContent = HANDS[cpu];
  resultEl.textContent = result === "あいこ" ? "あいこ" : `あなたの${result}！`;
  resultEl.className = "result " + ({ 勝ち: "win", 負け: "lose", あいこ: "draw" } as any)[result];
  score[result] += 1;
  // @ts-ignore
  document.getElementById("win").textContent = score["勝ち"];
  // @ts-ignore
  document.getElementById("lose").textContent = score["負け"];
  // @ts-ignore
  document.getElementById("draw").textContent = score["あいこ"];
}

// ボタンを押したとき
function play(button: HTMLButtonElement): void {
  const me = button.dataset.hand as any;
  const cpu = Math.floor(Math.random() * 3);
  let result: string;
  if (me === cpu) {
    result = "あいこ";
  } else {
    result = judge(me, cpu);
  }
  show(me, cpu, result);
}

document.querySelectorAll<HTMLButtonElement>(".hand").forEach((button) => {
  button.addEventListener("click", () => play(button));
});
