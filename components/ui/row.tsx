import * as React from "react";

import cx from "@/lib/cx";

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {}

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cx("flex flex-row", className)} ref={ref} {...props} />
    );
  }
);
Row.displayName = "Row";

export { Row };