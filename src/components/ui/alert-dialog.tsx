"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = forwardRef<ElementRef<typeof AlertDialogPrimitive.Overlay>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>>(({ className = "", ...props }, ref) => <AlertDialogPrimitive.Overlay ref={ref} className={`fixed inset-0 z-50 bg-[#173d2b]/35 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out ${className}`} {...props} />);
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = forwardRef<ElementRef<typeof AlertDialogPrimitive.Content>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>>(({ className = "", ...props }, ref) => <AlertDialogPortal><AlertDialogOverlay /><AlertDialogPrimitive.Content ref={ref} className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl outline-none sm:p-8 ${className}`} {...props} /></AlertDialogPortal>);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className = "", ...props }: ComponentPropsWithoutRef<"div">) => <div className={`space-y-2 ${className}`} {...props} />;
const AlertDialogFooter = ({ className = "", ...props }: ComponentPropsWithoutRef<"div">) => <div className={`mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end ${className}`} {...props} />;
const AlertDialogTitle = forwardRef<ElementRef<typeof AlertDialogPrimitive.Title>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(({ className = "", ...props }, ref) => <AlertDialogPrimitive.Title ref={ref} className={`text-2xl font-semibold text-[#173d2b] ${className}`} {...props} />);
const AlertDialogDescription = forwardRef<ElementRef<typeof AlertDialogPrimitive.Description>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>>(({ className = "", ...props }, ref) => <AlertDialogPrimitive.Description ref={ref} className={`text-sm leading-6 text-[#718076] ${className}`} {...props} />);
const AlertDialogCancel = forwardRef<ElementRef<typeof AlertDialogPrimitive.Cancel>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>>(({ className = "", ...props }, ref) => <AlertDialogPrimitive.Cancel ref={ref} className={`cursor-pointer rounded-xl border border-[#dce3dc] px-5 py-3 text-sm font-semibold text-[#526057] transition duration-200 hover:-translate-y-0.5 hover:bg-[#f7faf5] focus:outline-none focus:ring-2 focus:ring-[#d8f37d] ${className}`} {...props} />);
const AlertDialogAction = forwardRef<ElementRef<typeof AlertDialogPrimitive.Action>, ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>>(({ className = "", ...props }, ref) => <AlertDialogPrimitive.Action ref={ref} className={`cursor-pointer rounded-xl bg-[#a4473c] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#8f382f] focus:outline-none focus:ring-2 focus:ring-[#f4c5bd] ${className}`} {...props} />);

AlertDialogHeader.displayName = "AlertDialogHeader";
AlertDialogFooter.displayName = "AlertDialogFooter";
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger };
