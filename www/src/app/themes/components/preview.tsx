"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  FileIcon,
  FolderIcon,
  HexagonIcon,
  HomeIcon,
  PinIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { GitHubIcon, TwitterIcon } from "@/components/icons";
import { GoogleIcon } from "@/components/icons/google-icon";
import { ThemeOverride } from "@/components/theme-override";
import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";
import { Progress } from "@/registry/ui/default/core/progress";
import { Switch } from "@/registry/ui/default/core/switch";
import { Tabs, TabList, Tab, TabPanel } from "@/registry/ui/default/core/tabs";
import { TextField } from "@/registry/ui/default/core/text-field";
import { ToggleButton } from "@/registry/ui/default/core/toggle-button";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import * as icons from "@/__icons__";
import { usePreview } from "./context";

const MotionTabPanel = motion.create(TabPanel);
const MotionTabs = motion.create(Tabs);
const MotionTabList = motion.create(TabList);
const MotionTab = motion.create(Tab);
const MotionThemeOverride = motion.create(ThemeOverride);

const MotionButton = motion.create(Button);
const MotionToggleButton = motion.create(ToggleButton);
const MotionAlert = motion.create(Alert);

export const Preview = () => {
  const { preview } = usePreview();
  const [selectedTab, setSelectedTab] = React.useState("dashboard");

  return (
    <MotionTabs
      layout
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(key as string)}
      className={cn(
        "bg-bg overflow-hidden rounded-lg border",
        !preview && "w-full"
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-2">
        <MotionTabList className="!border-0">
          <MotionTab layout id="dashboard">
            Dashboard
          </MotionTab>
          <MotionTab layout id="landing">
            Landing
          </MotionTab>
          <MotionTab layout id="login">
            Login
          </MotionTab>
        </MotionTabList>
        <Switch className="flex-row-reverse" size="sm">
          Dynamic
        </Switch>
      </div>
      <MotionThemeOverride layout className="h-full">
        {preview ? (
          <DynamicPreview />
        ) : (
          <>
            {selectedTab === "landing" && (
              <MotionTabPanel
                id="landing"
                layout
                shouldForceMount
                className="h-[600px]"
              >
                <Landing />
              </MotionTabPanel>
            )}
            {selectedTab === "dashboard" && (
              <MotionTabPanel
                id="dashboard"
                layout
                shouldForceMount
                className="h-[600px]"
              >
                <Dashboard />
              </MotionTabPanel>
            )}
            {selectedTab === "login" && (
              <MotionTabPanel
                id="login"
                layout
                shouldForceMount
                className="h-[600px]"
              >
                <Login />
              </MotionTabPanel>
            )}
          </>
        )}
      </MotionThemeOverride>
    </MotionTabs>
  );
};

const DynamicPreview = () => {
  const { preview } = usePreview();
  return (
    <motion.div layout>
      <div className="h-full p-6">
        {preview === "color-neutral" && (
          <ColorPreview color="neutral" showBackground />
        )}
        {preview === "color-success" && <ColorPreview color="success" />}
        {preview === "color-warning" && <ColorPreview color="warning" />}
        {preview === "color-danger" && <ColorPreview color="danger" />}
        {preview === "color-accent" && <ColorPreview color="accent" />}
        {preview === "typography" && (
          <motion.div className="max-w-sm">
            <motion.p layout className="font-heading text-4xl font-bold">
              Heading
            </motion.p>
            <motion.p layout className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </motion.p>
          </motion.div>
        )}
        {preview === "icons" && (
          <motion.div className="grid grid-cols-8 gap-4">
            {Object.entries(icons).map(([key, Icon]) => {
              const MotionIcon = motion.create(Icon);
              return (
                <MotionIcon key={`icon-${key}`} layout className="size-5" />
              );
            })}
          </motion.div>
        )}
        {preview === "borders" && (
          <motion.div>
            <div className="grid grid-cols-4 gap-2">
              {["sm", "", "md", "lg"].map((size) => (
                <motion.div
                  layout
                  key={size}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={cn("border-fg size-16 border-l-2 border-t-2", {
                      "rounded-tl-sm": size === "sm",
                      "rounded-tl": size === "",
                      "rounded-tl-md": size === "md",
                      "rounded-tl-lg": size === "lg",
                    })}
                  />
                  <p className="text-fg-muted text-sm">
                    rounded{size ? `-${size}` : ""}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <MotionButton layoutId="button-default">Button</MotionButton>
              <MotionToggleButton layoutId="toggle-default" defaultSelected>
                <PinIcon />
              </MotionToggleButton>
              <TextField placeholder="example@domain.com" />
            </div>
            <Alert fill className="mt-4">
              This is an important message!
            </Alert>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Landing = () => {
  return (
    <div>
      <header className="flex h-14 items-center justify-between px-4">
        <div className="font-heading text-lg font-bold">Acme</div>
        <nav className="flex gap-2">
          <Button variant="quiet" size="sm">
            Products
          </Button>
          <Button variant="quiet" size="sm">
            About
          </Button>
          <Button variant="quiet" size="sm">
            Contact
          </Button>
          <Button variant="accent" size="sm">
            Sign Up
          </Button>
        </nav>
      </header>
      <div className="container mt-16 max-w-xl">
        <p className="font-heading text-balance text-3xl font-bold leading-tight">
          Transform your workflow with our platform
        </p>
        <p className="text-fg-muted mt-4 text-balance">
          Streamline your process, boost productivity, and achieve better
          results with our comprehensive suite of tools.
        </p>
        <div className="mt-8 flex gap-4">
          <Button variant="accent" size="lg">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="grid h-full grid-cols-[60px_1fr] items-start">
      <div className="flex h-full flex-col items-center border-r py-4">
        <HexagonIcon />
        <Tooltip content="Search" placement="right" delay={0}>
          <Button shape="square" variant="outline" className="mt-5">
            <SearchIcon />
          </Button>
        </Tooltip>
        <div className="mt-2 flex flex-col gap-2">
          {[
            { icon: <HomeIcon />, label: "Overview" },
            { icon: <UsersIcon />, label: "Team" },
            { icon: <FolderIcon />, label: "Projects" },
            { icon: <CalendarIcon />, label: "Calendar" },
            { icon: <FileIcon />, label: "Documents" },
            { icon: <SettingsIcon />, label: "Settings" },
          ].map(({ icon, label }, index) => (
            <Tooltip key={index} content={label} placement="right" delay={0}>
              <Button shape="square" variant="quiet">
                {icon}
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 p-8">
        <div className="bg-bg-muted col-span-5 rounded-lg p-4">
          <h3 className="text-fg-muted text-sm">Total net worth</h3>
          <p className="text-3xl font-bold">
            $234,567<span className="text-fg-muted text-sm">USD</span>
          </p>
          <p className="text-fg-muted text-sm">≈ 87.578 BTC</p>
        </div>
        <div className="col-span-7 grid grid-cols-2 gap-4 rounded-lg">
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Profits</h3>
            <p className="text-xl font-bold">
              $31,255<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Expenses</h3>
            <p className="text-xl font-bold">
              $12,389<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Net worth</h3>
            <p className="text-xl font-bold">
              $18,866<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
          <div className="bg-bg-muted rounded-lg p-4">
            <h3 className="text-fg-muted text-sm">Profit margin</h3>
            <p className="text-xl font-bold">
              12.5%<span className="text-fg-muted text-sm">USD</span>
            </p>
          </div>
        </div>
        {/* <div className="bg-bg-muted col-span-4 rounded-lg" />
        <div className="bg-bg-muted col-span-12 rounded-lg" /> */}
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-bg-muted max-w-sm rounded-lg border p-8">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Login
        </h1>
        <p className="text-fg-muted mt-2 text-sm">
          Enter your email below to login to your account
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button className="flex-1">
            <GoogleIcon />
          </Button>
          <Button className="flex-1">
            <TwitterIcon />
          </Button>
          <Button className="flex-1">
            <GitHubIcon />
          </Button>
        </div>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">Or</span>
          </div>
        </div>
        <TextField label="Email address" className="w-full" />
        <Button variant="primary" className="mt-4 w-full">
          Continue with email
        </Button>
      </div>
    </div>
  );
};

const AIChat = () => {
  return <div>AiChat</div>;
};

const ColorPreview = ({
  color,
  showBackground,
}: {
  color: "neutral" | "success" | "warning" | "danger" | "accent";
  showBackground?: boolean;
}) => {
  return (
    <motion.div>
      {showBackground && (
        <div className="bg-bg flex h-[300px] w-[400px] flex-row border xl:w-[500px]">
          <div className="flex h-[50%] items-center justify-center border-r md:h-[100%] md:w-[50%]">
            <div className="bg-bg relative flex size-32 items-center justify-center rounded-[12px] border">
              <div className="bg-bg-muted text-fg-muted flex size-6 items-center justify-center rounded-full text-xs">
                1
              </div>
              <div className="bg-bg-muted text-fg-muted absolute -bottom-10 flex size-6 items-center justify-center rounded-full text-xs">
                2
              </div>
            </div>
          </div>
          <div className="bg-bg-muted flex h-[50%] items-center justify-center border-r border-t md:h-[100%] md:w-[50%] md:border-none">
            <div className="bg-bg relative flex size-32 items-center justify-center rounded-[12px] border">
              <div className="bg-bg-muted text-fg-muted flex size-6 items-center justify-center rounded-full text-xs">
                1
              </div>
              <div className="bg-bg text-fg-muted absolute -bottom-10 flex size-6 items-center justify-center rounded-full text-xs">
                2
              </div>
            </div>
          </div>
        </div>
      )}
      <motion.div
        layoutId="color-preview-buttons"
        className={cn(
          "flex flex-wrap items-center gap-2",
          showBackground && "mt-6"
        )}
      >
        <MotionButton variant="default" layoutId="button-default">
          default
        </MotionButton>
        {color === "neutral" ? (
          <MotionButton variant="primary" layoutId="button-primary">
            primary
          </MotionButton>
        ) : (
          <MotionButton variant={color} layoutId="button-primary">
            primary
          </MotionButton>
        )}
        <MotionButton variant="outline" layoutId="button-outline">
          outline
        </MotionButton>
        <MotionButton variant="quiet" layoutId="button-quiet">
          quiet
        </MotionButton>
        {color === "neutral" && (
          <>
            <MotionToggleButton
              variant="quiet"
              defaultSelected
              layoutId="toggle-quiet"
            >
              <PinIcon />
            </MotionToggleButton>
            <MotionToggleButton variant="outline" layoutId="toggle-outline">
              <PinIcon />
            </MotionToggleButton>
          </>
        )}
      </motion.div>
      <div className="mt-6">
        <MotionAlert
          fill
          layoutId="color-preview-alert"
          variant={
            color === "neutral"
              ? "default"
              : color === "accent"
                ? "info"
                : color
          }
        >
          This is an important message!
        </MotionAlert>
      </div>
      {color === "neutral" && (
        <div className="mt-6">
          <Progress value={50} className="w-full" variant="default" />
        </div>
      )}
      {color === "accent" && (
        <>
          <div className="mt-6 flex items-center gap-4">
            <Switch defaultSelected>Focus mode</Switch>
            <TextField placeholder="hello@mehdibha.com" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Progress value={50} className="w-full" variant="accent" />
          </div>
        </>
      )}
      {color === "danger" && (
        <div className="mt-6 flex items-center gap-4">
          <TextField
            label="Email"
            isInvalid
            errorMessage="This email is already taken."
          />
        </div>
      )}
    </motion.div>
  );
};
