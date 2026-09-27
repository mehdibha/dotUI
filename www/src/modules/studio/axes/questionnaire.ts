/* Questionnaire — how its choices and text answer ease between states: the
   choice's hover/checked fill and the input's focus ring, one timing for
   both on the `--studio-questionnaire-state-*` vars. */

import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn has no questionnaire; today's `transition-*` rides Tailwind's
   default, like its field and choice card. */
const MOTION = TAILWIND_TIMING

export const QUESTIONNAIRE_DEFAULTS = {
  questionnaireMotion: MOTION,
}

export const QUESTIONNAIRE_SCHEMA: ChapterSchema<
  typeof QUESTIONNAIRE_DEFAULTS
> = {
  questionnaireMotion: STATE_CHANGE,
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
