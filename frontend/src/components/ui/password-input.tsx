import { Input } from "@/components/ui/input";
import { useState } from "react";

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? "text" : "password"} className={`pr-10 ${props.className ?? ""}`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs select-none"
        tabIndex={-1}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
