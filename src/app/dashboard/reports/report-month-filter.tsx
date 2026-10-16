"use client";

export function ReportMonthFilter({ selected }: { selected: string }) {
  return (
    <form method="get">
      <label className="block text-sm font-semibold text-[#526057]">
        Pilih bulan
        <input
          type="month"
          name="month"
          defaultValue={selected}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="mt-2 rounded-xl border border-[#dce3dc] bg-white px-4 py-3 text-sm"
        />
      </label>
    </form>
  );
}
