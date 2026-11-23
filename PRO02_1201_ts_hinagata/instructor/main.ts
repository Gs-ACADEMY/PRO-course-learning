import "./style.css";
import { splitBill, withTax } from "./calc";

// 税込み
const priceInput = input("price");
const taxResult = el("tax-result");

el("tax-calc").addEventListener("click", () => {
  const total = withTax(Number(priceInput.value)); // 入力欄の値は文字なので、数字にして渡す
  taxResult.textContent = `税込み ${total} 円`;
});

// 割り勘
const totalInput = input("total");
const peopleInput = input("people");
const splitResult = el("split-result");

el("split-calc").addEventListener("click", () => {
  try {
    const each = splitBill(Number(totalInput.value), Number(peopleInput.value));
    splitResult.textContent = `1 人あたり ${each} 円`;
  } catch (error) {
    // 人数 0 で止まったときは、その理由を出す
    splitResult.textContent = error instanceof Error ? error.message : "計算できません";
  }
});

// ---- 画面の部品を探す（見つからなければ、ここで止める） ----

function el(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) {
    throw new Error(`#${id} が画面にありません`);
  }
  return found;
}

function input(id: string): HTMLInputElement {
  const found = document.getElementById(id);
  if (!(found instanceof HTMLInputElement)) {
    throw new Error(`#${id} の入力欄が画面にありません`);
  }
  return found;
}
