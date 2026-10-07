import AlertDemo from "@/registry/ui/alert/demos/default"
import BadgeDemo from "@/registry/ui/badge/demos/variants"
import { Button } from "@/registry/ui/button"
import LoaderDemo from "@/registry/ui/loader/demos/basic"
import ProgressDemo from "@/registry/ui/progress-bar/demos/variants"
import SkeletonDemo from "@/registry/ui/skeleton/demos/card"
import { toastManager } from "@/registry/ui/toast"

import { Board, BoardSection } from "./board"

export default function FeedbackBoard() {
  return (
    <Board id="feedback">
      <BoardSection
        member="badge"
        title="Badge"
        axes={[
          "badgeStyle",
          "badgeShape",
          "badgeCase",
          "dangerSeed",
          "surfaceGlass",
          "feedbackMotion",
          "motion",
        ]}
      >
        <BadgeDemo />
      </BoardSection>
      <BoardSection member="alert" title="Alert" axes={["alertStyle"]}>
        <AlertDemo />
      </BoardSection>
      <BoardSection
        member="toast"
        title="Toast"
        axes={["toastStyle", "toastStatus"]}
      >
        <Button
          onPress={() =>
            toastManager.add({
              title: "Changes saved",
              description: "Your update is live.",
              type: "success",
            })
          }
        >
          Show toast
        </Button>
      </BoardSection>
      <BoardSection
        member="loading"
        title="Loading"
        axes={[
          "spinnerStyle",
          "skeletonAnimation",
          "progressTrack",
          "progressTrackStyle",
          "progressColor",
        ]}
      >
        <LoaderDemo />
        <ProgressDemo />
        <SkeletonDemo />
      </BoardSection>
    </Board>
  )
}
