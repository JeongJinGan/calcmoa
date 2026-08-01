"use client";

import { ChangeEvent } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function AmountInput({ value, onChange, className, placeholder }: AmountInputProps) {
  const digitsOnly = value.replace(/[^0-9]/g, "");
  const formatted = digitsOnly === "" ? "" : Number(digitsOnly).toLocaleString("ko-KR");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/[^0-9]/g, ""));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formatted}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
