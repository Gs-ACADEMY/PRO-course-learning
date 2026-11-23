/** 上の帯（1/8 の時点はログインがないので、台帳の名前だけ） */
export default function AppHeader() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <p className="font-bold tracking-wide">案件台帳</p>
      </div>
    </header>
  );
}
