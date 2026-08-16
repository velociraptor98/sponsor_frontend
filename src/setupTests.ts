// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// jsdom does not implement matchMedia, which Chakra UI relies on (e.g.
// useBreakpointValue / useColorMode). The stub answers min/max-width queries
// against a nominal desktop viewport, so components under test take the same
// branch a desktop browser would — a stub that always reports `false` would
// silently put every test on the mobile layout.
const TEST_VIEWPORT = 1280;

// Chakra asks in bands — `(min-width: 30em) and (max-width: 47.9375em)` — so
// every condition in the query has to hold, not just the first one.
const evaluate = (query: string) => {
  const conditions = [
    ...query.matchAll(/\((min|max)-width:\s*([\d.]+)(px|em|rem)\)/g),
  ];
  if (conditions.length === 0) return false;
  return conditions.every(([, bound, value, unit]) => {
    const px = unit === "px" ? Number(value) : Number(value) * 16;
    return bound === "min" ? TEST_VIEWPORT >= px : TEST_VIEWPORT <= px;
  });
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: evaluate(query),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
