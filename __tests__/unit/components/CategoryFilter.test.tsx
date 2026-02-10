import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import CategoryFilter from "../../../components/CategoryFilter";

describe("CategoryFilter", () => {
  const mockOnCategoryChange = vi.fn();

  const defaultProps = {
    selectedCategory: null,
    onCategoryChange: mockOnCategoryChange,
    availableCategories: ["dessert", "seafood", "meat", "vegetarian"],
  };

  beforeEach(() => {
    mockOnCategoryChange.mockClear();
  });

  it("renders all available category buttons", () => {
    render(<CategoryFilter {...defaultProps} />);

    // Check that all category buttons are rendered
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Dessert")).toBeInTheDocument();
    expect(screen.getByText("Seafood")).toBeInTheDocument();
    expect(screen.getByText("Meat")).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
  });

  it("renders only categories present in availableCategories", () => {
    const limitedCategories = ["seafood"];
    render(
      <CategoryFilter
        {...defaultProps}
        availableCategories={limitedCategories}
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Seafood")).toBeInTheDocument();
    expect(screen.queryByText("Dessert")).not.toBeInTheDocument();
    expect(screen.queryByText("Meat")).not.toBeInTheDocument();
    expect(screen.queryByText("Vegetarian")).not.toBeInTheDocument();
  });

  it("calls onCategoryChange with null when All button is clicked", () => {
    render(<CategoryFilter {...defaultProps} />);

    const allButton = screen.getByText("All");
    fireEvent.click(allButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith(null);
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
  });

  it("calls onCategoryChange with category ID when category button is clicked", () => {
    render(<CategoryFilter {...defaultProps} />);

    const seafoodButton = screen.getByText("Seafood");
    fireEvent.click(seafoodButton);

    expect(mockOnCategoryChange).toHaveBeenCalledWith("seafood");
    expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
  });

  it("applies active class to selected category button", () => {
    render(<CategoryFilter {...defaultProps} selectedCategory="seafood" />);

    const seafoodButton = screen.getByText("Seafood").closest("button");
    const allButton = screen.getByText("All").closest("button");

    expect(seafoodButton).toHaveClass("CategoryFilter-button--active");
    expect(allButton).not.toHaveClass("CategoryFilter-button--active");
  });

  it("applies active class to All button when selectedCategory is null", () => {
    render(<CategoryFilter {...defaultProps} selectedCategory={null} />);

    const allButton = screen.getByText("All").closest("button");
    const seafoodButton = screen.getByText("Seafood").closest("button");

    expect(allButton).toHaveClass("CategoryFilter-button--active");
    expect(seafoodButton).not.toHaveClass("CategoryFilter-button--active");
  });

  it("renders with correct CSS classes", () => {
    render(<CategoryFilter {...defaultProps} />);

    const wrapper = screen.getByRole("region");
    expect(wrapper).toHaveClass("CategoryFilter-wrapper");

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("CategoryFilter-button");
    });
  });
});