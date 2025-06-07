import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(clicked).toBe(true);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Custom button</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("should render different variants", () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-gray-600");

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-gray-700");
  });

  it("should render different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-11");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10", "w-10");
  });

  it("should forward ref correctly", () => {
    let buttonRef: HTMLButtonElement | null = null;

    render(
      <Button
        ref={(ref) => {
          buttonRef = ref;
        }}
      >
        Button with ref
      </Button>
    );

    expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
    expect(buttonRef?.textContent).toBe("Button with ref");
  });
});
