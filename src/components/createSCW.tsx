"use client";
import { use, useEffect, useRef, useState } from "react";
import Button from "./button";
import { useAccount } from "wagmi";
import { isAddress } from "viem";

export default function CreateSCW() {
  const { address } = useAccount();

  const [signers, setSigners] = useState<string[]>([]);

  const lastInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSigners([address as string]);
  }, [address]);

  useEffect(() => {
    if (lastInput.current) {
      lastInput.current.focus();
    }
  }, [signers]);

  const onCreateSCW = () => {
    try {
      signers.forEach((signer) => {
        if (isAddress(signer) === false) {
          throw new Error(`Invalid address: ${signer}`);
        }
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        window.alert(error.message);
      }
    }
  };

  return (
    <main className="flex flex-col gap-6 max-w-sm w-full">
      {signers.map((signer, index) => (
        <input
          key={index}
          type="text"
          className=" rounded-lg p-2 w-full text-slate-700"
          placeholder="0x000"
          value={signer}
          ref={index === signers.length - 1 ? lastInput : null}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const newSigners = [...signers];
              newSigners.push(``);
              setSigners(newSigners);
            } else if (
              event.key === "Backspace" &&
              signer === `` &&
              signers.length > 1
            ) {
              const newSigners = [...signers];
              newSigners.splice(index, 1);
              setSigners(newSigners);
            }
          }}
          onChange={(event) => {
            const newSigners = [...signers];
            newSigners[index] = event.target.value;
            setSigners(newSigners);
          }}
        />
      ))}

      <Button onClick={onCreateSCW}>Create New Wallet</Button>
    </main>
  );
}