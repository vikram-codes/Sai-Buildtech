"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { Check, Mail, Phone, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TimeAgo } from "@/components/admin/time-ago";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { deleteInquiry, setInquiryHandled } from "@/lib/actions/admin";
import type { AdminInquiry } from "@/lib/data/admin";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/** wa.me needs digits with country code. Indian 10-digit numbers get +91 added. */
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
}

function replyLink(inquiry: AdminInquiry) {
  const firstName = inquiry.name.trim().split(/\s+/)[0];
  const about = inquiry.property ? ` about "${inquiry.property.title}"` : "";
  const text = `Hi ${firstName}, this is ${siteConfig.name}. Thanks for your enquiry${about}.`;
  return `https://wa.me/${whatsappNumber(inquiry.phone)}?text=${encodeURIComponent(text)}`;
}

function InquiryItem({ inquiry }: { inquiry: AdminInquiry }) {
  const [, startTransition] = useTransition();
  const [handled, setOptimisticHandled] = useOptimistic(inquiry.handled);

  const toggleHandled = () =>
    startTransition(async () => {
      setOptimisticHandled(!handled);
      const result = await setInquiryHandled(inquiry.id, !handled);
      if (result.ok) toast.success(handled ? "Moved back to New" : "Marked as handled");
      else toast.error(result.error);
    });

  return (
    <li className={cn("rounded-xl border bg-card p-5", handled && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {!handled && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">New</span>
          )}
          <p className="font-semibold">{inquiry.name}</p>
          <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`} className="text-sm text-muted-foreground hover:text-foreground">
            {inquiry.phone}
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          <TimeAgo iso={inquiry.created_at} />
        </p>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        {inquiry.property ? (
          <>
            About{" "}
            <Link href={`/listings/${inquiry.property.slug}`} target="_blank" className="text-gold hover:underline">
              {inquiry.property.title}
            </Link>
          </>
        ) : inquiry.source === "property" ? (
          "About a listing that has since been deleted"
        ) : (
          "Via the contact form"
        )}
      </p>

      {inquiry.message && <p className="mt-3 text-sm whitespace-pre-line">{inquiry.message}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <a href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}>
              <Phone /> Call
            </a>
          </Button>
          <Button asChild size="sm" variant="whatsapp">
            <a href={replyLink(inquiry)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> WhatsApp reply
            </a>
          </Button>
          {inquiry.email && (
            <Button asChild size="sm" variant="outline">
              <a href={`mailto:${inquiry.email}`}>
                <Mail /> Email
              </a>
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={handled ? "ghost" : "secondary"} onClick={toggleHandled}>
            {handled ? <RotateCcw /> : <Check />}
            {handled ? "Mark as new" : "Mark handled"}
          </Button>
          <ConfirmDialog
            title={`Delete the inquiry from ${inquiry.name}?`}
            description="It will be permanently removed. This can't be undone."
            trigger={
              <Button size="sm" variant="ghost" aria-label={`Delete inquiry from ${inquiry.name}`}>
                <Trash2 className="text-destructive" />
              </Button>
            }
            onConfirm={async () => {
              const result = await deleteInquiry(inquiry.id);
              if (result.ok) toast.success("Inquiry deleted");
              else toast.error(result.error);
              return result.ok;
            }}
          />
        </div>
      </div>
    </li>
  );
}

export function InquiryList({ inquiries, emptyText }: { inquiries: AdminInquiry[]; emptyText: string }) {
  if (inquiries.length === 0) {
    return <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">{emptyText}</p>;
  }
  return (
    <ul className="space-y-3">
      {inquiries.map((inquiry) => (
        <InquiryItem key={inquiry.id} inquiry={inquiry} />
      ))}
    </ul>
  );
}
