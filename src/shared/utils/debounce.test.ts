import { debounce } from "./debounce";

describe("debounce", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("should not execute the functoin immediatly", async () => {
    const fakeFn = jest.fn();
    const delay = 300;
    const debouncedFakeFn = debounce(fakeFn, delay);

    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });

  it("should hault execution if called multiple times", async () => {
    const fakeFn = jest.fn();
    const delay = 300;
    const debouncedFakeFn = debounce(fakeFn, delay);

    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(100);
    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });
});
