import { render, screen } from "@testing-library/react";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";

it("states GPA and school", () => {
  render(<About />);
  expect(screen.getByText(/1\.52/)).toBeInTheDocument();
  expect(screen.getByText(/Manuel S\. Enverga University Foundation/)).toBeInTheDocument();
  expect(screen.getByAltText(/Xyrus/)).toBeInTheDocument();
});
it("lists four capabilities", () => {
  render(<Capabilities />);
  expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
});
