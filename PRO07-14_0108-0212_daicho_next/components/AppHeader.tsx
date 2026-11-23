import { roleLabel } from "@/lib/permissions";
import SignOutButton from "./SignOutButton";

type Props = { name: string; role: string | null | undefined };

export default function AppHeader({ name, role }: Props) {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <p className="font-bold tracking-wide">
          案件台帳 <span className="ml-2 text-xs font-normal text-slate-300">ホシナギ工務店</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm">
            {name} さん
            <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold">{roleLabel(role)}</span>
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
