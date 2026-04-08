export type InterviewTool = {
  id: string
  title: string
  description: string
  href: string
  status: "available" | "coming-soon"
}

export const interviewTools: InterviewTool[] = [
  {
    id: "interview-questions",
    title: "Interview Questions",
    description:
      "Browse practical technical interview questions, or generate a random topic-based list with one click.",
    href: "/questions",
    status: "available",
  },
]
