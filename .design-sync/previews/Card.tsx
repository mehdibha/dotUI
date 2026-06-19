import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TextField,
} from 'www'

const wrap: React.CSSProperties = { width: '100%', maxWidth: 360 }

export const Default = () => (
  <Card style={wrap}>
    <CardHeader>
      <CardTitle>Project settings</CardTitle>
      <CardDescription>Manage the configuration for this workspace.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        The card component provides a simple container with header, content, and footer
        sections that adapt to your design system.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="default" style={{ width: '100%' }}>
        Save changes
      </Button>
    </CardFooter>
  </Card>
)

export const Login = () => (
  <Card style={wrap}>
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email below to login to your account.</CardDescription>
      <CardAction>
        <Button variant="link">Sign Up</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TextField style={{ width: '100%' }}>
          <Label>Email</Label>
          <Input type="email" placeholder="m@example.com" />
        </TextField>
        <TextField style={{ width: '100%' }}>
          <Label>Password</Label>
          <Input type="password" />
        </TextField>
      </div>
    </CardContent>
    <CardFooter style={{ flexDirection: 'column', gap: 8 }}>
      <Button variant="primary" style={{ width: '100%' }}>
        Login
      </Button>
      <Button variant="default" style={{ width: '100%' }}>
        Login with Google
      </Button>
    </CardFooter>
  </Card>
)

export const WithImage = () => (
  <Card style={wrap}>
    <img
      src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop"
      alt="Mountain landscape"
      style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }}
    />
    <CardHeader>
      <CardTitle>Beautiful Landscape</CardTitle>
      <CardDescription>A stunning view that captures the essence of natural beauty.</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="primary" style={{ width: '100%' }}>
        View details
      </Button>
    </CardFooter>
  </Card>
)
