import { STATUS_LABEL } from "@/lib/status";
import type { Status } from "@/lib/generated/prisma/enums";

type Props = { status: Status | undefined; count: number };

/** 状態で絞り込む所と、出ている件数（選んで送ると /projects?status=ESTIMATING のように開き直す） */
export default function StatusFilter({ status, count }: Props) {
  return (
    <form action="/projects" className="mb-4 flex flex-wrap items-center gap-3">
      <label className="text-sm font-bold">
        状態
        <select name="status" defaultValue={status ?? ""}
          className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal">
          <option value="">すべて</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">
        絞り込む
      </button>
      <p className="ml-auto text-sm text-slate-600">
        <span className="text-lg font-bold text-slate-900">{count}</span> 件
      </p>
    </form>
  );
}
