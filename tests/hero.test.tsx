import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

it("names Xyrus in the page heading", () => {
  render(<Hero />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Xyrus Dimacali/);
});
it("shows availability and the portrait", () => {
  render(<Hero />);
  expect(screen.getByText("Available for internships")).toBeInTheDocument();
  expect(screen.getByAltText("Portrait of Xyrus Dimacali")).toBeInTheDocument();
});
