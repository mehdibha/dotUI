import { Link } from '@/registry/ui/link'

const sections = [
  { title: 'Product', links: ['Features', 'Pricing', 'Changelog'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers'] },
]

export default function Demo() {
  return (
    <div className="grid w-full max-w-xs grid-cols-2 gap-6">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-fg-muted">
            {section.title}
          </span>
          {section.links.map((label) => (
            <Link key={label} href="#" variant="quiet" className="text-sm">
              {label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}
