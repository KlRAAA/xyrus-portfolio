import { render, screen } from "@testing-library/react";
import { Stack } from "@/components/sections/Stack";
import { Certifications } from "@/components/sections/Certifications";

it("names every tool for screen readers", () => {
  render(<Stack />);
  for (const n of ["Python", "Next.js", "PostgreSQL", "VS Code", "Postman"]) {
    expect(screen.getAllByText(n).length).toBeGreaterThan(0);
  }
});
it("lists five certifications", () => {
  render(<Certifications />);
  expect(screen.getAllByRole("listitem")).toHaveLength(5);
});
