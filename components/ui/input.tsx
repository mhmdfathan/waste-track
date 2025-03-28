import * as React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`input input-bordered w-full ${className || ''}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
