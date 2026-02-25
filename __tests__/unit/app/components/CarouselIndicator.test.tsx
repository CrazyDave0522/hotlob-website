import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CarouselIndicator } from "../../../../components/carousel/CarouselIndicator";

describe("CarouselIndicator", () => {
  it("renders nothing when total is 1 or less", () => {
    const { container } = render(
      <CarouselIndicator total={1} current={0} onClick={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correct number of indicators", () => {
    render(<CarouselIndicator total={3} current={0} onClick={() => {}} />);

    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 3")).toBeInTheDocument();
  });

  it("marks current indicator as active", () => {
    render(<CarouselIndicator total={3} current={1} onClick={() => {}} />);

    const activeIndicator = screen.getByLabelText("Go to slide 2");
    expect(activeIndicator).toHaveClass("active");

    const inactiveIndicator1 = screen.getByLabelText("Go to slide 1");
    const inactiveIndicator3 = screen.getByLabelText("Go to slide 3");
    expect(inactiveIndicator1).toHaveClass("inactive");
    expect(inactiveIndicator3).toHaveClass("inactive");
  });

  it("calls onClick with correct index when indicator is clicked", () => {
    const mockOnClick = vi.fn();
    render(<CarouselIndicator total={3} current={0} onClick={mockOnClick} />);

    const secondIndicator = screen.getByLabelText("Go to slide 2");
    fireEvent.click(secondIndicator);

    expect(mockOnClick).toHaveBeenCalledWith(1);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility attributes", () => {
    render(<CarouselIndicator total={2} current={0} onClick={() => {}} />);

    const indicators = screen.getAllByRole("button");
    expect(indicators).toHaveLength(2);

    indicators.forEach((indicator, index) => {
      expect(indicator).toHaveAttribute(
        "aria-label",
        `Go to slide ${index + 1}`,
      );
    });
  });
});
