import { debounce } from "./debounce";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("debounce", () => {
  it("should not execute the functoin immediatly", async () => {
    const fakeFn = jest.fn();
    const delay = 500;
    const debouncedFakeFn = debounce(fakeFn, delay);

    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    await wait(500);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });

  it("should hault execution if called multiple times", async () => {
    const fakeFn = jest.fn();
    const delay = 500;
    const debouncedFakeFn = debounce(fakeFn, delay);

    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    await wait(200);
    debouncedFakeFn();
    expect(fakeFn).toHaveBeenCalledTimes(0);

    await wait(500);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });
});
