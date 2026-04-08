import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { interviewTools } from "@/lib/tools"

export default function Home() {
  return (
    <div className="flex flex-1 bg-background font-sans text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-muted-foreground">
            Help Me Interview
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Available interview tools
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Start with interview-ready utilities and expand your toolkit over
            time. Right now there is one tool available.
          </p>
        </section>

        <section
          aria-label="Interview tools"
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {interviewTools.map((tool) => (
            <article
              key={tool.id}
              className="flex min-h-56 flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-border px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {tool.status === "available" ? "Available" : "Coming soon"}
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{tool.title}</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>
              </div>

              <div className="pt-5">
                <Link
                  href={tool.href}
                  className={buttonVariants({ size: "lg" })}
                  aria-label={`Open ${tool.title}`}
                >
                  Open tool
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
