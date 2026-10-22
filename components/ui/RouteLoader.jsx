import { Flame, LoaderCircle } from "lucide-react";

export default function RouteLoader() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="flex min-h-[65vh] items-center justify-center bg-[#fffdf9] px-5"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#df4428] text-white shadow-lg shadow-[#df4428]/20">
          <Flame size={30} />
        </div>

        <h2 className="mt-5 text-xl font-black tracking-tight text-[#211b17]">
          FIREBITE
        </h2>

        <div className="mt-5 flex items-center gap-3 text-sm text-[#756a61]">
          <LoaderCircle
            size={19}
            className="animate-spin text-[#df4428]"
          />
          Preparing something delicious...
        </div>

        <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-[#e9e0d7]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#df4428]" />
        </div>
      </div>
    </main>
  );
}