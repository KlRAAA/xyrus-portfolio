import { render, screen } from "@testing-library/react";
import { Numbers } from "@/components/sections/Numbers";
import { Process } from "@/components/sections/Process";

it("exposes final stat values to assistive tech", () => {
  render(<Numbers />);
  // Visible (aria-hidden) and sr-only copies both render the final value.
  expect(screen.getAllByText("10,040").length).toBeGreaterThan(0);
  expect(screen.getAllByText("0.826").length).toBeGreaterThan(0);
});
it("renders five ordered process steps", () => {
  render(<Process />);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});
