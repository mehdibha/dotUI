import { LinkButton } from "@/registry/ui/button"

/** Closing CTA: the whole pitch reduced to one line and one button. */
export function CtaSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <h2 className="[font-feature-settings:'calt'_0,'rlig','ss11'] text-3xl leading-tight font-normal tracking-[-0.05em] text-balance text-fg antialiased sm:text-5xl">
        Your design system,{" "}
        <span className="text-fg-muted">one click away.</span>
      </h2>
      <LinkButton href="/create" variant="primary" size="lg" className="mt-8">
        Build yours
      </LinkButton>
    </section>
  )
}
