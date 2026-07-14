import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import MainContainer from "./MainContainer";

// Papa.parse runs in a worker in the app, which jsdom has no equivalent for, so
// the parse step is stubbed and resolves synchronously through `complete`.
const { parseMock } = vi.hoisted(() => ({ parseMock: vi.fn() }));

vi.mock("papaparse", () => ({
  default: { parse: parseMock },
}));

const ROWS = [
  ["Organisation", "Town", "County", "Type", "Route"],
  ["Test Org", "Test Town", "Test County", "Test Type", "Test Route"],
];

const mockFetch = (ok: boolean) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    text: () => Promise.resolve("csv text"),
  });

beforeEach(() => {
  parseMock.mockReset();
  parseMock.mockImplementation((_text, config) =>
    config.complete({ data: ROWS }),
  );
  vi.stubGlobal("fetch", mockFetch(true));
});

afterEach(() => vi.unstubAllGlobals());

describe("MainContainer", () => {
  test("shows the Get Started action on the hero screen", () => {
    render(<MainContainer />);
    expect(
      screen.getByRole("button", { name: /Get Started/i }),
    ).toBeInTheDocument();
  });

  test("renders SponsorTable with the fetched list", async () => {
    render(<MainContainer />);

    fireEvent.click(screen.getByRole("button", { name: /Get Started/i }));

    await waitFor(() => {
      expect(screen.getByText(/Search Sponsors/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Org/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith("/current_list.csv");
    // The hero action is replaced by the table.
    expect(
      screen.queryByRole("button", { name: /Get Started/i }),
    ).not.toBeInTheDocument();
  });

  test("returns to the hero screen when 'Start Page' is clicked", async () => {
    render(<MainContainer />);

    fireEvent.click(screen.getByRole("button", { name: /Get Started/i }));
    await waitFor(() =>
      expect(screen.getByText(/Test Org/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(/Start Page/i));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Get Started/i }),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(/Test Org/i)).not.toBeInTheDocument();
  });

  test("surfaces an error when the list cannot be fetched", async () => {
    vi.stubGlobal("fetch", mockFetch(false));
    render(<MainContainer />);

    fireEvent.click(screen.getByRole("button", { name: /Get Started/i }));

    await waitFor(() =>
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/HTTP 500/i)).toBeInTheDocument();
    expect(parseMock).not.toHaveBeenCalled();
  });
});
