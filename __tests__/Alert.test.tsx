import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "@/components/ui/Alert";

describe("Alert", () => {
  it("renders the title and children", () => {
    render(
      <Alert variant="warning" title="Tight budget">
        Consider trimming decor.
      </Alert>,
    );
    expect(screen.getByText("Tight budget")).toBeInTheDocument();
    expect(screen.getByText("Consider trimming decor.")).toBeInTheDocument();
  });

  it("defaults to a status role so it doesn't interrupt screen readers unnecessarily", () => {
    render(<Alert variant="info">Deterministic plan shown.</Alert>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses an alert role when explicitly passed, for urgent messages", () => {
    render(
      <Alert variant="danger" role="alert">
        Something went wrong.
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders without a title when none is given", () => {
    const { container } = render(<Alert variant="success">All good.</Alert>);
    expect(container.querySelector("p.font-semibold")).toBeNull();
  });
});
