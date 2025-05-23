import { LucideCode2, LucidePiggyBank, LucideUsers } from "lucide-react";
import Link from "next/link";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { API_ENDPOINT } from "@/lib/constants";

const endpoint = `${API_ENDPOINT}/teams/TEAM_ID`;

const mainExample = `// Fetch portfolio data
const res = await fetch("${endpoint}");
const { title, description, projects, education, experience } = await res.json();

// Render in your app
return (
  <div>
    <h1>{title}</h1>
    <p>{description}</p>
    {education.map(edu => (
      <EducationCard key={edu.id} {...edu} />
    ))}
    {expierience.map(exp => (
      <ExperienceCard key={exp.id} {...exp} />
    ))}
    {projects.map(project => (
      <ProjectCard key={project.id} {...project} />
    ))}
  </div>
);`;

const apiExample = `{
  "id": "123456",
  "name": "My Portfolio",
  "title": "Kenneth Bass",
  "description": "A full-stack developer based in Oklahoma",
  "socials": [
    "https://github.com/dishwasher-detergent",
    "https://codepen.com/kennethbass",
    "https://linkedin.com/in/kennethtylerbass"
  ]
  "education": [...],
  "projects": [...],
  "experience": [...]
}`;

export default function Home() {
  return (
    <div className="bg-foreground text-background dark flex min-h-screen flex-col">
      <header className="bg-background text-foreground sticky top-0 z-50 flex items-center justify-between px-6 py-4">
        <h1 className="hidden text-4xl font-bold tracking-tighter lg:block">
          KURIOH.
        </h1>
        <h1 className="block text-4xl font-bold tracking-tighter lg:hidden">
          K.
        </h1>
        <div className="flex items-center gap-4">
          <Button
            variant="link"
            className="text-border-background hidden font-mono lg:block"
            asChild
          >
            <Link href="#features">Features</Link>
          </Button>
          <Button
            variant="link"
            className="text-border-background hidden font-mono lg:block"
            asChild
          >
            <Link href="#api">API</Link>
          </Button>
          <Button
            variant="link"
            className="text-border-background hidden font-mono lg:block"
            asChild
          >
            <Link href="#pricing">Pricing</Link>
          </Button>
          <Button
            variant="secondary"
            className="text-border-background rounded-none font-mono"
            asChild
          >
            <a
              href="https://github.com/dishwasher-detergent/kurioh"
              target="_blank"
            >
              Github
            </a>
          </Button>
          <Button
            className="text-background bg-foreground hover:bg-foreground/80 hover:text-background ml-4 rounded-none transition-all"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>
      <section className="bg-background text-foreground grid grid-cols-1 gap-0 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-6 lg:p-12">
          <h2 className="mb-6 text-6xl leading-none font-bold tracking-tight lg:text-8xl">
            Curate your portfolio without the hassle.
          </h2>
          <p className="mb-8 font-mono text-xl lg:text-2xl">
            A headless CMS designed specifically for portfolio websites.
          </p>
          <div className="flex gap-4">
            <Button
              className="text-background bg-foreground hover:bg-foreground/80 hover:text-background rounded-none px-8 py-6 text-lg transition-all"
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
              backgroundColor: "var(--muted)",
              fontSize: "var(--text-sm)",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {mainExample}
          </SyntaxHighlighter>
        </div>
      </section>
      <section id="features">
        <div className="p-6 lg:p-12">
          <h2 className="mb-4 text-5xl font-bold">Features</h2>
          <p className="font-mono text-xl lg:text-2xl">
            Everything you need, nothing you don&apos;t.
          </p>
        </div>
        <div className="border-background grid grid-cols-1 overflow-hidden border-t lg:grid-cols-3">
          <div className="bg-background/5 text-secondary p-6 lg:border-r lg:p-12">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold lg:text-2xl">Simple API</h3>
              <LucideCode2 className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              One endpoint, zero complexity. Build your portfolio in minutes
              with our developer-friendly API.
            </p>
          </div>
          <div className="bg-background/5 text-secondary border-t p-6 lg:border-t-0 lg:border-r lg:p-12">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold lg:text-2xl">100% Free</h3>
              <LucidePiggyBank className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              No premium tiers, no hidden costs. All features available to
              everyone, forever.
            </p>
          </div>
          <div className="bg-background/5 text-secondary border-t p-6 lg:border-t-0 lg:p-12">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-bold lg:text-2xl">
                Team Collaboration
              </h3>
              <LucideUsers className="size-6 stroke-2" />
            </div>
            <p className="font-mono">
              Invite team members to collaborate on your portfolio projects.
              Share management and editing responsibilities seamlessly.
            </p>
          </div>
        </div>
      </section>
      <section id="api" className="bg-secondary text-secondary-foreground">
        <div className="p-6 pb-0 lg:p-12 lg:pb-0">
          <h2 className="mb-4 text-3xl font-bold lg:text-5xl">
            API that just works
          </h2>
          <p className="mb-8 font-mono text-xl lg:text-2xl">
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
        <div className="p-0 lg:p-12 lg:pt-0">
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
              backgroundColor: "var(--accent)",
              fontSize: "var(--text-sm)",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {apiExample}
          </SyntaxHighlighter>
        </div>
      </section>
      <section id="pricing" className="border-background border-b p-6 lg:p-12">
        <h2 className="mb-6 text-5xl font-bold">Free. Forever.</h2>
        <p className="mb-8 font-mono text-xl lg:text-2xl">
          No credit card required. No hidden fees.
        </p>
        <Button
          className="text-foreground bg-background hover:bg-background/80 hover:text-foreground rounded-none px-8 py-6 text-lg transition-all"
          asChild
        >
          <Link href="/signup">Start free now</Link>
        </Button>
      </section>
      <footer className="">
        <div className="bg-background text-foreground flex flex-col items-start justify-between p-6 lg:flex-row lg:items-center lg:p-12">
          <div>
            <h3 className="mb-2 text-2xl font-bold">KURIOH.</h3>
            <p className="mb-2 font-mono text-sm">
              A headless CMS for portfolios.
            </p>
          </div>
          <div className="mt-6 lg:mt-0">
            <p className="font-mono text-sm">
              © {new Date().getFullYear()} Kurioh. All rights reserved.
            </p>
          </div>
        </div>
        <div className="bg-card flex items-center justify-center py-2">
          <Button variant="link" className="text-foreground font-mono" asChild>
            <a
              href="https://github.com/dishwasher-detergent/kurioh"
              target="_blank"
            >
              Github
            </a>
          </Button>
        </div>
      </footer>
    </div>
  );
}
