'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, Copy, Search } from 'lucide-react'
import { questions, TOPICS, topicColors, copyToClipboard, type Level, type Question } from '@/lib/questions-data'

function QuestionCard({ q }: { q: Question }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
      <div className="space-y-3">
        {/* Topic badge and question section */}
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${topicColors[q.topic] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {q.topic}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-900 leading-relaxed flex-1">{q.q}</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(q.q)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 shrink-0"
                title="Copy question"
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hint section */}
        {open && (
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 leading-relaxed"><span className="font-medium text-gray-600">Hint: </span>{q.hint}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(q.hint)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 shrink-0"
                title="Copy hint"
              >
                <Copy className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {open ? 'hide hint' : 'show hint'}
        </button>
      </div>
    </div>
  )
}

export default function QuestionsPage() {
  const [level, setLevel] = useState<Level>('mid')
  const [topic, setTopic] = useState('All')
  const [search, setSearch] = useState('')

  const levelTopics = ['All', ...TOPICS.filter(t =>
    questions.some(q => q.level === level && q.topic === t)
  )]

  const filtered = questions.filter(q => {
    if (q.level !== level) return false
    if (topic !== 'All' && q.topic !== topic) return false
    if (search) {
      const s = search.toLowerCase()
      return q.q.toLowerCase().includes(s) || q.topic.toLowerCase().includes(s) || q.hint.toLowerCase().includes(s)
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(241,245,249,0.95),white_45%)] font-sans">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Help Me Interview
          </p>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                JS / TS Interview Questions Bank
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Browse and filter technical interview questions by topic and level.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {questions.filter(q => q.level === 'mid').length} middle · {questions.filter(q => q.level === 'senior').length} senior · {TOPICS.length} topics
            </p>
          </div>
        </div>

        <section>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Question bank
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                Browse and filter the full set
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {filtered.length} question{filtered.length === 1 ? '' : 's'} match your filters.
            </p>
          </div>

          <div className="mb-4 flex gap-2">
            {(['mid', 'senior'] as Level[]).map(lv => (
              <button
                key={lv}
                type="button"
                onClick={() => {
                  setLevel(lv)
                  setTopic('All')
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  level === lv
                    ? lv === 'mid'
                      ? 'border-sky-200 bg-sky-50 text-sky-800'
                      : 'border-violet-200 bg-violet-50 text-violet-800'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                {lv === 'mid' ? 'Middle' : 'Senior'}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 bg-white pl-8 text-sm"
            />
          </div>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {levelTopics.map(topicName => (
              <button
                key={topicName}
                type="button"
                onClick={() => setTopic(topicName)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  topic === topicName
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {topicName}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-slate-400">
              No questions match your filters.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map(question => (
                <QuestionCard key={question.id} q={question} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
