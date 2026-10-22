import { Flame, Sparkles } from "lucide-react";

const marqueeItems = [
  { label: "BOLD FLAVOUR", Icon: Flame },
  { label: "CRISPY BITES", Icon: Sparkles },
  { label: "BBQ HEAT", Icon: Flame },
  { label: "MADE TO CRAVE", Icon: Sparkles },
];

function MarqueeTrack({ direction = "left", outlined = false }) {
  return (
    <div
      className={`firebite-marquee__ribbon ${
        outlined
          ? "firebite-marquee__ribbon--outline"
          : "firebite-marquee__ribbon--solid"
      }`}
    >
      <div
        className={`firebite-marquee__track ${
          direction === "right"
            ? "firebite-marquee__track--right"
            : "firebite-marquee__track--left"
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            className="firebite-marquee__group"
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {marqueeItems.map(({ label, Icon }) => (
              <span className="firebite-marquee__item" key={label}>
                {label}
                <Icon aria-hidden="true" size={22} strokeWidth={2.5} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MarqueeBand() {
  return (
    <section className="firebite-marquee" aria-label="Firebite food highlights">
      <p className="sr-only">
        Firebite: bold flavour, crispy bites, BBQ heat, and food made to crave.
      </p>
      <div className="firebite-marquee__stage" aria-hidden="true">
        <MarqueeTrack direction="left" />
        <MarqueeTrack direction="right" outlined />
      </div>
    </section>
  );
}
