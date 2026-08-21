import { LinkButton } from "@/registry/ui/button"

/** Closing CTA: the whole pitch reduced to one line and one button. */
export function CtaSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-[clamp(1.75rem,calc((100vw-2rem)/10.3),3rem)] leading-[1.17] font-normal tracking-[-0.06em] text-balance text-fg antialiased sm:text-[3rem] sm:leading-[3.5rem]">
        <span className="block">Your design system,</span>
        <span className="block text-fg-muted">one click away.</span>
      </h2>
      <LinkButton
        href="/create"
        variant="primary"
        size="lg"
        className="mt-8 px-4"
      >
        Build yours
      </LinkButton>
    </section>
  )
}
