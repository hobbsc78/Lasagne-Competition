interface ThanksStepProps {
  judgeName: string;
  onStartOver: () => void;
}

export function ThanksStep({ judgeName, onStartOver }: ThanksStepProps) {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl">✉️</div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">Almost done!</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Thank you, <span className="font-semibold text-foreground">{judgeName}</span>.
          Your email app should be open with your score summary — please tap{" "}
          <span className="font-semibold text-foreground">Send</span> to submit
          your scores to the organiser.
        </p>

        <button
          type="button"
          onClick={onStartOver}
          className="mt-8 w-full rounded-2xl border border-border bg-card px-6 py-4 text-sm font-semibold text-foreground"
        >
          Score again as a new judge
        </button>
      </div>
    </section>
  );
}
