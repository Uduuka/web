import Link from "next/link";

export default function SubscribeDialog({ message }: { message: string }) {
  return (
    <div className="absolute w-full h-full bg-white/90 z-10 pt-10 top-0 left-0">
      <div className="w-full max-w-80 min-h-96 rounded-lg bg-orange-50 shadow-2xl z-40 mx-auto p-5 flex flex-col gap-5">
        <h1 className="text-center text-primary text-xl pt-5 ">
          Upgrade your plan.
        </h1>
        <p className="text-accent">{message}</p>
        <Link
          href="/dashboard/billing/pay?plan=pro"
          className="px-5 py-2 rounded-lg text-background text-center bg-primary font-bold"
        >
          Upgrade to Pro
        </Link>
        <div className="">
          <h1 className="text-accent font-thin mb-1">
            The pro plan comes with:
          </h1>
          <ul className="text-xs pl-5 list-disc text-accent font-light">
            <li>All from the free plan</li>
            <li>Unlimited ads</li>
            <li>One free ad promotion per week</li>
            <li>Flash sales</li>
            <li>A store</li>
            <li>An online mini point sale system</li>
            <li>Unlimited map directions</li>
            <li>Unlimited ad images</li>
          </ul>
        </div>
        <div className="flex w-full justify-between gap-2">
          <Link
            href="/pricing"
            className="transition-colors text-center flex justify-center items-center font-thin text-xs px-5 py-1 text-background rounded-lg bg-accent hover:bg-accent/80"
          >
            Vew all plans
          </Link>
          <Link
            href="/dashboard/billing"
            className="transition-colors text-center flex justify-center items-center font-thin text-xs px-5 py-1 text-background rounded-lg bg-accent hover:bg-accent/80"
          >
            See billing plan
          </Link>
        </div>
      </div>
    </div>
  );
}
