import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Input }