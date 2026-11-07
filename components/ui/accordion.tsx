"use client";

// Adapted from shadcn/ui (MIT); see shadcn-LICENSE.txt.
import type { ComponentProps } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

export function Accordion(props: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

export function AccordionItem({ className = "", ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={`jp-accordion-item ${className}`} {...props} />;
}

export function AccordionTrigger({ className = "", children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return <AccordionPrimitive.Header className="jp-accordion-header">
    <AccordionPrimitive.Trigger data-slot="accordion-trigger" className={`jp-accordion-trigger ${className}`} {...props}>
      <span>{children}</span><Plus size={20} aria-hidden="true" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>;
}

export function AccordionContent({ className = "", children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return <AccordionPrimitive.Content data-slot="accordion-content" className="jp-accordion-content" {...props}>
    <div className={`jp-accordion-body ${className}`}>{children}</div>
  </AccordionPrimitive.Content>;
}
