export const iconLibraries: {
  name: string;
  label: string;
  dependency: string;
  import: string;
}[] = [
  {
    name: "lucide",
    label: "Lucide icons",
    dependency: "lucide-react",
    import: "lucide-react",
  },
  {
    name: "remix",
    label: "Remix icons",
    dependency: "@remixicon/react",
    import: "@remixicon/react",
  },
] as const;

type Icons = {
  [key: string]: {
    lucide: string;
    remix: string;
  };
};

export const icons: Icons = {
  LoaderIcon: {
    lucide: "Loader2Icon",
    remix: "RiLoader4Line",
  },
  DangerIcon: {
    lucide: "AlertCircleIcon",
    remix: "RiErrorWarningFill",
  },
  WarningIcon: {
    lucide: "AlertTriangleIcon",
    remix: "RiAlertLine",
  },
  SuccessIcon: {
    lucide: "CheckCircle2Icon",
    remix: "RiCheckboxCircleLine",
  },
  InfoIcon: {
    lucide: "InfoIcon",
    remix: "RiInformationLine",
  },
  ChevronRightIcon: {
    lucide: "ChevronRightIcon",
    remix: "RiArrowRightSLine",
  },
  ChevronLeftIcon: {
    lucide: "ChevronLeftIcon",
    remix: "RiArrowLeftSLine",
  },
  ChevronDownIcon: {
    lucide: "ChevronDownIcon",
    remix: "RiArrowDownSLine",
  },
  ChevronUpIcon: {
    lucide: "ChevronUpIcon",
    remix: "RiArrowUpSLine",
  },
  SearchIcon: {
    lucide: "SearchIcon",
    remix: "RiSearchLine",
  },
  HelpIcon: {
    lucide: "HelpCircleIcon",
    remix: "RiQuestionLine",
  },
  CalendarIcon: {
    lucide: "CalendarIcon",
    remix: "RiCalendarLine",
  },
  XIcon: {
    lucide: "XIcon",
    remix: "RiCloseLine",
  },
  AsteriskIcon: {
    lucide: "AsteriskIcon",
    remix: "RiAsterisk",
  },
  CheckIcon: {
    lucide: "CheckIcon",
    remix: "RiCheckLine",
  },
  MinusIcon: {
    lucide: "MinusIcon",
    remix: "RiSubtractLine",
  },
  PlusIcon: {
    lucide: "PlusIcon",
    remix: "RiAddLine",
  },
  WalletIcon: {
    lucide: "WalletIcon",
    remix: "RiWalletLine",
  },
  GlobeIcon: {
    lucide: "GlobeIcon",
    remix: "RiGlobalLine",
  },
  UserIcon: {
    lucide: "User2Icon",
    remix: "RiUserLine",
  },
  ShieldIcon: {
    lucide: "ShieldIcon",
    remix: "RiShieldLine",
  },
  ChevronRightCircleIcon: {
    lucide: "ArrowRightCircleIcon",
    remix: "RiArrowRightCircleLine",
  },
  HomeIcon: {
    lucide: "HomeIcon",
    remix: "RiHomeLine",
  },
  LogInIcon: {
    lucide: "LogInIcon",
    remix: "RiLoginBoxLine",
  },
  UploadIcon: {
    lucide: "UploadIcon",
    remix: "RiUpload2Line",
  },
  PaletteIcon: {
    lucide: "PaletteIcon",
    remix: "RiPaletteLine",
  },
  UsersIcon: {
    lucide: "UsersIcon",
    remix: "RiGroupLine",
  },
  PlaneIcon: {
    lucide: "PlaneIcon",
    remix: "RiPlaneLine",
  },
  CameraIcon: {
    lucide: "CameraIcon",
    remix: "RiCameraLine",
  },
  ExternalLinkIcon: {
    lucide: "ExternalLinkIcon",
    remix: "RiExternalLinkLine",
  },
  MenuIcon: {
    lucide: "MenuIcon",
    remix: "RiMenuLine",
  },
  CopyIcon: {
    lucide: "CopyIcon",
    remix: "RiFileCopyLine",
  },
  PlusSquareIcon: {
    lucide: "PlusSquareIcon",
    remix: "RiAddBoxLine",
  },
  SquarePenIcon: {
    lucide: "SquarePenIcon",
    remix: "RiEditLine",
  },
  RotateCwIcon: {
    lucide: "RotateCwIcon",
    remix: "RiRestartLine",
  },
  XCircleIcon: {
    lucide: "XCircleIcon",
    remix: "RiCloseCircleLine",
  },
  BoldIcon: {
    lucide: "BoldIcon",
    remix: "RiBold",
  },
  ItalicIcon: {
    lucide: "ItalicIcon",
    remix: "RiItalic",
  },
  TimerIcon: {
    lucide: "TimerIcon",
    remix: "RiTimerLine",
  },
  PinIcon: {
    lucide: "PinIcon",
    remix: "RiPushpinLine",
  },
  ALargeSmallIcon: {
    lucide: "ALargeSmallIcon",
    remix: "RiFontSize",
  },
  Volume1Icon: {
    lucide: "Volume1Icon",
    remix: "RiVolumeDownLine",
  },
  Volume2Icon: {
    lucide: "Volume2Icon",
    remix: "RiVolumeUpLine",
  },
  ChevronsUpDownIcon: {
    lucide: "ChevronsUpDownIcon",
    remix: "RiExpandUpDownLine",
  },
};
