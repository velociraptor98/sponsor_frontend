import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import { render } from "../test-utils";
import SponsorTable from "./SponsorTable";
import { toSponsors } from "../register";

// One organisation licensed for two routes, so the grouping the register does
// at parse time is exercised alongside the filters.
const SPONSORS = toSponsors([
  ["Ardwick Care Group Ltd", "Manchester", "Greater Manchester", "Worker (A rating)", "Skilled Worker"],
  ["Bellhouse Engineering plc", "Manchester", "Greater Manchester", "Worker (A rating)", "Skilled Worker"],
  ["Bellhouse Engineering plc", "Manchester", "Greater Manchester", "Worker (A rating)", "Global Business Mobility: Senior or Specialist Worker"],
  ["Salford Foods Ltd", "Salford", "Greater Manchester", "Worker (B rating)", "Skilled Worker"],
]);

const renderTable = (query = "") =>
  render(<SponsorTable sponsors={SPONSORS} query={query} isLoading={false} />);

describe("SponsorTable", () => {
  test("counts organisations, not the register's one-row-per-route listings", () => {
    renderTable();
    expect(screen.getByText("3 sponsors")).toBeInTheDocument();
    // The two routes of one organisation are shown together on its row.
    expect(screen.getByText("Skilled Worker · GBM")).toBeInTheDocument();
  });

  test("a location facet narrows the results and reports its own count", () => {
    renderTable();

    const salford = screen.getByRole("button", { name: /Salford/ });
    expect(within(salford).getByText("1")).toBeInTheDocument();
    fireEvent.click(salford);

    expect(screen.getByText("1 sponsor in Salford")).toBeInTheDocument();
    expect(screen.getByText("Salford Foods Ltd")).toBeInTheDocument();
    expect(screen.queryByText("Ardwick Care Group Ltd")).not.toBeInTheDocument();
  });

  test("the rating segments filter to A- and B-rated sponsors", () => {
    renderTable();

    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByText("1 sponsor")).toBeInTheDocument();
    expect(screen.getByText("Salford Foods Ltd")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(screen.getByText("2 sponsors")).toBeInTheDocument();
  });

  test("a route facet matches organisations holding that route among others", () => {
    renderTable();

    fireEvent.click(screen.getByRole("button", { name: /Global Business Mobility/ }));
    expect(screen.getByText("1 sponsor")).toBeInTheDocument();
    expect(screen.getByText("Bellhouse Engineering plc")).toBeInTheDocument();
  });

  test("the search box filters on name, town and county", async () => {
    renderTable("Ardwick");
    await waitFor(() =>
      expect(screen.getByText(/1 sponsor matching/)).toBeInTheDocument(),
    );
    expect(screen.queryByText("Salford Foods Ltd")).not.toBeInTheDocument();
  });

  test("offers a way out when nothing matches", async () => {
    renderTable("nothing here");
    await waitFor(() =>
      expect(screen.getByText("Nothing here yet")).toBeInTheDocument(),
    );
  });
});
