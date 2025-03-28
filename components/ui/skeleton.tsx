import * as React from 'react';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`skeleton ${className || ''}`} {...props} />;
}

export { Skeleton };
