// メモ帳（講師の見本）
// 足す・消す・探す・直す。メモは localStorage に保存するので、閉じても残る

const input = document.querySelector("#input");
const add = document.querySelector("#add");
const edit = document.querySelector("#edit");
const del = document.querySelector("#del");
const find = document.querySelector("#find");
const list = document.querySelector("#list");

// メモの配列（新しいメモが先頭）。最初に 1 回、localStorage から読む
let memos = JSON.parse(localStorage.getItem("memos")) || [];
let selected = -1; // 選んでいるメモの番号（-1 は選んでいない）

// localStorage に保存する
function save() {
  localStorage.setItem("memos", JSON.stringify(memos));
}

// 今日の日付（12/8 の形）
function today() {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// メモの文字を、そのまま文字として出す（< などを HTML として読ませない）
function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

// 一覧の HTML を作る（探す欄の文字を含むメモだけ）
function html() {
  const word = find.value.trim();
  let s = "";
  for (let i = 0; i < memos.length; i++) {
    if (!memos[i].text.includes(word)) continue;
    const cls = i === selected ? "memo selected" : "memo";
    s += `<li class="${cls}" data-index="${i}">${escapeHtml(memos[i].text)}<span class="date">${memos[i].date}</span></li>`;
  }
  return s || `<li class="empty">メモはありません</li>`;
}

// 足す
add.onclick = () => {
  if (input.value.trim() === "") return;
  memos.unshift({ text: input.value.trim(), date: today() });
  selected = -1;
  input.value = "";
  save();
  list.innerHTML = html();
};

// 消す（選んだメモを消す）
del.onclick = () => {
  if (selected === -1) return;
  memos.splice(selected, 1);
  selected = -1;
  input.value = "";
  save();
  list.innerHTML = html();
};

// 探す（打つたびに絞り込む）
find.oninput = () => {
  selected = -1;
  list.innerHTML = html();
};

// 直す（選んだメモを、入力欄の文字に書き換える）
edit.onclick = () => {
  if (selected === -1 || input.value.trim() === "") return;
  memos[selected].text = input.value.trim();
  save();
  /* 書き換え忘れ */ // ← わざと残した間違い。ここに list.innerHTML = html(); がないので、一覧が古いまま
};

// 一覧のメモを押すと選ぶ（入力欄に文字を出す）
list.onclick = (e) => {
  const li = e.target.closest("li[data-index]");
  if (!li) return;
  selected = Number(li.dataset.index);
  input.value = memos[selected].text;
  list.innerHTML = html();
};

// 最初の表示
list.innerHTML = html();
