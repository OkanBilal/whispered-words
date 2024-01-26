"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import cx from "@/lib/cx";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cx(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cx(
            pathname === item.href
              ? "underline"
              : "hover:bg-transparent hover:underline",
            "justify-start text-white text-lg "
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
