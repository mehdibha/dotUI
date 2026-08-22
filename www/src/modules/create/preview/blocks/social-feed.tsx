"use client"

import { useState } from "react"

import {
  BadgeCheckIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  ChartBarIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  LinkIcon,
  LogOutIcon,
  MailIcon,
  MapIcon,
  MessageSquareIcon,
  MoreHorizontalIcon,
  RefreshCwIcon,
  SettingsIcon,
  ShareIcon,
  SmileIcon,
  SparklesIcon,
  TrendingUpIcon,
  UserIcon,
  Users2Icon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Group } from "@/registry/ui/group"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import { Tab, TabList, TabPanel, Tabs } from "@/registry/ui/tabs"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

const MAX_LENGTH = 280

interface Author {
  name: string
  handle: string
  verified?: boolean
}

interface Post {
  id: string
  author: Author
  time: string
  body: string
  tags?: string[]
  media?: { caption: string; meta: string }
  link?: { title: string; domain: string; description: string }
  replies: number
  reposts: number
  likes: number
  following?: boolean
}

const VIEWER: Author = { name: "Mehdi Ben Hadj Ali", handle: "mehdibha" }

const POSTS: Post[] = [
  {
    id: "p1",
    author: { name: "Rachel Okafor", handle: "rachelok", verified: true },
    time: "12m",
    body: "Rewrote our query planner over the weekend. Median dashboard load went from 840ms to 190ms, and the p99 finally fits under a second. Turns out 70% of the time was spent re-parsing the same six filters on every request.",
    tags: ["#postgres", "#performance"],
    replies: 48,
    reposts: 126,
    likes: 1842,
    following: true,
  },
  {
    id: "p2",
    author: { name: "Daniel Sato", handle: "dsato" },
    time: "48m",
    body: "Third pass at the settings redesign. Everything is one column now, the danger zone lives at the bottom, and every control states what it changes before you touch it. Feedback welcome — especially on the billing step.",
    media: { caption: "settings-v3.png", meta: "2400 × 1350" },
    replies: 92,
    reposts: 54,
    likes: 731,
    following: true,
  },
  {
    id: "p3",
    author: { name: "Priya Raghavan", handle: "priyacodes", verified: true },
    time: "2h",
    body: "Wrote up everything we learned migrating 340 services off the shared session store. Six weeks, two rollbacks, one very long Thursday.",
    link: {
      title: "Killing the shared session store",
      domain: "eng.northwind.dev",
      description:
        "How we moved 340 services to stateless tokens without a maintenance window.",
    },
    replies: 37,
    reposts: 218,
    likes: 2960,
  },
  {
    id: "p4",
    author: { name: "Marcus Lindqvist", handle: "mlindqvist" },
    time: "4h",
    body: "Unpopular opinion: most design systems don't fail on components. They fail because nobody agreed on what 'muted' means, so twelve teams each picked a different grey and shipped it.",
    replies: 214,
    reposts: 89,
    likes: 3410,
    following: true,
  },
  {
    id: "p5",
    author: { name: "Elena Vasquez", handle: "elenav", verified: true },
    time: "6h",
    body: "Spent the morning reading the WebGPU spec instead of answering email and I regret nothing. The compute shader story is so much cleaner than I expected.",
    tags: ["#webgpu", "#graphics"],
    replies: 26,
    reposts: 41,
    likes: 612,
  },
]

const TRENDS: {
  id: string
  category: string
  topic: string
  posts: string
}[] = [
  {
    id: "t1",
    category: "Engineering · Trending",
    topic: "TypeScript 6.0",
    posts: "24.1K posts",
  },
  {
    id: "t2",
    category: "Design",
    topic: "Variable fonts",
    posts: "8,942 posts",
  },
  {
    id: "t3",
    category: "Technology · Trending",
    topic: "WebGPU",
    posts: "12.6K posts",
  },
  {
    id: "t4",
    category: "Open source",
    topic: "#OSSWeek",
    posts: "5,317 posts",
  },
  {
    id: "t5",
    category: "Databases",
    topic: "Postgres 19 beta",
    posts: "3,204 posts",
  },
]

const SUGGESTIONS: (Author & { bio: string })[] = [
  {
    name: "Nadia Chen",
    handle: "nadiabuilds",
    verified: true,
    bio: "Infrastructure at Fathom. Writes about Postgres.",
  },
  {
    name: "Tobias Grant",
    handle: "tobiasg",
    bio: "Design engineer. Shipping in public.",
  },
  {
    name: "Amara Osei",
    handle: "amaraosei",
    bio: "Rust, compilers and far too much coffee.",
  },
]

const NAV: {
  id: string
  label: string
  icon: typeof HomeIcon
  count?: number
}[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "explore", label: "Explore", icon: GlobeIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon, count: 12 },
  { id: "messages", label: "Messages", icon: MailIcon, count: 3 },
  { id: "bookmarks", label: "Bookmarks", icon: BookmarkIcon },
  { id: "communities", label: "Communities", icon: Users2Icon },
  { id: "profile", label: "Profile", icon: UserIcon },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function formatCount(value: number) {
  if (value < 1000) return `${value}`
  return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`
}

/* -------------------------------- Chrome --------------------------------- */

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-fg-on-primary">
            <SparklesIcon className="size-4" />
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Orbit
          </span>
        </div>

        <SearchField
          aria-label="Search Orbit"
          className="ml-auto hidden max-w-xs flex-1 sm:block"
        >
          <Input placeholder="Search posts and people" />
        </SearchField>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Tooltip>
            <Button variant="quiet" isIconOnly aria-label="Notifications">
              <BellIcon />
            </Button>
            <TooltipContent>12 new notifications</TooltipContent>
          </Tooltip>
          <Menu>
            <Button
              variant="quiet"
              isIconOnly
              aria-label="Account"
              className="rounded-full"
            >
              <Avatar size="sm">
                <AvatarFallback>{initials(VIEWER.name)}</AvatarFallback>
                <AvatarBadge />
              </Avatar>
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>
                  <UserIcon />
                  Profile
                </MenuItem>
                <MenuItem>
                  <BookmarkIcon />
                  Bookmarks
                </MenuItem>
                <MenuItem>
                  <SettingsIcon />
                  Settings and privacy
                </MenuItem>
                <Separator />
                <MenuItem variant="danger">
                  <LogOutIcon />
                  Log out @{VIEWER.handle}
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
      </div>
    </header>
  )
}

function NavRail() {
  const [selected, setSelected] = useState("home")
  return (
    <nav className="sticky top-20 hidden h-fit flex-col gap-4 lg:flex">
      <ListBox
        aria-label="Primary"
        selectionMode="single"
        selectedKeys={[selected]}
        onSelectionChange={(keys) => {
          const [first] = [...keys]
          if (typeof first === "string") setSelected(first)
        }}
        className="p-0 **:data-listbox-item:py-2"
      >
        {NAV.map((item) => (
          <ListBoxItem key={item.id} id={item.id} textValue={item.label}>
            <item.icon />
            {item.label}
            {item.count ? (
              <Badge size="sm" className="ml-auto">
                {item.count}
              </Badge>
            ) : null}
          </ListBoxItem>
        ))}
      </ListBox>
      <Button variant="primary" className="w-full">
        New post
      </Button>
    </nav>
  )
}

/* -------------------------------- Composer -------------------------------- */

const COMPOSER_TOOLS: { label: string; icon: typeof ImageIcon }[] = [
  { label: "Add image", icon: ImageIcon },
  { label: "Add emoji", icon: SmileIcon },
  { label: "Create poll", icon: ChartBarIcon },
  { label: "Schedule post", icon: CalendarIcon },
  { label: "Tag location", icon: MapIcon },
]

function Composer({ onPost }: { onPost: (body: string) => void }) {
  const [body, setBody] = useState("")
  const trimmed = body.trim()
  const isTooLong = body.length > MAX_LENGTH
  const remaining = MAX_LENGTH - body.length

  return (
    <Card>
      <CardContent className="flex gap-3">
        <Avatar size="lg" className="mt-1 shrink-0">
          <AvatarFallback>{initials(VIEWER.name)}</AvatarFallback>
        </Avatar>
        <TextField
          aria-label="Compose a new post"
          value={body}
          onChange={setBody}
          isInvalid={isTooLong}
          className="min-w-0 flex-1"
        >
          <InputGroup>
            <TextArea placeholder="What's happening?" rows={2} />
            <InputGroupAddon>
              <Group className="w-full justify-between gap-2">
                <div className="flex items-center">
                  {COMPOSER_TOOLS.map((tool) => (
                    <Tooltip key={tool.label}>
                      <Button
                        variant="quiet"
                        size="sm"
                        isIconOnly
                        aria-label={tool.label}
                      >
                        <tool.icon />
                      </Button>
                      <TooltipContent>{tool.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      aria-label="Characters used"
                      value={Math.min(body.length, MAX_LENGTH)}
                      maxValue={MAX_LENGTH}
                      className="w-10"
                    >
                      <ProgressBarControl />
                    </ProgressBar>
                    <span
                      className={cn(
                        "w-8 text-right text-xs tabular-nums",
                        isTooLong ? "text-fg-danger" : "text-fg-muted",
                      )}
                    >
                      {remaining}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    isDisabled={trimmed.length === 0 || isTooLong}
                    onPress={() => {
                      onPost(trimmed)
                      setBody("")
                    }}
                  >
                    Post
                  </Button>
                </div>
              </Group>
            </InputGroupAddon>
          </InputGroup>
        </TextField>
      </CardContent>
    </Card>
  )
}

/* ---------------------------------- Feed ---------------------------------- */

function AuthorLine({ author, time }: { author: Author; time: string }) {
  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-sm">
      <span className="truncate font-medium">{author.name}</span>
      {author.verified && (
        <BadgeCheckIcon className="size-3.5 shrink-0 translate-y-0.5 text-fg-accent" />
      )}
      <span className="truncate text-fg-muted">@{author.handle}</span>
      <span className="text-fg-muted">·</span>
      <span className="shrink-0 text-fg-muted">{time}</span>
    </div>
  )
}

function ReplyDialog({ post }: { post: Post }) {
  const [reply, setReply] = useState("")
  return (
    <Dialog>
      <Button variant="quiet" size="sm" className="gap-1.5 px-2 text-fg-muted">
        <MessageSquareIcon />
        <span className="tabular-nums">{formatCount(post.replies)}</span>
      </Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to @{post.author.handle}</DialogTitle>
          </DialogHeader>
          <DialogBody className="gap-4">
            <div className="flex gap-3 rounded-lg border bg-muted p-3">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <AuthorLine author={post.author} time={post.time} />
                <p className="mt-1 line-clamp-3 text-sm text-fg-muted">
                  {post.body}
                </p>
              </div>
            </div>
            <TextField
              aria-label="Your reply"
              value={reply}
              onChange={setReply}
              autoFocus
            >
              <TextArea placeholder="Post your reply" rows={3} />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button
              slot="close"
              variant="primary"
              isDisabled={reply.trim().length === 0}
            >
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false)
  const [reposted, setReposted] = useState(false)

  return (
    <Card>
      <CardContent className="flex gap-3">
        <Avatar size="lg" className="shrink-0">
          <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <AuthorLine author={post.author} time={post.time} />
            <Menu>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label={`More on the post from ${post.author.name}`}
                className="-mt-1 -mr-1 shrink-0"
              >
                <MoreHorizontalIcon />
              </Button>
              <Popover>
                <MenuContent>
                  <MenuItem>
                    <LinkIcon />
                    Copy link to post
                  </MenuItem>
                  <MenuItem>
                    <BookmarkIcon />
                    Add to bookmarks
                  </MenuItem>
                  <MenuItem>
                    <UserIcon />
                    Follow @{post.author.handle}
                  </MenuItem>
                  <Separator />
                  <MenuItem variant="danger">
                    <BellIcon />
                    Mute this conversation
                  </MenuItem>
                </MenuContent>
              </Popover>
            </Menu>
          </div>

          <p className="text-sm/relaxed text-pretty">{post.body}</p>

          {post.tags && (
            <div className="flex flex-wrap gap-x-2 text-sm text-fg-accent">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {post.media && (
            <div className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border bg-muted text-fg-muted">
              <ImageIcon className="size-6" />
              <span className="text-xs">{post.media.caption}</span>
              <span className="text-xs opacity-70">{post.media.meta}</span>
            </div>
          )}

          {post.link && (
            <div className="overflow-hidden rounded-xl border">
              <div className="flex h-24 items-center justify-center bg-muted text-fg-muted">
                <LinkIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-1 border-t p-3">
                <span className="text-xs text-fg-muted">
                  {post.link.domain}
                </span>
                <span className="text-sm font-medium">{post.link.title}</span>
                <span className="text-xs text-fg-muted">
                  {post.link.description}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1">
            <ReplyDialog post={post} />

            <ToggleButton
              variant="quiet"
              size="sm"
              isSelected={reposted}
              onChange={setReposted}
              aria-label="Repost"
              className={cn(
                "gap-1.5 px-2",
                reposted ? "text-fg-success" : "text-fg-muted",
              )}
            >
              <RefreshCwIcon />
              <span className="tabular-nums">
                {formatCount(post.reposts + (reposted ? 1 : 0))}
              </span>
            </ToggleButton>

            <ToggleButton
              variant="quiet"
              size="sm"
              isSelected={liked}
              onChange={setLiked}
              aria-label="Like"
              className={cn(
                "gap-1.5 px-2",
                liked ? "text-fg-danger" : "text-fg-muted",
              )}
            >
              <HeartIcon className={cn(liked && "fill-current")} />
              <span className="tabular-nums">
                {formatCount(post.likes + (liked ? 1 : 0))}
              </span>
            </ToggleButton>

            <div className="ml-auto flex items-center">
              <Tooltip>
                <ToggleButton
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Bookmark"
                  className="text-fg-muted"
                >
                  <BookmarkIcon />
                </ToggleButton>
                <TooltipContent>Save for later</TooltipContent>
              </Tooltip>
              <Menu>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Share"
                  className="text-fg-muted"
                >
                  <ShareIcon />
                </Button>
                <Popover>
                  <MenuContent>
                    <MenuItem>
                      <LinkIcon />
                      Copy link
                    </MenuItem>
                    <MenuItem>
                      <MailIcon />
                      Send via message
                    </MenuItem>
                    <MenuItem>
                      <ChartBarIcon />
                      View post analytics
                    </MenuItem>
                  </MenuContent>
                </Popover>
              </Menu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Feed({ posts }: { posts: Post[] }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <Button variant="quiet" className="w-full text-fg-muted">
        Load older posts
      </Button>
    </div>
  )
}

/* -------------------------------- Right rail ------------------------------ */

function TrendsCard() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="size-4 text-fg-muted" />
          Trending now
        </CardTitle>
        <CardAction>
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Trend settings"
            >
              <MoreHorizontalIcon />
            </Button>
            <Popover>
              <MenuContent>
                <MenuItem>
                  <SettingsIcon />
                  Tune your trends
                </MenuItem>
                <MenuItem>
                  <GlobeIcon />
                  Change location
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2">
        <ListBox aria-label="Trending topics" className="p-0">
          {TRENDS.map((trend) => (
            <ListBoxItem key={trend.id} id={trend.id} textValue={trend.topic}>
              <ListBoxItemLabel className="text-sm font-medium">
                {trend.topic}
              </ListBoxItemLabel>
              <ListBoxItemDescription className="text-xs">
                {trend.category} · {trend.posts}
              </ListBoxItemDescription>
            </ListBoxItem>
          ))}
        </ListBox>
      </CardContent>
      <CardFooter>
        <Button variant="link" size="sm" className="px-0">
          Show more
        </Button>
      </CardFooter>
    </Card>
  )
}

function FollowRow({ person }: { person: Author & { bio: string } }) {
  const [following, setFollowing] = useState(false)
  return (
    <div className="flex items-start gap-3">
      <Avatar className="shrink-0">
        <AvatarFallback>{initials(person.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span className="truncate text-sm font-medium">{person.name}</span>
          {person.verified && (
            <BadgeCheckIcon className="size-3.5 shrink-0 text-fg-accent" />
          )}
        </div>
        <span className="block truncate text-xs text-fg-muted">
          @{person.handle}
        </span>
        <p className="mt-1 text-xs text-fg-muted">{person.bio}</p>
      </div>
      <ToggleButton
        size="sm"
        variant={following ? "secondary" : "primary"}
        isSelected={following}
        onChange={setFollowing}
        className="shrink-0"
      >
        {following ? "Following" : "Follow"}
      </ToggleButton>
    </div>
  )
}

function WhoToFollowCard() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users2Icon className="size-4 text-fg-muted" />
          Who to follow
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {SUGGESTIONS.map((person) => (
          <FollowRow key={person.handle} person={person} />
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="link" size="sm" className="px-0">
          Show more suggestions
        </Button>
      </CardFooter>
    </Card>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function SocialFeed() {
  const [posts, setPosts] = useState(POSTS)

  const addPost = (body: string) => {
    setPosts((current) => [
      {
        id: `own-${current.length}`,
        author: VIEWER,
        time: "now",
        body,
        replies: 0,
        reposts: 0,
        likes: 0,
        following: true,
      },
      ...current,
    ])
  }

  const following = posts.filter((post) => post.following)

  return (
    <div className="min-h-screen bg-bg text-fg">
      <TopBar />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 px-4 py-6 sm:px-6 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-[13rem_minmax(0,1fr)_19rem]">
        <NavRail />

        <main className="flex min-w-0 flex-col gap-4">
          <Composer onPost={addPost} />

          <Tabs>
            <TabList variant="line">
              <Tab id="for-you">For you</Tab>
              <Tab id="following">Following</Tab>
              <Tab id="mentions">Mentions</Tab>
            </TabList>
            <TabPanel id="for-you" className="pt-4">
              <Feed posts={posts} />
            </TabPanel>
            <TabPanel id="following" className="pt-4">
              <Feed posts={following} />
            </TabPanel>
            <TabPanel id="mentions" className="pt-4">
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageSquareIcon />
                  </EmptyMedia>
                  <EmptyTitle>No mentions yet</EmptyTitle>
                  <EmptyDescription>
                    When someone mentions @{VIEWER.handle}, their post shows up
                    here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TabPanel>
          </Tabs>
        </main>

        <aside className="flex min-w-0 flex-col gap-4">
          <TrendsCard />
          <WhoToFollowCard />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs text-fg-muted">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
            <span>Accessibility</span>
            <Badge size="sm" appearance="subtle">
              v2.4
            </Badge>
          </div>
        </aside>
      </div>
    </div>
  )
}
