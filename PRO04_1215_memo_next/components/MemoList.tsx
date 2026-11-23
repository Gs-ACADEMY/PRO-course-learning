import MemoItem from "./MemoItem";
import type { Memo } from "./types";

type Props = {
  memos: Memo[];
};

/** 2　一覧：メモを並べる部品（中で MemoItem を繰り返し使う） */
export default function MemoList({ memos }: Props) {
  if (memos.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center text-slate-500">
        メモはまだありません
      </p>
    );
  }
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-500">{memos.length} 件</p>
      <ul className="space-y-3">
        {memos.map((memo) => (
          <MemoItem key={memo.id} text={memo.text} createdAt={memo.createdAt} />
        ))}
      </ul>
    </div>
  );
}
