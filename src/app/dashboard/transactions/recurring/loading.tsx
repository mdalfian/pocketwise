export default function RecurringLoading() {
  return <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 sm:px-6 sm:py-8 lg:px-10"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-11 w-28 rounded-xl bg-[#dce8d9]" /><div className="mt-8 h-10 w-72 rounded-xl bg-[#dce8d9]" /><div className="mt-6 overflow-hidden rounded-3xl bg-white">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 border-b border-[#edf1ed] last:border-0" />)}</div></div></main>;
}
