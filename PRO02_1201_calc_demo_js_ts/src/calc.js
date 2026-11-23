const priceInput = document.querySelector("#price");
const result = document.querySelector("#result");
document.querySelector("#calc").addEventListener("click", () => {
  // AI が書いた税込みの計算
  const price = priceInput.value; // "1000"（文字）
  const tax = price * 0.1;        // 100（数字に直る）
  const total = price + tax;      // "1000100"（つながる）
  result.textContent = `税込み ${total} 円`;
});
