import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarouselArrow } from "../../../../components/CarouselArrow";

describe("CarouselArrow", () => {
  it("renders left arrow with correct icon and label", () => {
    render(<CarouselArrow direction="left" onClick={() => {}} />);

    const button = screen.getByLabelText("Previous slide");
    expect(button).toBeInTheDocument();

    // Check if Lucide icon is rendered (it should have specific attributes)
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders right arrow with correct icon and label", () => {
    render(<CarouselArrow direction="right" onClick={() => {}} />);

    const button = screen.getByLabelText("Next slide");
    expect(button).toBeInTheDocument();

    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    const mockOnClick = vi.fn();
    render(<CarouselArrow direction="left" onClick={mockOnClick} />);

    const button = screen.getByLabelText("Previous slide");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    const mockOnClick = vi.fn();
    render(
      <CarouselArrow direction="left" onClick={mockOnClick} disabled={true} />,
    );

    const button = screen.getByLabelText("Previous slide");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<CarouselArrow direction="left" onClick={() => {}} />);

    const button = screen.getByRole("button", { name: "Previous slide" });
    expect(button).toHaveAttribute("aria-label", "Previous slide");
  });

  it("applies correct CSS classes", () => {
    render(<CarouselArrow direction="left" onClick={() => {}} />);

    const button = screen.getByLabelText("Previous slide");
    expect(button).toHaveClass("carousel-arrow");
    expect(button).toHaveClass("carousel-arrow-left");
  });
});
