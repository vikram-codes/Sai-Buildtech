import { Handshake, MapPinned, MessagesSquare, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

// Claims about the business — keep these true. Edit here.
const REASONS = [
  {
    icon: ShieldCheck,
    title: "Verified listings",
    text: "Every property is personally checked by our team, with clear titles and paperwork before it reaches you.",
  },
  {
    icon: MapPinned,
    title: "Local expertise",
    text: "From our Krishna Nagar office we know Delhi, Noida and Gurugram street by street — prices, builders and neighbourhoods.",
  },
  {
    icon: Handshake,
    title: "End-to-end support",
    text: "Site visits, negotiation, documentation and registry — we stay with you from the first call to the keys.",
  },
  {
    icon: MessagesSquare,
    title: "Always reachable",
    text: "Quick, personal replies on WhatsApp and phone. No call centres, no chasing.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="space-y-12">
        <Reveal>
          <SectionHeading
            eyebrow="Why Sai Buildtech"
            title="Property advice you can trust"
            description="Buying or renting in Delhi NCR is a big decision. We make it a confident one."
            align="center"
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <Reveal key={title}>
              <div className="h-full rounded-2xl border bg-card p-6 transition-colors hover:border-gold/40">
                <span className="flex size-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-sans text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
