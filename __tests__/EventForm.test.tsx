import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventForm } from "@/components/wizard/EventForm";

describe("EventForm", () => {
  it("renders all 7 event types with Wedding selected by default", () => {
    render(<EventForm onSubmit={vi.fn()} isSubmitting={false} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(7);
    expect(screen.getByRole("radio", { name: /Wedding/i })).toHaveAttribute("aria-checked", "true");
  });

  it("selects a different event type on click", () => {
    render(<EventForm onSubmit={vi.fn()} isSubmitting={false} />);
    fireEvent.click(screen.getByRole("radio", { name: /Anniversary/i }));
    expect(screen.getByRole("radio", { name: /Anniversary/i })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Wedding/i })).toHaveAttribute("aria-checked", "false");
  });

  it("blocks advancing to step 2 without an event name", () => {
    render(<EventForm onSubmit={vi.fn()} isSubmitting={false} />);
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByRole("alert")).toHaveTextContent(/name your event/i);
    expect(screen.queryByLabelText(/Expected guest count/i)).not.toBeInTheDocument();
  });

  it("advances to step 2 once required step-1 fields are filled", () => {
    render(<EventForm onSubmit={vi.fn()} isSubmitting={false} />);
    fireEvent.change(screen.getByLabelText(/Event name/i), { target: { value: "Test Wedding" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    expect(screen.getByLabelText(/Expected guest count/i)).toBeInTheDocument();
  });

  it("calls onChange with the live form state as fields are edited", () => {
    const onChange = vi.fn();
    render(<EventForm onSubmit={vi.fn()} isSubmitting={false} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Event name/i), { target: { value: "Priya's Party" } });
    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall?.eventName).toBe("Priya's Party");
  });
});
