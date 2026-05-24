import { Suspense } from "react";
import CallbackInner from "./CallbackInner";


export default function Page() {
  return (
    <Suspense fallback={<div>Finalizing account...</div>}>
      <CallbackInner />
    </Suspense>
  );
}