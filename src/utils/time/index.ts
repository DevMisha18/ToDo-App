/**
 * Converts an ISO 8601 UTC date string (e.g., "YYYY-MM-DDTHH:mm:ss.sssZ")
 * to a localized date and time string based on the user's system settings.
 *
 * @param utcDateString The date string in ISO 8601 UTC format.
 * This string should represent a UTC time and typically
 * ends with 'Z' (Zulu time) to denote UTC.
 * Example: "2025-07-24T21:26:21.000Z"
 * @returns A string representing the date and time in the user's local format.
 */
export function formatUtcToLocalTime(utcDateString: string): string {
  const date = new Date(utcDateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    // timeZoneName: "short",
  };

  const formattedDate = new Intl.DateTimeFormat(undefined, options).format(
    date
  );

  return formattedDate;
}
