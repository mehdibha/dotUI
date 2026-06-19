import { ArrowRightIcon, ExternalLinkIcon } from 'lucide-react'
import { Link } from 'www'

const col: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 14,
}

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 20,
}

export const Variants = () => (
  <div style={col}>
    <Link href="#" variant="accent">
      Accent link
    </Link>
    <Link href="#" variant="quiet">
      Quiet link
    </Link>
  </div>
)

export const WithIcons = () => (
  <div style={row}>
    <Link href="#" variant="accent">
      Read the docs
      <ArrowRightIcon />
    </Link>
    <Link href="#" variant="accent">
      <ExternalLinkIcon />
      Open in new tab
    </Link>
  </div>
)

export const InText = () => (
  <p style={{ maxWidth: 360, lineHeight: 1.6 }}>
    By continuing you agree to our{' '}
    <Link href="#" variant="quiet">
      Terms of Service
    </Link>{' '}
    and{' '}
    <Link href="#" variant="quiet">
      Privacy Policy
    </Link>
    .
  </p>
)
