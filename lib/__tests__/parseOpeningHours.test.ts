import { parseOpeningHoursArray, generateSlotsForRanges } from "../parseOpeningHours";

describe("parseOpeningHoursArray", () => {
  it("parses simple weekday range", () => {
    const arr = ["Monday: 10:00 AM – 6:00 PM"];
    const parsed = parseOpeningHoursArray(arr);
    expect(parsed.Monday).toHaveLength(1);
    expect(parsed.Monday[0]).toEqual({ start: "10:00", end: "18:00" });
  });

  it("parses multiple ranges and special spaces", () => {
    const arr = ["Saturday: 10:00 AM – 4:00 PM, 5:00 PM - 7:00 PM"];
    const parsed = parseOpeningHoursArray(arr);
    expect(parsed.Saturday).toHaveLength(2);
    expect(parsed.Saturday[0]).toEqual({ start: "10:00", end: "16:00" });
    expect(parsed.Saturday[1]).toEqual({ start: "17:00", end: "19:00" });
  });

  it("handles Closed", () => {
    const arr = ["Sunday: Closed"];
    const parsed = parseOpeningHoursArray(arr);
    expect(parsed.Sunday).toHaveLength(0);
  });
});

describe("generateSlotsForRanges", () => {
  it("generates 30-minute slots between 10:00 and 18:00", () => {
    const ranges = [{ start: "10:00", end: "18:00" }];
    const slots = generateSlotsForRanges(ranges, 30);
    expect(slots[0]).toBe("10:00");
    expect(slots.includes("17:30")).toBeTruthy();
    expect(slots.includes("18:00")).toBeFalsy();
  });
});
