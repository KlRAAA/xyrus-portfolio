import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "@/components/layout/Nav";

it("opens and closes the mobile menu", async () => {
  const user = userEvent.setup();
  render(<Nav />);
  const button = screen.getByRole("button", { name: "Menu" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  await user.click(button);
  expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
  await user.keyboard("{Escape}");
  expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
});
it("links to the résumé", () => {
  render(<Nav />);
  expect(screen.getAllByRole("link", { name: /résumé/i })[0]).toHaveAttribute("href", "/resume/Dimacali_Xyrus_Resume.pdf");
});
