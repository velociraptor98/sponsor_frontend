import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

test("renders sponsor list viewer header", () => {
  render(<App />);
  const headerElement = screen.getByText(/Sponsor List Viewer/i);
  expect(headerElement).toBeInTheDocument();
});
