import type { Metadata } from "next";
import { ControlRoom } from "@/components/sections/ControlRoom";

export const metadata: Metadata = {
  title: "Lab · Control Room — Pimentón",
  robots: { index: false, follow: false },
};

export default function ControlRoomLabPage() {
  return (
    <main>
      <ControlRoom />
    </main>
  );
}
