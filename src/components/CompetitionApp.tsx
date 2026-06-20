"use client";

import { useEffect, useRef, useState } from "react";
import { HonourableMentionsStep } from "@/components/HonourableMentionsStep";
import { JudgeNameStep } from "@/components/JudgeNameStep";
import { LandingPage } from "@/components/LandingPage";
import { ReviewStep } from "@/components/ReviewStep";
import { ScoringStep } from "@/components/ScoringStep";
import { ThanksStep } from "@/components/ThanksStep";
import { useDraftState } from "@/hooks/useDraftState";
import {
  AUDIO_PATH,
  isDraftScoringComplete,
  isHonourableMentionsComplete,
  type ContestantId,
  type Scores,
} from "@/lib/scoring";

export function CompetitionApp() {
  const { draft, updateDraft, resetDraft } = useDraftState();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(AUDIO_PATH);
    audioRef.current.preload = "auto";

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const handleEnterCompetition = async () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;

    setIsPlaying(true);
    audio.currentTime = 0;

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      updateDraft({ step: "judge" });
      return;
    }

    audio.onended = () => {
      setIsPlaying(false);
      updateDraft({ step: "judge" });
    };
  };

  const handleSkipIntro = () => {
    const audio = audioRef.current;
    if (!audio || !isPlaying) return;

    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
    setIsPlaying(false);
    updateDraft({ step: "judge" });
  };

  const handleScoreChange = (contestant: ContestantId, scores: Scores) => {
    updateDraft({
      scores: {
        ...draft.scores,
        [contestant]: scores,
      },
    });
  };

  switch (draft.step) {
    case "landing":
      return (
        <LandingPage
          isPlaying={isPlaying}
          onEnter={handleEnterCompetition}
          onSkip={handleSkipIntro}
        />
      );
    case "judge":
      return (
        <JudgeNameStep
          judgeName={draft.judgeName}
          onJudgeNameChange={(judgeName) => updateDraft({ judgeName })}
          onContinue={() => updateDraft({ step: "scoring" })}
          onBack={() => updateDraft({ step: "landing" })}
        />
      );
    case "scoring":
      return (
        <ScoringStep
          draft={draft}
          onContestantChange={(activeContestant) =>
            updateDraft({ activeContestant })
          }
          onScoreChange={handleScoreChange}
          onContinue={() => updateDraft({ step: "honourable" })}
          onBack={() => updateDraft({ step: "judge" })}
        />
      );
    case "honourable":
      if (!isDraftScoringComplete(draft)) {
        return (
          <ScoringStep
            draft={draft}
            onContestantChange={(activeContestant) =>
              updateDraft({ activeContestant })
            }
            onScoreChange={handleScoreChange}
            onContinue={() => updateDraft({ step: "honourable" })}
            onBack={() => updateDraft({ step: "judge" })}
          />
        );
      }

      return (
        <HonourableMentionsStep
          draft={draft}
          onChange={(honourableMentions) => updateDraft({ honourableMentions })}
          onBack={() => updateDraft({ step: "scoring" })}
          onContinue={() => updateDraft({ step: "review" })}
        />
      );
    case "review":
      if (!isDraftScoringComplete(draft)) {
        return (
          <ScoringStep
            draft={draft}
            onContestantChange={(activeContestant) =>
              updateDraft({ activeContestant })
            }
            onScoreChange={handleScoreChange}
            onContinue={() => updateDraft({ step: "honourable" })}
            onBack={() => updateDraft({ step: "judge" })}
          />
        );
      }

      if (!isHonourableMentionsComplete(draft)) {
        return (
          <HonourableMentionsStep
            draft={draft}
            onChange={(honourableMentions) => updateDraft({ honourableMentions })}
            onBack={() => updateDraft({ step: "scoring" })}
            onContinue={() => updateDraft({ step: "review" })}
          />
        );
      }

      return (
        <ReviewStep
          draft={draft}
          onBack={() => updateDraft({ step: "honourable" })}
          onSubmit={() => updateDraft({ step: "thanks" })}
        />
      );
    case "thanks":
      return (
        <ThanksStep
          judgeName={draft.judgeName.trim()}
          onStartOver={resetDraft}
        />
      );
    default:
      return null;
  }
}
