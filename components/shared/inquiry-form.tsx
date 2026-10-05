"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/actions/inquiries";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { inquirySchema, type InquiryInput } from "@/lib/validation/inquiry";

type Props = {
  source: "contact" | "property";
  propertyId?: string;
  defaultMessage?: string;
  submitLabel?: string;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

/**
 * Call-back / inquiry form. Checks fields as you go (same rules as the server),
 * then saves through the submitInquiry Server Action. Shared by property pages and /contact.
 */
export function InquiryForm({ source, propertyId, defaultMessage = "", submitLabel = "Request a call back" }: Props) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", email: "", message: defaultMessage },
    mode: "onTouched",
  });

  const onSubmit = (values: InquiryInput, event?: React.BaseSyntheticEvent) => {
    // Honeypot value, read from the submitted form (people never see this field)
    const website = new FormData(event?.target as HTMLFormElement).get("website")?.toString();
    setServerError(undefined);
    startTransition(async () => {
      const result = await submitInquiry({
        ...values,
        source,
        propertyId,
        website,
        // Time since the page loaded (spam check: people take more than a few seconds)
        elapsedMs: Math.round(performance.now()),
      });
      if (result.ok) {
        setSent(true);
        return;
      }
      setServerError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof InquiryInput, { message });
      }
    });
  };

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-xl bg-emerald/10 px-4 py-8 text-center">
        <CheckCircle2 className="size-10 text-emerald" />
        <p className="font-semibold">Thank you — message received</p>
        <p className="text-sm text-muted-foreground">We&apos;ll call you back shortly, usually within a few hours.</p>
      </div>
    );
  }

  const field = (name: keyof InquiryInput) => ({
    id: `${source}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${source}-${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`${source}-name`}>Name</Label>
        <Input {...field("name")} {...register("name")} autoComplete="name" placeholder="Your name" />
        <FieldError id={`${source}-name-error`} message={errors.name?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${source}-phone`}>Phone</Label>
        <Input {...field("phone")} {...register("phone")} type="tel" autoComplete="tel" placeholder="+91 98765 43210" />
        <FieldError id={`${source}-phone-error`} message={errors.phone?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${source}-email`}>
          Email <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input {...field("email")} {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" />
        <FieldError id={`${source}-email-error`} message={errors.email?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${source}-message`}>Message</Label>
        <Textarea {...field("message")} {...register("message")} rows={4} />
        <FieldError id={`${source}-message-error`} message={errors.message?.message} />
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill every field */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${source}-website`}>Website</label>
        <input id={`${source}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError && (
        <div role="alert" className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <p className="text-destructive">{serverError}</p>
          <Button asChild variant="whatsapp" size="sm">
            <a href={buildWhatsAppLink(defaultMessage || undefined)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" /> WhatsApp us instead
            </a>
          </Button>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        {pending ? "Sending…" : submitLabel}
      </Button>
      <p className="text-center text-xs text-muted-foreground">We only use your details to reply to this enquiry.</p>
    </form>
  );
}
