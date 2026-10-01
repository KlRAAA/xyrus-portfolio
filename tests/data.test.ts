import * as data from "@/data/portfolio";
import { techIcons } from "@/lib/tech-icons";

const { projects, stats, stackGroups, certifications, site } = data;

it("has four projects with unique slugs", () => {
  expect(projects).toHaveLength(4);
  expect(new Set(projects.map((p) => p.slug)).size).toBe(4);
});
it("gives each project 2-3 bullets, chips and an https link", () => {
  for (const p of projects) {
    expect(p.bullets.length).toBeGreaterThanOrEqual(2);
    expect(p.bullets.length).toBeLessThanOrEqual(3);
    expect(p.stack.length).toBeGreaterThan(0);
    expect(p.links.length).toBeGreaterThan(0);
    for (const l of p.links) expect(l.href).toMatch(/^https:\/\//);
  }
});
it("marks only the thesis as featured", () => {
  expect(projects.filter((p) => p.featured).map((p) => p.slug)).toEqual(["rideshare-eu"]);
});
it("has five stats and five certifications", () => {
  expect(stats).toHaveLength(5);
  expect(certifications).toHaveLength(5);
});
it("only references registered tech icons", () => {
  for (const g of stackGroups) for (const t of g.items) expect(techIcons[t.icon]).toBeDefined();
});
it("never publishes a phone number", () => {
  const all = JSON.stringify(data);
  expect(all).not.toMatch(/tel:/);
  expect(all).not.toMatch(/(\+?63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/);
});
it("uses the public email", () => expect(site.email).toBe("xyrusdimacali@gmail.com"));
