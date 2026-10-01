import { render, screen } from "@testing-library/react";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

it("offers email and résumé", () => {
  render(<Contact />);
  expect(screen.getByRole("link", { name: /email me/i })).toHaveAttribute("href", "mailto:xyrusdimacali@gmail.com");
  expect(screen.getByRole("link", { name: /download résumé/i })).toHaveAttribute(
    "href",
    "/resume/Dimacali_Xyrus_Resume.pdf",
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
it("credits Xyrus in the footer", () => {
  render(<Footer />);
  expect(screen.getByText(/© 2026 Xyrus Lorenz Dimacali/)).toBeInTheDocument();
});
