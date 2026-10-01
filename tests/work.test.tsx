import { render, screen, within } from "@testing-library/react";
import { Work } from "@/components/sections/Work";

it("renders four projects as articles with headings", () => {
  render(<Work />);
  const articles = screen.getAllByRole("article");
  expect(articles).toHaveLength(4);
  expect(within(articles[0]).getByRole("heading", { level: 3 })).toHaveTextContent("RideShareEU");
});
it("opens project links in a new tab, safely", () => {
  render(<Work />);
  const code = screen.getByRole("link", { name: /RideShareEU code/i });
  expect(code).toHaveAttribute("href", "https://github.com/KlRAAA/rideshare-eu");
  expect(code).toHaveAttribute("target", "_blank");
  expect(code).toHaveAttribute("rel", "noopener noreferrer");
});
