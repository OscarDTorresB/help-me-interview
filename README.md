# Help Me Interview

![Next.js](https://img.shields.io/badge/Next.js-16-0E7C86?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-0E7C86?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-0E7C86?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-0E7C86?style=flat-square&logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-E0762E?style=flat-square&logo=pnpm&logoColor=white)

A toolkit for people running JavaScript and TypeScript technical interviews. It ships a curated question bank and a generator that builds a random, topic-based question list on demand, so you can prep a mid or senior screen in seconds. Everything runs client side against a static, hand-written question set. No accounts, no backend, no external services.

## Features

- **Questions Bank** (`/questions`): browse and filter the full set by seniority level (Middle or Senior) and topic, with free-text search across question, topic, and hint. Every question has an expandable hint, and both question and hint can be copied with one click.
- **Questions Generator** (`/generator`): pick a level, select the topics you care about, set how many questions per topic (1 to 4), and generate a shuffled list. Replace any single question with another from the same topic and level (without repeating what is already in the list), select the ones you want, and copy them out as a plain-text block ready to paste into your notes.
- **Keyboard-first generator**: focus a card and use Arrow Up / Arrow Down to move, Space to select, H to toggle the hint, C to copy the question, and Y to copy the hint.
- **Curated content**: 98 questions across 14 topics (45 middle, 53 senior), each with a concise answer hint for the interviewer.

Topics covered: JS Core, Prototypes & OOP, Async & Event Loop, TypeScript, Error Handling, Performance & Memory, Browser & DOM, Node.js, React & Frameworks, Testing, CI/CD & Build, Architecture & Design, Code Quality & Ownership, and Collaboration & Mentoring.

## Tech stack

- **Framework**: Next.js 16 (App Router, React Server Components) with the React Compiler enabled
- **UI**: React 19, Tailwind CSS 4, shadcn components (base-nova style), Base UI, and lucide-react icons
- **Language**: TypeScript 5
- **Tooling**: pnpm, ESLint 9 with `eslint-config-next`
- **Fonts**: Geist, Geist Mono, and Inter via `next/font`

## Getting started

This project uses pnpm.

```bash
# install dependencies
pnpm install

# start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

No environment variables are required.

### Other scripts

```bash
pnpm build   # production build
pnpm start   # serve the production build
pnpm lint    # run ESLint
```

## Project structure

```
src/
  app/
    layout.tsx          # root layout, fonts, navbar
    page.tsx            # home, lists the available tools
    questions/page.tsx  # Questions Bank: filter, search, browse
    generator/page.tsx  # Questions Generator: build and export a list
    globals.css         # Tailwind and theme tokens
  components/
    navbar.tsx          # top nav with a tools dropdown
    ui/                 # shadcn primitives (button, input)
  lib/
    questions-data.ts   # the question set, topics, and helpers
    tools.ts            # tool registry driving the home page and nav
    utils.ts            # cn helper
```

## Adding questions

The full question set lives in `src/lib/questions-data.ts` as a typed array. Each entry has an `id`, a `level` (`mid` or `senior`), a `topic`, the question text (`q`), and an interviewer `hint`. Add a new object with a unique `id` and an existing topic, and it flows through both the bank and the generator automatically.
