import { Nav } from "@/components/layout/Nav";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <Work />
      </main>
    </>
  );
}
