/* Questionnaire — how its choices and text answer ease between states: the
   choice's hover/checked fill and the input's focus ring, one timing for
   both on the `--studio-questionnaire-state-*` vars. */

import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"

/* shadcn has no questionnaire; today's `transition-*` rides Tailwind's
   default, like its field and choice card. */
const MOTION = TAILWIND_TIMING

export const QUESTIONNAIRE_DEFAULTS = {
  questionnaireMotion: MOTION,
}

export function resolveQuestionnaire(state: StudioState): Resolved {
  return {
    tokens: resolveStateChange(
      "questionnaire",
      state.questionnaireMotion,
      MOTION,
    ),
  }
}
