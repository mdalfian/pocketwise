"use client";

import { useState } from "react";

export function BudgetAmountInput({ initialValue = 0 }: { initialValue?: number }) {
  const [display, setDisplay] = useState(initialValue ? String(initialValue) : "");
  const digits = display.replace(/\D/g, "");
  const formatted = digits ? Number(digits).toLocaleString("id-ID") : "";

  return (
    <>
      <input
        required
        inputMode="numeric"
        value={formatted}
        onChange={(event) => setDisplay(event.target.value.replace(/\D/g, ""))}
        placeholder="500.000"
        aria-label="Jumlah budget dalam Rupiah"
        className="mt-2 w-full rounded-xl border border-[#dce3dc] px-3 py-2.5"
      />
      <input type="hidden" name="amount" value={digits} />
    </>
  );
}
