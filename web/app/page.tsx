import { LucideBox, LucideCode2, LucideEarth } from "lucide-react";
import Link from "next/link";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { API_ENDPOINT } from "@/lib/constants";

const endpoint = `${API_ENDPOINT}/organizations/TEAM_ID`;

const mainExample = `// Fetch portfolio data
const res = await fetch("${endpoint}");
const { information, projects, experience } = await res.json();

// Render in your app
return (
  <div>
    <h1>{portfolio.title}</h1>
    <p>{portfolio.description}</p>
    {expierience.map(exp => (
      <ExperienceCard key={exp.id} {...exp} />
    ))}
    {projects.map(project => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </div>
);`;

const apiExample = `// Response
{
  "id": "123456",
  "information": {
    "title": "Kenneth Bass",
    "description": "A full-stack developer based in Oklahoma",
    "socials": [
      "https://github.com/dishwasher-detergent",
      "https://codepen.com/kennethbass",
      "https://linkedin.com/in/kennethtylerbass"
    ]
  },
  "projects": [...],
  "experience": [...]
}`;

export default function Home() {
  return (
    <div className="bg-marketing-foreground text-marketing-background flex min-h-screen flex-col">
      <header className="bg-marketing-background text-marketing-foreground sticky top-0 z-50 flex items-center justify-between px-6 py-4">
        <h1 className="hidden text-4xl font-bold tracking-tighter md:block">
          KURIOH.
        </h1>
        <h1 className="block text-4xl font-bold tracking-tighter md:hidden">
          K.
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            className="text-border-marketing-background hidden font-mono md:block"
            asChild
          >
            <Link href="#features">Features</Link>
          </Button>
          <Button
            variant="link"
            className="text-border-marketing-background hidden font-mono md:block"
            asChild
          >
            <Link href="#api">API</Link>
          </Button>
          <Button
            variant="link"
            className="text-border-marketing-background hidden font-mono md:block"
            asChild
          >
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button
            className="text-marketing-background bg-marketing-foreground hover:bg-marketing-foreground/80 hover:text-marketing-background ml-4 rounded-none transition-all"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>
      <section className="bg-marketing-background text-marketing-foreground grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-12">
          <h2 className="mb-6 text-6xl leading-none font-bold tracking-tight md:text-8xl">
            Build your{" "}
            <span className="underline decoration-wavy">portfolio</span> without
            the hassle.
          </h2>
          <p className="mb-8 font-mono text-xl md:text-2xl">
            A headless CMS designed specifically for portfolio websites.
          </p>
          <div className="flex gap-4">
            <Button
              className="text-marketing-background bg-marketing-foreground hover:bg-marketing-foreground/80 hover:text-marketing-background rounded-none px-8 py-6 text-lg transition-all"
              asChild
            >
              <Link href="/signup">Start free now</Link>
            </Button>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden">
          <SyntaxHighlighter
            language="jsx"
            style={oneDark}
            showLineNumbers={true}
            customStyle={{
              padding: 0,
              paddingInline: "1rem",
              paddingBlock: "2rem",
              margin: 0,
              marginBottom: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "var(--marketing-background)",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {mainExample}
          </SyntaxHighlighter>
        </div>
      </section>
      <section id="features">
        <div className="p-6 md:p-12">
          <h2 className="mb-4 text-5xl font-bold">Features</h2>
          <p className="font-mono text-xl md:text-2xl">
            Everything you need, nothing you don&apos;t.
          </p>
        </div>
        <div className="border-marketing-background grid grid-cols-1 overflow-hidden border-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="after:bg-marketing-background relative p-12 transition-shadow after:absolute after:top-0 after:right-0 after:block after:h-full after:w-[1px] after:last:hidden hover:shadow-lg md:after:block md:last:after:hidden lg:last:after:hidden lg:odd:last:after:hidden md:[&:nth-child(2)]:after:block">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-2xl font-bold">Simple API</h3>
              <LucideCode2 className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              One endpoint, zero complexity. Build your portfolio in minutes
              with our developer-friendly API.
            </p>
          </div>
          <div className="border-marketing-background after:bg-marketing-background relative border-t-1 p-12 transition-shadow after:absolute after:top-0 after:right-0 after:block after:h-full after:w-[1px] after:last:hidden hover:shadow-lg md:border-t-0 md:after:block lg:border-t-0 lg:last:after:hidden">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-2xl font-bold">100% Free</h3>
              <LucideBox className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              No premium tiers, no hidden costs. All features available to
              everyone, forever.
            </p>
          </div>
          <div className="border-marketing-background relative border-t-1 p-12 transition-shadow hover:shadow-lg md:border-t-1 lg:border-t-0">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-2xl font-bold">Unlimited</h3>
              <LucideEarth className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              Create as many projects and portfolios as you need. No artificial
              limits on your creativity.
            </p>
          </div>
        </div>
      </section>
      <section
        id="api"
        className="bg-marketing-background text-marketing-foreground grid grid-cols-1 gap-0 md:grid-cols-2"
      >
        <div className="flex flex-col p-6 md:p-12">
          <h2 className="mb-4 text-5xl font-bold">API that just works</h2>
          <p className="mb-8 font-mono text-xl md:text-2xl">
            No complex documentation. Just fetch and go.
          </p>
          <div>
            <h3 className="mb-4 font-mono text-2xl font-bold">
              <span className="text-green-500">GET</span>{" "}
              {endpoint.split(/(run|global)/)[2]}
            </h3>
            <p className="mb-4">
              Fetch a complete portfolio with one simple API call. Include
              projects, experience, and more.
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden">
          <SyntaxHighlighter
            language="jsx"
            style={oneDark}
            showLineNumbers={true}
            customStyle={{
              padding: 0,
              paddingInline: "1rem",
              paddingBlock: "2rem",
              margin: 0,
              marginBottom: 0,
              height: "100%",
              width: "100%",
              backgroundColor: "var(--marketing-background)",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {apiExample}
          </SyntaxHighlighter>
        </div>
      </section>
      <section
        id="pricing"
        className="border-marketing-background border-b p-6 md:p-12"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-5xl font-bold">Free. Forever.</h2>
          <p className="mb-8 font-mono text-xl">
            No credit card required. No hidden fees.
          </p>
          <Button
            className="text-marketing-foreground bg-marketing-background hover:bg-marketing-background/80 hover:text-marketing-foreground rounded-none px-8 py-6 text-lg transition-all"
            asChild
          >
            <Link href="/signup">Start free now</Link>
          </Button>
        </div>
      </section>
      <footer className="bg-marketing-background text-marketing-foreground p-6 md:p-12">
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h3 className="mb-2 text-2xl font-bold">KURIOH.</h3>
            <p className="font-mono text-sm">A headless CMS for portfolios.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <p className="font-mono text-sm">
              © {new Date().getFullYear()} Kurioh. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
