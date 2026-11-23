// 税込みの金額を返す（消費税 10%）
export function withTax(price: number): number {
  return price + price * 0.1;
}

// 割り勘：1 人あたりの金額を返す（1 円未満は切り上げ）
export function splitBill(total: number, people: number): number {
  if (people <= 0) {
    throw new Error("人数は 1 人以上にしてください"); // 0 で割ると Infinity になるので、ここで止める
  }
  return Math.ceil(total / people);
}
