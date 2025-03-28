'use client';

import * as React from 'react';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label className={`label ${className || ''}`} ref={ref} {...props}>
      <span className="label-text">{props.children}</span>
    </label>
  );
});
Label.displayName = 'Label';

export { Label };
