import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const formatRelativeTime = (date: Date): string => {
  const formattedDate: string = formatDistanceToNow(date, {
    locale: fr,
    addSuffix: true,
  });

  return formattedDate;
};
