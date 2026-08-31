export default function TransactionsLoading() {
  return (
    <main className="min-h-screen bg-[#f3f7f1] px-4 py-6 text-[#17211b] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-11 w-28 rounded-xl bg-[#dce8d9]" />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-36 rounded bg-[#cfe0cb]" />
            <div className="h-10 w-64 rounded-xl bg-[#dce8d9]" />
            <div className="h-4 w-80 max-w-full rounded bg-[#e1e9df]" />
          </div>
          <div className="h-12 w-44 rounded-xl bg-[#cfe0cb]" />
        </div>
        <div className="mt-8 rounded-2xl border border-[#dce8d9] bg-white p-5 shadow-sm">
          <div className="mb-4 h-4 w-32 rounded bg-[#dce8d9]" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="h-11 rounded-xl bg-[#edf3eb] lg:col-span-2" />
            <div className="h-11 rounded-xl bg-[#edf3eb]" />
            <div className="h-11 rounded-xl bg-[#edf3eb]" />
            <div className="h-11 rounded-xl bg-[#edf3eb]" />
            <div className="h-11 rounded-xl bg-[#edf3eb]" />
          </div>
        </div>
        <div className="mt-4 h-5 w-52 rounded bg-[#dce8d9]" />
        <section className="mt-4 overflow-hidden rounded-3xl border border-[#e1e9df] bg-white shadow-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 border-b border-[#edf1ed] p-5 last:border-0">
              <div className="size-9 rounded-xl bg-[#e1e9df]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-2/5 rounded bg-[#dce8d9]" />
                <div className="h-3 w-1/3 rounded bg-[#edf1ed]" />
              </div>
              <div className="hidden h-4 w-24 rounded bg-[#edf1ed] sm:block" />
              <div className="h-4 w-28 rounded bg-[#dce8d9]" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
