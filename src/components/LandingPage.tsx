import Image from "next/image";
import { GradientOutlineText } from "@/components/GradientOutlineText";
import { anton, luckiestGuy } from "@/lib/fonts";

interface LandingPageProps {
  isPlaying: boolean;
  onEnter: () => void;
}

export function LandingPage({ isPlaying, onEnter }: LandingPageProps) {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <Image
          src="/images/landing.png"
          alt="Lasagne Off — Matthew vs Jamilla"
          width={994}
          height={1582}
          className="mb-8 w-full rounded-3xl shadow-lg"
          priority
          sizes="(max-width: 384px) 100vw, 384px"
        />

        <div className="mt-8 text-center">
          <GradientOutlineText
            fontClassName={anton.className}
            sizeClassName="text-[2.35rem]"
            trackingClassName="tracking-wide"
            wrapClassName="landing-title-bbq-wrap"
            strokeClassName="landing-title-bbq-stroke"
            fillClassName="landing-title-bbq-fill"
          >
            Lasagne Off!!
          </GradientOutlineText>

          <div className="mt-2">
            <GradientOutlineText
              fontClassName={luckiestGuy.className}
              sizeClassName="text-[2.35rem]"
              trackingClassName="tracking-tight"
              wrapClassName="landing-title-blast-wrap"
              strokeClassName="landing-title-blast-stroke"
              fillClassName="landing-title-blast-fill"
            >
              Matthew vs Jamila
            </GradientOutlineText>
          </div>
        </div>

        <button
          type="button"
          onClick={onEnter}
          disabled={isPlaying}
          className="mt-8 w-full rounded-2xl bg-accent px-6 py-4 !text-[2rem] font-semibold leading-tight text-white shadow-lg shadow-amber-900/15 transition hover:bg-accent-dark disabled:cursor-wait disabled:opacity-80"
        >
          {isPlaying ? "That's Amore!!" : "Enter Competition"}
        </button>

        {isPlaying && (
          <p className="mt-3 text-center text-sm text-muted">
            Enjoy the music — scoring begins when the track ends.
          </p>
        )}
      </div>
    </section>
  );
}
