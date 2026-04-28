"use client";
import Image from "next/image";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

import {
  PaymentModal,
  Chains,
  usePaymentModal,
  type Chain,
} from "@chainrails/react";

export default function Home() {
  useEffect(() => {
    sdk.actions.ready().catch(() => {});

    function getEthereumProvider(): any | null {
      if (typeof window === "undefined") return null;
      const ethereum = (window as any).ethereum ?? null;
      if (ethereum) {
        return ethereum;
      }
      return null;
    }

    console.log("getEthereumProvider", getEthereumProvider());
  }, []);

  const cr = usePaymentModal({
    sessionToken: null,
    amount: "0.1",
    onCancel: () => {
      console.log("Payment cancelled");
    },
    onSuccess: (result?: { transactionHash?: string }) => {
      console.log(result);
      const hash = result?.transactionHash ?? "n/a";
      console.log("Payment successful", hash);
      void sdk.haptics.notificationOccurred("success").catch(() => {});
    },
  });

  async function pay() {
    try {
      const res = await fetch(
        `https://chainrails-sdk-server.vercel.app/test/create-session?amount=${encodeURIComponent("0.1")}&destinationChain=${Chains.BASE}&recipient=${"0xda3ecb2e5362295e2b802669dd47127a61d9ce54"}&token=${"USDC"}`,
      );

      const data = await res.json();
      cr.updateSession(data);
      cr.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
    } finally {
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <button onClick={pay}>Pay</button>
        <button
          onClick={async () => {
            console.log(await sdk.wallet.getEthereumProvider());
          }}
        >
          test
        </button>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
        <PaymentModal {...cr} env="internal" />
      </main>
    </div>
  );
}
