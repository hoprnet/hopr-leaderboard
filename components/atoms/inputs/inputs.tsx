import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface InputsProps {
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Inputs: NextPage<InputsProps> = ({
  className,
  type,
  placeholder,
  value,
  checked,
  onChange,
}) => {
  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      checked={checked}
    />
  );
};
