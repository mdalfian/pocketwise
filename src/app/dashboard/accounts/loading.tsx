export default function AccountsLoading() {
  return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-11 w-28 rounded-xl bg-[#dce8d9]" /><div className="mt-8 h-10 w-56 rounded-xl bg-[#dce8d9]" /><div className="mt-2 h-4 w-72 rounded bg-[#e1e9df]" /><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-3xl bg-white" />)}</div></div></main>;
}
