import * as React from 'react';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`} {...props} />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={`card-body p-6 ${className}`} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <h2 className={`card-title ${className}`} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <p className={`text-base-content/70 ${className}`} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`card-actions justify-end p-6 pt-0 ${className}`}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
