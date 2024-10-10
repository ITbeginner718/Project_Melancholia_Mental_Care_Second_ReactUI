

import React from "react";

interface RadioProps {
  children: React.ReactNode;
  level: number;
  index:number;
  category: string;
  name?: string;
  content: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

function Radio({ index, category, children, name, level, content, defaultChecked, disabled, onChange, checked }: RadioProps) {
  const value = `${index}|${category}|${name}|${level}|${content}`;

  return (
    <label>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        checked={checked}
      />
      <span> </span>
      {children}
    </label>
  );
}

export default Radio;