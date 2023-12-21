import cx from "@/lib/cx";
import { ReactNode } from "react";

type ElementProps = {
  children?: ReactNode;
  className?: string;
};

declare type RFC<T = any> = React.FC<T & ElementProps>;

export const H1: RFC = ({ children, ...props }) => {
  return (
    <h1
      {...props}
      className={cx(
        "text-3xl font-semibold tracking-tight sm:text-4xl",
        props.className
      )}
    >
      {children}
    </h1>
  );
};
export const H2: RFC = ({ children, ...props }) => {
  return (
    <h2
      {...props}
      className={cx(
        "pb-2 text-3xl font-semibold tracking-tight",
        props.className
      )}
    >
      {children}
    </h2>
  );
};
export const H3: RFC = ({ children, ...props }) => {
  return (
    <h3
      className={cx(
        "text-2xl font-semibold tracking-tight",
        props.className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};
export const H4: RFC = ({ children, ...props }) => {
  return (
    <h4
      className={cx(
        "text-xl font-semibold tracking-tight",
        props.className
      )}
      {...props}
    >
      {children}
    </h4>
  );
};

export const P: RFC = ({ children, ...props }) => {
  return (
    <p
      {...props}
      className={cx("leading-7 ", props.className)}
    >
      {children}
    </p>
  );
};
export const Span: RFC = ({ children, ...props }) => {
  return (
    <span
      className={cx("leading-7 ", props.className)}
      {...props}
    >
      {children}
    </span>
  );
};