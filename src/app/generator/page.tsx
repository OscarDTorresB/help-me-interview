'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronDown, ChevronUp, Copy, RefreshCw, Shuffle } from 'lucide-react'
import {
  questions,
  TOPICS,
  topicColors,
  shuffleQuestions,
  copyToClipboard,
  type Level,
  type Question,
} from '@/lib/questions-data'

function CopyActionButton({
  text,
  title,
  className,
  iconClassName,
}: {
  text: string
  title: string
  className?: string
  iconClassName?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const success = await copyToClipboard(text)

    if (!success) {
      return
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className={className ?? 'h-7 w-7 p-0 text-slate-400 hover:text-slate-600 shrink-0 transition-colors'}
      title={title}
      aria-label={title}
    >
      <span className={`relative inline-flex items-center justify-center ${iconClassName ?? 'h-4 w-4'}`}>
        <Copy
          className={`absolute ${iconClassName ?? 'size-4'} transition-all duration-200 ${copied ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}
        />
        <Check
          className={`absolute ${iconClassName ?? 'size-4'} text-emerald-500 transition-all duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
        />
      </span>
    </Button>
  )
}

function GeneratedQuestionCard({
  question,
  selected,
  onToggleSelect,
  canReplace,
  onReplace,
  cardRef,
}: {
  question: Question
  selected: boolean
  onToggleSelect: () => void
  canReplace: boolean
  onReplace: () => void
  cardRef: (node: HTMLDivElement | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null)

  function showShortcutFeedback(message: string) {
    setShortcutFeedback(message)
    window.setTimeout(() => setShortcutFeedback(null), 1200)
  }

  async function handleShortcutCopy(text: string, successMessage: string, errorMessage: string) {
    const success = await copyToClipboard(text)
    showShortcutFeedback(success ? successMessage : errorMessage)
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return
    }

    if (event.key === ' ') {
      event.preventDefault()
      onToggleSelect()
      return
    }

    if (event.key === 'h' || event.key === 'H') {
      event.preventDefault()
      setOpen(openState => !openState)
      return
    }

    if (event.key === 'c' || event.key === 'C') {
      event.preventDefault()
      void handleShortcutCopy(question.q, 'Question copied', 'Failed to copy question')
      return
    }

    if (event.key === 'y' || event.key === 'Y') {
      event.preventDefault()
      void handleShortcutCopy(question.hint, 'Hint copied', 'Failed to copy hint')
    }
  }

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      data-generated-card="true"
      onKeyDown={handleCardKeyDown}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 focus-visible:border-slate-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-slate-300/70"
      aria-label="Generated question card"
    >
      <div className="space-y-4">
        {/* Topic badge and question section */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex w-full items-start justify-between gap-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${topicColors[question.topic] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
            >
              {question.topic}
            </span>
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggleSelect}
                title="Select question (Space when card is focused)"
                aria-label="Select question (Space when card is focused)"
                className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              />
              Select
            </label>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <p className="text-sm leading-relaxed text-slate-900 flex-1">{question.q}</p>
              <CopyActionButton text={question.q} title="Copy question (C)" />
            </div>
          </div>
        </div>

        {/* Hint section */}
        {open && (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-relaxed text-slate-500">
                  <span className="font-medium text-slate-600">Hint: </span>
                  {question.hint}
                </p>
              </div>
              <CopyActionButton text={question.hint} title="Copy hint (Y)" />
            </div>
          </div>
        )}

        {/* Action buttons section */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onReplace}
            disabled={!canReplace}
            className="h-7 px-2.5"
          >
            <RefreshCw className="size-3.5" />
            Replace
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setOpen(openState => !openState)}
            className="h-7 px-2.5 text-slate-500 hover:text-slate-700"
            title={`${open ? 'Hide' : 'Show'} hint (H)`}
            aria-label={`${open ? 'Hide' : 'Show'} hint (H)`}
          >
            {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            {open ? 'Hide hint' : 'Show hint'}
          </Button>
        </div>

        {shortcutFeedback && (
          <p className="text-xs font-medium text-slate-500" aria-live="polite">
            {shortcutFeedback}
          </p>
        )}
      </div>
    </div>
  )
}

export default function GeneratorPage() {
  const [generatorLevel, setGeneratorLevel] = useState<Level>('mid')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(TOPICS)
  const [questionsPerTopic, setQuestionsPerTopic] = useState(2)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])
  const generatedCardRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    generatedCardRefs.current = generatedCardRefs.current.slice(0, generatedQuestions.length)
  }, [generatedQuestions.length])

  function handleGenerate() {
    if (selectedTopics.length === 0) {
      setGeneratedQuestions([])
      setSelectedQuestionIds([])
      return
    }

    const generated: Question[] = []

    for (const selectedTopic of selectedTopics) {
      const topicQuestions = questions.filter(
        q => q.level === generatorLevel && q.topic === selectedTopic
      )

      if (topicQuestions.length === 0) continue

      const shuffled = shuffleQuestions(topicQuestions)
      const count = Math.min(questionsPerTopic, topicQuestions.length)
      generated.push(...shuffled.slice(0, count))
    }

    setGeneratedQuestions(shuffleQuestions(generated))
    setSelectedQuestionIds([])
  }

  function handleReplaceQuestion(index: number) {
    setGeneratedQuestions(currentQuestions => {
      const currentQuestion = currentQuestions[index]

      if (!currentQuestion) {
        return currentQuestions
      }

      const usedIds = new Set(currentQuestions.map(question => question.id))
      usedIds.delete(currentQuestion.id)

      const replacementPool = questions.filter(
        question =>
          question.level === generatorLevel &&
          question.topic === currentQuestion.topic &&
          question.id !== currentQuestion.id &&
          !usedIds.has(question.id)
      )

      if (replacementPool.length === 0) {
        return currentQuestions
      }

      const replacement =
        replacementPool[Math.floor(Math.random() * replacementPool.length)]

      if (!replacement) {
        return currentQuestions
      }

      const nextQuestions = [...currentQuestions]
      nextQuestions[index] = replacement
      return nextQuestions
    })
  }

  function toggleTopicSelection(selectedTopic: string) {
    setSelectedTopics(currentTopics =>
      currentTopics.includes(selectedTopic)
        ? currentTopics.filter(topicName => topicName !== selectedTopic)
        : [...currentTopics, selectedTopic]
    )
  }

  function toggleGeneratedQuestionSelection(questionId: number) {
    setSelectedQuestionIds(currentIds =>
      currentIds.includes(questionId)
        ? currentIds.filter(id => id !== questionId)
        : [...currentIds, questionId]
    )
  }

  function handleGeneratedCardsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return
    }

    const target = event.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    const activeCard = target.closest('[data-generated-card="true"]')

    if (!(activeCard instanceof HTMLDivElement)) {
      return
    }

    const currentIndex = generatedCardRefs.current.findIndex(card => card === activeCard)

    if (currentIndex < 0) {
      return
    }

    const movement = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = Math.max(0, Math.min(generatedCardRefs.current.length - 1, currentIndex + movement))

    if (nextIndex === currentIndex) {
      return
    }

    const nextCard = generatedCardRefs.current[nextIndex]

    if (!nextCard) {
      return
    }

    event.preventDefault()
    nextCard.focus()
  }

  const replaceableQuestionsByTopic = useMemo(() => {
    const counts: Record<string, number> = {}

    for (const question of questions) {
      if (question.level !== generatorLevel) {
        continue
      }

      counts[question.topic] = (counts[question.topic] ?? 0) + 1
    }

    return counts
  }, [generatorLevel])

  const selectedGeneratedQuestions = generatedQuestions.filter(question =>
    selectedQuestionIds.includes(question.id)
  )
  const levelLabel = generatorLevel === 'senior' ? 'Senior' : 'Middle'
  const selectedQuestionsExport = `${levelLabel} questions:\n${selectedGeneratedQuestions
    .map(question => `- ${question.q}`)
    .join('\n')}`

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
                Interview Questions Generator
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Generate a random interview list from selected topics, then replace any question with another from the same topic.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              {questions.filter(q => q.level === 'mid').length} middle · {questions.filter(q => q.level === 'senior').length} senior · {TOPICS.length} topics
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
          <div className="space-y-5">
            <p className="text-sm leading-6 text-slate-500">
              Choose your preferred seniority level, select topics, and set how many questions to generate per topic (1-4).
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-2">
                Seniority level
              </label>
              <div className="flex gap-2">
                {(['mid', 'senior'] as Level[]).map(lv => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setGeneratorLevel(lv)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      generatorLevel === lv
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-2">
                Questions per topic
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={questionsPerTopic}
                  onChange={e => setQuestionsPerTopic(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="min-w-fit rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-900">
                  {questionsPerTopic}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 mb-3">
                Topics
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {TOPICS.map(topicName => {
                  const isSelected = selectedTopics.includes(topicName)

                  return (
                    <button
                      key={topicName}
                      type="button"
                      onClick={() => toggleTopicSelection(topicName)}
                      aria-pressed={isSelected}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800'
                      }`}
                    >
                      {topicName}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTopics(TOPICS)}
                  className="text-xs"
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedTopics([])}
                  className="text-xs"
                >
                  Clear
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Ready to generate</p>
              <p className="mt-1">
                {selectedTopics.length === 0
                  ? 'Select at least one topic to generate questions.'
                  : `Generate ${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} × ${questionsPerTopic} question${questionsPerTopic === 1 ? '' : 's'} = ~${selectedTopics.length * questionsPerTopic} question${selectedTopics.length * questionsPerTopic === 1 ? '' : 's'}.`}
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleGenerate}
              disabled={selectedTopics.length === 0}
              className="w-full"
            >
              <Shuffle className="size-4" />
              Generate random list
            </Button>
          </div>
        </section>

        {generatedQuestions.length > 0 && (
          <section className="mb-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Random questions
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                  Your generated list
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {generatedQuestions.length} question{generatedQuestions.length === 1 ? '' : 's'} in the current list.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Keyboard shortcuts</p>
              <p className="mt-1">
                Focus a card, then use Arrow Up or Arrow Down to move between cards, Space to select, H to show or hide the hint, C to copy the question, and Y to copy the hint.
              </p>
            </div>

            <div className="flex flex-col gap-3" onKeyDown={handleGeneratedCardsKeyDown}>
              {generatedQuestions.map((generatedQuestion, index) => (
                <GeneratedQuestionCard
                  key={generatedQuestion.id}
                  question={generatedQuestion}
                  selected={selectedQuestionIds.includes(generatedQuestion.id)}
                  onToggleSelect={() => toggleGeneratedQuestionSelection(generatedQuestion.id)}
                  canReplace={(replaceableQuestionsByTopic[generatedQuestion.topic] ?? 0) > 1}
                  onReplace={() => handleReplaceQuestion(index)}
                  cardRef={node => {
                    generatedCardRefs.current[index] = node
                  }}
                />
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  {selectedGeneratedQuestions.length} selected question{selectedGeneratedQuestions.length === 1 ? '' : 's'}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedQuestionIds(generatedQuestions.map(question => question.id))}
                    disabled={generatedQuestions.length === 0}
                    title="Select all generated questions"
                    aria-label="Select all generated questions"
                  >
                    Select all questions
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedQuestionIds([])}
                    disabled={selectedGeneratedQuestions.length === 0}
                  >
                    Clear selected
                  </Button>
                </div>
              </div>

              {selectedGeneratedQuestions.length > 0 && (
                <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <CopyActionButton
                    text={selectedQuestionsExport}
                    title="Copy selected questions"
                    className="absolute right-2.5 top-2.5 h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                    iconClassName="size-4"
                  />
                  <pre className="pr-10 text-sm leading-6 text-slate-100 whitespace-pre-wrap">
                    {selectedQuestionsExport}
                  </pre>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
