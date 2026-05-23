import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders app header", () => {
  render(<App />);
  const headerElements = screen.getAllByText(/^Sponsr$/i);
  expect(headerElements.length).toBeGreaterThan(0);
});
