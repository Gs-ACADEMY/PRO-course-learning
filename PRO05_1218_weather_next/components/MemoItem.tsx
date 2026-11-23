type Props = {
  text: string;
  createdAt: string;
};

/** 日時を「12/14 21:05」の形に */
function format(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`;
}

/** 3　1 件の表示：メモ 1 件を見せる部品 */
export default function MemoItem({ text, createdAt }: Props) {
  return (
    <li className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
      <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{text}</p>
      <p className="mt-1 text-xs text-slate-400">{format(createdAt)}</p>
    </li>
  );
}
