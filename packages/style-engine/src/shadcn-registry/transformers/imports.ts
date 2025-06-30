// import type { IconLibrary } from "../../types";

// export function transformImports(
//   code: string,
//   iconLibrary: IconLibrary,
// ): string {
//   if (iconLibrary === "lucide") {
//     return code.replace(/from "@remixicon\/react"/g, 'from "lucide-react"');
//   } else if (iconLibrary === "remix-icons") {
//     return code.replace(/from "lucide-react"/g, 'from "@remixicon/react"');
//   }

//   return code;
// }

// export function transformIconNames(
//   code: string,
//   iconLibrary: IconLibrary,
// ): string {
//   if (iconLibrary === "remix-icons") {
//     // Transform lucide icon names to remix icon names
//     const iconMappings: Record<string, string> = {
//       // Common icons
//       ChevronDownIcon: "RiArrowDownSLine",
//       ChevronUpIcon: "RiArrowUpSLine",
//       ChevronLeftIcon: "RiArrowLeftSLine",
//       ChevronRightIcon: "RiArrowRightSLine",
//       CheckIcon: "RiCheckLine",
//       XIcon: "RiCloseLine",
//       SearchIcon: "RiSearchLine",
//       PlusIcon: "RiAddLine",
//       MinusIcon: "RiSubtractLine",
//       EyeIcon: "RiEyeLine",
//       EyeOffIcon: "RiEyeOffLine",
//       CalendarIcon: "RiCalendarLine",
//       ClockIcon: "RiTimeLine",
//       UserIcon: "RiUserLine",
//       SettingsIcon: "RiSettings3Line",
//       HomeIcon: "RiHomeLine",
//       MenuIcon: "RiMenuLine",
//       MoreHorizontalIcon: "RiMore2Line",
//       MoreVerticalIcon: "RiMoreLine",
//       EditIcon: "RiEditLine",
//       TrashIcon: "RiDeleteBinLine",
//       CopyIcon: "RiFileCopyLine",
//       ExternalLinkIcon: "RiExternalLinkLine",
//       DownloadIcon: "RiDownloadLine",
//       UploadIcon: "RiUploadLine",
//       InfoIcon: "RiInformationLine",
//       AlertTriangleIcon: "RiErrorWarningLine",
//       AlertCircleIcon: "RiAlertLine",
//       CheckCircleIcon: "RiCheckboxCircleLine",
//       XCircleIcon: "RiCloseCircleLine",
//       HelpCircleIcon: "RiQuestionLine",
//       StarIcon: "RiStarLine",
//       HeartIcon: "RiHeartLine",
//       ThumbsUpIcon: "RiThumbUpLine",
//       ThumbsDownIcon: "RiThumbDownLine",
//       MessageCircleIcon: "RiChatLine",
//       MailIcon: "RiMailLine",
//       PhoneIcon: "RiPhoneLine",
//       MapPinIcon: "RiMapPinLine",
//       GlobeIcon: "RiGlobalLine",
//       LinkIcon: "RiLinkLine",
//       ImageIcon: "RiImageLine",
//       FileIcon: "RiFileLine",
//       FolderIcon: "RiFolderLine",
//       PlayIcon: "RiPlayLine",
//       PauseIcon: "RiPauseLine",
//       StopIcon: "RiStopLine",
//       SkipBackIcon: "RiSkipBackLine",
//       SkipForwardIcon: "RiSkipForwardLine",
//       VolumeIcon: "RiVolumeLine",
//       Volume2Icon: "RiVolumeUpLine",
//       VolumeXIcon: "RiVolumeMuteLine",
//       MicIcon: "RiMicLine",
//       MicOffIcon: "RiMicOffLine",
//       CameraIcon: "RiCameraLine",
//       VideoIcon: "RiVideoLine",
//       MonitorIcon: "RiComputerLine",
//       SmartphoneIcon: "RiSmartphoneLine",
//       TabletIcon: "RiTabletLine",
//       LaptopIcon: "RiMacbookLine",
//       PrinterIcon: "RiPrinterLine",
//       WifiIcon: "RiWifiLine",
//       BluetoothIcon: "RiBluetoothLine",
//       BatteryIcon: "RiBatteryLine",
//       ZapIcon: "RiFlashLine",
//       SunIcon: "RiSunLine",
//       MoonIcon: "RiMoonLine",
//       CloudIcon: "RiCloudLine",
//       UmbrellaIcon: "RiUmbrellaLine",
//       ThermometerIcon: "RiTempHotLine",
//     };

//     let transformedCode = code;

//     Object.entries(iconMappings).forEach(([lucideIcon, remixIcon]) => {
//       const regex = new RegExp(`\\b${lucideIcon}\\b`, "g");
//       transformedCode = transformedCode.replace(regex, remixIcon);
//     });

//     return transformedCode;
//   } else if (iconLibrary === "lucide") {
//     // Transform remix icon names to lucide icon names
//     const iconMappings: Record<string, string> = {
//       RiArrowDownSLine: "ChevronDownIcon",
//       RiArrowUpSLine: "ChevronUpIcon",
//       RiArrowLeftSLine: "ChevronLeftIcon",
//       RiArrowRightSLine: "ChevronRightIcon",
//       RiCheckLine: "CheckIcon",
//       RiCloseLine: "XIcon",
//       RiSearchLine: "SearchIcon",
//       RiAddLine: "PlusIcon",
//       RiSubtractLine: "MinusIcon",
//       RiEyeLine: "EyeIcon",
//       RiEyeOffLine: "EyeOffIcon",
//       RiCalendarLine: "CalendarIcon",
//       RiTimeLine: "ClockIcon",
//       RiUserLine: "UserIcon",
//       RiSettings3Line: "SettingsIcon",
//       RiHomeLine: "HomeIcon",
//       RiMenuLine: "MenuIcon",
//       RiMore2Line: "MoreHorizontalIcon",
//       RiMoreLine: "MoreVerticalIcon",
//       RiEditLine: "EditIcon",
//       RiDeleteBinLine: "TrashIcon",
//       RiFileCopyLine: "CopyIcon",
//       RiExternalLinkLine: "ExternalLinkIcon",
//       RiDownloadLine: "DownloadIcon",
//       RiUploadLine: "UploadIcon",
//       RiInformationLine: "InfoIcon",
//       RiErrorWarningLine: "AlertTriangleIcon",
//       RiAlertLine: "AlertCircleIcon",
//       RiCheckboxCircleLine: "CheckCircleIcon",
//       RiCloseCircleLine: "XCircleIcon",
//       RiQuestionLine: "HelpCircleIcon",
//     };

//     let transformedCode = code;

//     Object.entries(iconMappings).forEach(([remixIcon, lucideIcon]) => {
//       const regex = new RegExp(`\\b${remixIcon}\\b`, "g");
//       transformedCode = transformedCode.replace(regex, lucideIcon);
//     });

//     return transformedCode;
//   }

//   return code;
// }

// export function transformComponentCode(
//   code: string,
//   iconLibrary: IconLibrary,
// ): string {
//   let transformedCode = code;

//   transformedCode = transformImports(transformedCode, iconLibrary);
//   transformedCode = transformIconNames(transformedCode, iconLibrary);

//   return transformedCode;
// }
