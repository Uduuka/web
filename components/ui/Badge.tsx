import React, { ComponentProps } from "react";

type BadgeProps = ComponentProps<"div"> & {
  variant?: string;
};

export default function Badge({ variant, ...props }: BadgeProps) {
  return <div {...props}>Badge</div>;
}
