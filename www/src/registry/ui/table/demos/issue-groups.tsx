'use client'

import {
  AlertTriangleIcon,
  AppWindowIcon,
  CircleDotDashedIcon,
  ImageIcon,
  MailIcon,
  SearchIcon,
  SignalIcon,
  WifiIcon,
  ZapIcon,
  type LucideIcon,
} from 'lucide-react'

import { Badge } from '@/registry/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from '@/registry/ui/table'

type Issue = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  iconClassName: string
}

type IssueGroup = {
  id: string
  name: string
  count: number
  markerClassName: string
  issues: Issue[]
}

const issueGroups: IssueGroup[] = [
  {
    id: 'todo',
    name: 'To-do',
    count: 4,
    markerClassName: 'text-fg-muted',
    issues: [
      {
        id: 'ISS-1',
        title: 'Signup flow broken on mobile devices',
        description:
          'Users on iOS and Android devices cannot complete account creation from the hosted form.',
        icon: SignalIcon,
        iconClassName:
          'bg-sky-100 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300',
      },
      {
        id: 'ISS-2',
        title: 'Stripe payment failures in Brazil',
        description:
          'Customers in Brazil are seeing card declines during subscription renewals.',
        icon: ZapIcon,
        iconClassName:
          'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-400/20 dark:text-fuchsia-300',
      },
      {
        id: 'ISS-3',
        title: 'Dashboard not loading for enterprise customers',
        description:
          'Enterprise tier customers are seeing a blank dashboard after switching organizations.',
        icon: ZapIcon,
        iconClassName:
          'bg-amber-100 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300',
      },
      {
        id: 'ISS-12',
        title: 'Email notifications not being delivered',
        description:
          'Transactional emails including invites and receipts are delayed for some workspaces.',
        icon: WifiIcon,
        iconClassName:
          'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/20 dark:text-cyan-300',
      },
    ],
  },
  {
    id: 'in-progress',
    name: 'In progress',
    count: 3,
    markerClassName: 'text-info',
    issues: [
      {
        id: 'ISS-4',
        title: 'Search functionality returning incorrect results',
        description:
          'The global search feature is returning stale records after index refreshes.',
        icon: SearchIcon,
        iconClassName:
          'bg-pink-100 text-pink-600 dark:bg-pink-400/20 dark:text-pink-300',
      },
      {
        id: 'ISS-5',
        title: 'Profile images not displaying correctly',
        description:
          'User profile images are appearing as initials after a recent media migration.',
        icon: SignalIcon,
        iconClassName:
          'bg-sky-100 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300',
      },
      {
        id: 'ISS-13',
        title: 'Application crashes on specific user actions',
        description:
          'Users are experiencing application crashes when opening archived projects.',
        icon: AlertTriangleIcon,
        iconClassName:
          'bg-rose-100 text-rose-600 dark:bg-rose-400/20 dark:text-rose-300',
      },
    ],
  },
  {
    id: 'attention-required',
    name: 'Attention required',
    count: 3,
    markerClassName: 'text-danger',
    issues: [
      {
        id: 'ISS-6',
        title: 'Data export timing out for large workspaces',
        description:
          'CSV exports for larger teams fail after sixty seconds and need background processing.',
        icon: ImageIcon,
        iconClassName:
          'bg-indigo-100 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-300',
      },
      {
        id: 'ISS-7',
        title: 'Webhook retries saturating delivery queue',
        description:
          'Failed webhook deliveries are retrying too aggressively during provider incidents.',
        icon: AppWindowIcon,
        iconClassName:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300',
      },
      {
        id: 'ISS-8',
        title: 'SSO login loop after session refresh',
        description:
          'Some SAML users are redirected back to sign in after a successful identity handshake.',
        icon: MailIcon,
        iconClassName:
          'bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300',
      },
    ],
  },
]

const defaultExpandedKeys = issueGroups.map((group) => group.id)

export default function Demo() {
  return (
    <TableContainer className="max-h-[440px]">
      <Table
        aria-label="Issue inbox"
        treeColumn="issue"
        selectionMode="multiple"
        defaultExpandedKeys={defaultExpandedKeys}
      >
        <TableHeader>
          <TableColumn id="issue" isRowHeader>
            Issue
          </TableColumn>
          <TableColumn id="description">Description</TableColumn>
        </TableHeader>
        <TableBody>
          {issueGroups.map((group) => (
            <TableRow
              key={group.id}
              id={group.id}
              className="bg-muted/25 hover:bg-muted/35"
            >
              <TableCell className="font-medium">
                <span className="inline-flex min-w-0 items-center gap-2">
                  <CircleDotDashedIcon
                    aria-hidden
                    className={`size-3.5 shrink-0 ${group.markerClassName}`}
                  />
                  <span className="truncate text-fg-muted uppercase">
                    {group.name}
                  </span>
                  <Badge
                    appearance="subtle"
                    variant="neutral"
                    size="sm"
                    className="rounded-sm"
                  >
                    {group.count}
                  </Badge>
                </span>
              </TableCell>
              <TableCell />
              {group.issues.map((issue) => {
                const Icon = issue.icon

                return (
                  <TableRow key={issue.id} id={issue.id}>
                    <TableCell>
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="w-14 shrink-0 text-fg-muted">
                          {issue.id}
                        </span>
                        <span
                          className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ${issue.iconClassName}`}
                        >
                          <Icon aria-hidden className="size-4" />
                        </span>
                        <span className="truncate font-medium text-fg">
                          {issue.title}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[28rem] text-fg-muted">
                      <span className="block truncate">
                        {issue.description}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
