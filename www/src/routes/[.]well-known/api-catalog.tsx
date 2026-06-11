import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'

// Serves /.well-known/api-catalog (RFC 9727) — a linkset that points agents at
// dotUI's real, machine-consumable resources: the shadcn component registry
// endpoint (GET /r/{name}), the installation guide, and the llms.txt index.
// This deliberately advertises only capabilities that actually exist — there is
// no MCP server, agent card, or OAuth on this static docs site, so none are
// claimed (a hollow capability card is worse than its absence).
//
// Spec: https://www.rfc-editor.org/rfc/rfc9727 (Content-Type
// application/linkset+json) + RFC 9264 §4.2 for the JSON serialization: one link
// context object per `anchor`, with each relation type as a MEMBER NAME whose
// value is an array of link target objects ({ href, type?, title? }) — NOT a
// flat list of { rel, href } objects (a conformant parser reads those as zero
// links).

export const Route = createFileRoute('/.well-known/api-catalog')({
  server: {
    handlers: {
      GET: () => {
        const { url } = siteConfig

        const linkset = {
          linkset: [
            {
              anchor: url,
              'api-catalog': [
                {
                  href: `${url}/.well-known/api-catalog`,
                  title: 'dotUI API catalog',
                },
              ],
              item: [
                {
                  href: `${url}/r/{name}`,
                  type: 'application/json',
                  title:
                    'dotUI shadcn component registry — GET /r/{name} returns the resolved registry item JSON for a component, consumable by the shadcn CLI and AI tooling.',
                },
              ],
              'service-doc': [
                {
                  href: `${url}/docs/installation`,
                  type: 'text/html',
                  title:
                    'How to install and consume dotUI components via the registry and the shadcn CLI.',
                },
              ],
              describedby: [
                {
                  href: `${url}/llms.txt`,
                  type: 'text/plain',
                  title:
                    'llms.txt — machine-readable index of dotUI documentation for AI agents.',
                },
              ],
            },
          ],
        }

        return new Response(`${JSON.stringify(linkset, null, 2)}\n`, {
          headers: {
            'Content-Type': 'application/linkset+json',
            'Cache-Control':
              'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
