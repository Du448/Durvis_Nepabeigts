"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";

const ERRORS = {
  wrong: "Neteisingas slaptažodis.",
  blocked: "Per daug bandymų. Pabandykite po 15 minučių.",
};

export default function LoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <form action={action} className="w-full max-w-[380px] rounded-lg bg-white p-8 shadow-sm">
        <h1 className="text-[22px] font-semibold text-neutral-900">Kainų valdymas</h1>
        <p className="mt-1 text-[14px] text-neutral-500">NT Durys · ntdurys.lt</p>

        <label htmlFor="password" className="mt-6 block text-[14px] font-medium text-neutral-800">
          Slaptažodis
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className="mt-1.5 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-[16px] outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
        />

        {state?.error ? (
          <p role="alert" className="mt-3 text-[14px] text-red-700">
            {ERRORS[state.error] || "Prisijungimo klaida."}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-emerald-800 px-4 py-3 text-[15px] font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
        >
          {pending ? "Tikrinama…" : "Prisijungti"}
        </button>
      </form>
    </main>
  );
}
