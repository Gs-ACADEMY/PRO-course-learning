const priceInput = input("price");
const result = el("result");
el("calc").addEventListener("click", () => {
  const total = withTax(priceInput.value);
  result.textContent = `税込み ${total} 円`;
});

// 税込みの金額を返す（消費税 10%）
function withTax(price: number): number {
  return price + price * 0.1;
}

// 画面の部品を探す（見つからなければ、ここで止める。! で言い切らない）
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
