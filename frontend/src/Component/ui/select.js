import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export function Select({ value, onValueChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

export function SelectTrigger({ children, className }) {
  return <div className={cn("relative", className)}>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <option value="">{placeholder}</option>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
