import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface InputsProps {
  className?: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Inputs: NextPage<InputsProps> = ({
  className,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
