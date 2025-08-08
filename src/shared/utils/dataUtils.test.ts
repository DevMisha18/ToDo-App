import { formatUtcToLocalTime } from "./dataUtils";

describe("formatUtcToLocalTime", () => {
  const OriginalIntlDateTimeFormat = Intl.DateTimeFormat;

  beforeAll(() => {
    class MockIntlDateTimeFormat {
      private formatter: Intl.DateTimeFormat;

      constructor(
        locales?: Intl.LocalesArgument,
        options?: Intl.DateTimeFormatOptions
      ) {
        this.formatter = new OriginalIntlDateTimeFormat(locales, {
          ...options,
          timeZone: "Europe/Warsaw",
        });
      }

      format(date: Date): string {
        return this.formatter.format(date);
      }
    }

    // @ts-expect-error mocking DateTimeFormat
    Intl.DateTimeFormat = MockIntlDateTimeFormat;
  });

  afterAll(() => {
    Intl.DateTimeFormat = OriginalIntlDateTimeFormat;
  });

  it("should correctly format a UTC date object to local time", () => {
    const utcDateObj = new Date("2025-02-08T10:00:00Z");
    const expectedLocalTime = "02/08/2025, 11:00 AM";
    const result = formatUtcToLocalTime(utcDateObj);

    expect(result).toBe(expectedLocalTime);
  });

  it("should correctly format a number to local time", () => {
    const utcDateObj = 1739008800000;
    const expectedLocalTime = "02/08/2025, 11:00 AM";
    const result = formatUtcToLocalTime(utcDateObj);

    expect(result).toBe(expectedLocalTime);
  });

  // UTC+1 in Warsaw in summer
  it("should correctly format a UTC date string to local time in summer", () => {
    const utcDateString = "2025-02-08T10:00:00Z";
    const expectedLocalTime = "02/08/2025, 11:00 AM";
    const result = formatUtcToLocalTime(utcDateString);

    expect(result).toBe(expectedLocalTime);
  });

  // UTC+2 in Warsaw in winter
  it("should correctly format a UTC date string to local time in winter", () => {
    const utcDateString = "2025-08-08T10:00:00Z";
    const expectedLocalTime = "08/08/2025, 12:00 PM";
    const result = formatUtcToLocalTime(utcDateString);

    expect(result).toBe(expectedLocalTime);
  });

  it("should throw a RangeError for invalid date input", () => {
    const utcDateString = "2025-18-38T10:00:00Z";

    expect(() => formatUtcToLocalTime(utcDateString)).toThrow(RangeError);
  });
});
