'use client';

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseStyle = "px-4 py-2 rounded font-medium transition-colors";

    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 text-black hover:bg-gray-100"
    };

    return (
      <button
        className={`${baseStyle} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
