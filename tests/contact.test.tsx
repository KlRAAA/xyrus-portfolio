import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

it("offers email and résumé", () => {
  render(<Contact />);
  expect(screen.getByRole("link", { name: /email me/i })).toHaveAttribute("href", "mailto:xyrusdimacali@gmail.com");
  expect(screen.getByRole("link", { name: /download résumé/i })).toHaveAttribute(
    "href",
    "/resume/Dimacali_Xyrus_Lorenz_Dev_Resume.pdf",
  );
});
it("never links a phone number", () => {
  const { container } = render(
    <>
      <Contact />
      <Footer />
    </>,
  );
  expect(container.querySelector('a[href^="tel:"]')).toBeNull();
});
it("links every social profile from the footer", () => {
  render(<Footer />);
  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/KlRAAA");
  expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://linkedin.com/in/xyrus-dimacali-73a752328");
  expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/_xyrusdmcl");
  expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://www.facebook.com/share/1CXviKnSq4/");
});
it("credits Xyrus in the footer", () => {
  render(<Footer />);
  expect(screen.getByText(/© 2026 Xyrus Lorenz Dimacali/)).toBeInTheDocument();
});
