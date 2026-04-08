export type InterviewTool = {
  id: string
  title: string
  description: string
  href: string
  status: "available" | "coming-soon"
}

export const interviewTools: InterviewTool[] = [
  {
    id: "questions-bank",
    title: "Questions Bank",
    description:
      "Browse practical technical interview questions by topic and level.",
    href: "/questions",
    status: "available",
  },
  {
    id: "questions-generator",
    title: "Questions Generator",
    description:
      "Generate a random topic-based interview question list with one click, then replace any question with another from the same topic.",
    href: "/generator",
    status: "available",
  },
]
