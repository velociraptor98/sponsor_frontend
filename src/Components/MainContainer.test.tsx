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
  ["Organisation Name", "Town/City", "County", "Type & Rating", "Route"],
  [
    "Test Org",
    "Test Town",
    "Test County",
    "Worker (A rating)",
    "Skilled Worker",
  ],
];

const mockFetch = (ok: boolean) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    statusText: ok ? "OK" : "Internal Server Error",
    headers: { get: () => "Fri, 14 Aug 2026 00:00:00 GMT" },
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

const searchButton = () =>
  screen.getByRole("button", { name: /Search the register/i });

describe("MainContainer", () => {
  test("leads with the size of the register on the entry screen", async () => {
    render(<MainContainer />);

    expect(searchButton()).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/licensed organisations/i)).toBeInTheDocument();
    });
    // The one row in the fixture, counted, and broken down by route family.
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
    expect(screen.getByText("Skilled Worker")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/current_list.csv");
  });

  test("searching from the entry screen shows the matching sponsors", async () => {
    render(<MainContainer />);

    await waitFor(() =>
      expect(screen.getByText(/licensed organisations/i)).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByRole("textbox", { name: /Search the register/i }),
      { target: { value: "Test Town" } },
    );
    fireEvent.click(searchButton());

    await waitFor(() => {
      expect(screen.getByText(/Test Org/i)).toBeInTheDocument();
    });
    // The entry screen's action is replaced by the results screen.
    expect(
      screen.queryByRole("button", { name: /Search the register/i }),
    ).not.toBeInTheDocument();
  });

  test("returns to the entry screen when 'Start over' is clicked", async () => {
    render(<MainContainer />);

    await waitFor(() =>
      expect(screen.getByText(/licensed organisations/i)).toBeInTheDocument(),
    );
    fireEvent.click(searchButton());
    await waitFor(() =>
      expect(screen.getByText(/Test Org/i)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Start over/i }));

    await waitFor(() => expect(searchButton()).toBeInTheDocument());
    expect(screen.queryByText(/Test Org/i)).not.toBeInTheDocument();
  });

  test("surfaces an error when the list cannot be fetched", async () => {
    vi.stubGlobal("fetch", mockFetch(false));
    render(<MainContainer />);

    await waitFor(() =>
      expect(screen.getByText(/Failed to load/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/HTTP 500/i)).toBeInTheDocument();
    expect(parseMock).not.toHaveBeenCalled();
  });
});
