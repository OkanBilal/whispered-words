import * as React from "react";

import cx from "@/lib/cx";

export interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {}

const Column = React.forwardRef<HTMLDivElement, ColumnProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cx("flex flex-col", className)} ref={ref} {...props} />
    );
  }
);
Column.displayName = "Column";

export { Column };