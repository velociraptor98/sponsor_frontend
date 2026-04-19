import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../test-utils";
import MainContainer from "./MainContainer";

// Mock react-papaparse's useCSVReader
jest.mock("react-papaparse", () => ({
  useCSVReader: () => ({
    CSVReader: ({ children, onUploadAccepted }: any) => {
      const getRootProps = () => ({
        onClick: () => {
          // Simulate a file upload by calling onUploadAccepted with dummy data
          onUploadAccepted({
            data: [
              ["Organization", "Town", "County", "Type", "Route"],
              [
                "Test Org",
                "Test Town",
                "Test County",
                "Test Type",
                "Test Route",
              ],
            ],
          });
        },
      });
      return children({ getRootProps, acceptedFile: null });
    },
  }),
}));

describe("MainContainer File Upload Flow", () => {
  test("renders upload button initially and opens modal when clicked", async () => {
    render(<MainContainer />);

    // Check if the upload button is present
    const uploadButton = screen.getByText(/Upload Sponsor CSV/i);
    expect(uploadButton).toBeInTheDocument();

    // Click to open modal
    fireEvent.click(uploadButton);

    // Check if modal content is rendered
    expect(screen.getByText(/Upload CSV file/i)).toBeInTheDocument();
    expect(screen.getByText(/Click to select a CSV file/i)).toBeInTheDocument();
  });

  test("renders SponsorTable when a file with data is uploaded", async () => {
    render(<MainContainer />);

    const uploadButton = screen.getByText(/Upload Sponsor CSV/i);
    fireEvent.click(uploadButton);

    // In our mock, clicking the CSVReader area triggers onUploadAccepted
    const dropzone = screen.getByText(/Click to select a CSV file/i);
    fireEvent.click(dropzone);

    // After upload, SponsorTable should be rendered.
    // It has a "Sponsor List" heading and "Test Org" from our mock data.
    await waitFor(() => {
      expect(screen.getByText(/Sponsor List/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Org/i)).toBeInTheDocument();
    });

    // Verify upload button is gone
    expect(screen.queryByText(/Upload Sponsor CSV/i)).not.toBeInTheDocument();
  });
});
