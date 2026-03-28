"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, min = 0, max = 100, ...props }, ref) => {
    // Determine the scalar value to use for the input
    const [localValue, setLocalValue] = React.useState(
      value ? value[0] : defaultValue ? defaultValue[0] : Number(min)
    );

    // Sync with controlled value
    React.useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value[0]);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setLocalValue(val);
      if (onValueChange) {
        onValueChange([val]);
      }
    };

    return (
      <input
        type="range"
        ref={ref}
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        className={cn(
          "w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50",
          className
        )}
        {...props}
      />
    );
  }
)
Slider.displayName = "Slider"

export { Slider }
