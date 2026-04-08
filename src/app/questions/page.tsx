'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp, RefreshCw, Search, Shuffle } from 'lucide-react'

type Level = 'mid' | 'senior'

interface Question {
  id: number
  level: Level
  topic: string
  q: string
  hint: string
}

const questions: Question[] = [
  // JS Core
  { id: 1, level: 'mid', topic: 'JS Core', q: 'What is a closure and when is it created?', hint: 'A function that captures variables from its outer lexical scope. Created every time a function is defined inside another function — the inner function "closes over" the outer variables.' },
  { id: 2, level: 'mid', topic: 'JS Core', q: 'What is the difference between var, let, and const in terms of scoping and hoisting?', hint: 'var is function-scoped and hoisted as undefined. let/const are block-scoped and have a temporal dead zone. const additionally prevents reassignment (but not mutation of objects/arrays).' },
  { id: 3, level: 'mid', topic: 'JS Core', q: 'What is the temporal dead zone (TDZ)?', hint: 'The period between entering a block scope and the let/const declaration being evaluated. Accessing the variable during this window throws a ReferenceError even though the declaration was hoisted.' },
  { id: 4, level: 'mid', topic: 'JS Core', q: 'What is the difference between a regular function and an arrow function regarding this binding?', hint: 'Arrow functions capture this lexically from the enclosing scope at definition time. Regular functions bind this dynamically at call time — influenced by how the function is called (call, apply, new, method call).' },
  { id: 5, level: 'mid', topic: 'JS Core', q: 'What does the new keyword do step by step?', hint: '(1) Creates an empty object. (2) Sets its [[Prototype]] to Constructor.prototype. (3) Executes the constructor with this bound to the new object. (4) Returns the object (unless the constructor explicitly returns another object).' },
  { id: 6, level: 'mid', topic: 'JS Core', q: 'What is the difference between == and ===? When does implicit coercion happen?', hint: '=== never coerces types. == follows the Abstract Equality Comparison algorithm, which converts types (e.g. null==undefined is true, "1"==1 is true via ToNumber). Prefer === to avoid surprises.' },
  { id: 7, level: 'mid', topic: 'JS Core', q: 'What are the falsy values in JavaScript?', hint: 'Exactly eight: false, 0, -0, 0n, "" (empty string), null, undefined, NaN. Everything else is truthy — including "0", [], and {}.' },
  { id: 8, level: 'mid', topic: 'JS Core', q: 'What is a higher-order function?', hint: 'A function that takes another function as an argument or returns a function. Core to functional programming in JS. Examples: map, filter, reduce, setTimeout (takes a callback).' },
  { id: 9, level: 'mid', topic: 'JS Core', q: 'What does the spread operator do and how does it differ from Object.assign?', hint: 'Both perform shallow copies. Spread ({...a, ...b}) is syntax sugar. Object.assign also triggers setters on the target. Neither does deep cloning.' },
  { id: 10, level: 'senior', topic: 'JS Core', q: 'How can closures cause memory leaks and how do you prevent them?', hint: 'Long-lived closures (event listeners, timers) hold references to their outer scope, preventing GC. Fix: remove listeners on cleanup, nullify captured references, avoid capturing large objects unnecessarily.' },
  { id: 11, level: 'senior', topic: 'JS Core', q: 'What is tail call optimization (TCO) and does JavaScript actually support it?', hint: 'TCO allows recursive calls in tail position to reuse the current stack frame (O(1) stack). ES6 specifies it, but only JavaScriptCore (Safari) implements it — V8 does not, so deep recursion still risks stack overflow.' },
  { id: 12, level: 'senior', topic: 'JS Core', q: 'What is function currying vs partial application and where would you apply each?', hint: 'Currying transforms f(a,b,c) into f(a)(b)(c) — useful for point-free pipelines. Partial application fixes some arguments returning a function with fewer params — useful for specializing generic utilities without full currying.' },

  // Prototypes & OOP
  { id: 13, level: 'mid', topic: 'Prototypes & OOP', q: 'How does prototypal inheritance work in JavaScript?', hint: 'Every object has an internal [[Prototype]] reference. Property lookup walks the chain until found or the chain ends at null. Mutation of the prototype is reflected immediately in all instances.' },
  { id: 14, level: 'mid', topic: 'Prototypes & OOP', q: 'What is the difference between __proto__ and prototype?', hint: 'prototype is a property on constructor functions (used as the [[Prototype]] for instances). __proto__ (or Object.getPrototypeOf) is the internal link on instances pointing to their constructor\'s prototype.' },
  { id: 15, level: 'mid', topic: 'Prototypes & OOP', q: 'What problem does the Factory pattern solve and how is it implemented in JS?', hint: 'Factory abstracts object creation without exposing constructor details or requiring new. Returns plain objects — useful for creating objects with shared shape but private state via closures.' },
  { id: 16, level: 'senior', topic: 'Prototypes & OOP', q: 'What is the difference between classical and prototypal inheritance at runtime?', hint: 'Classical (Java-style) copies behavior at instantiation. Prototypal delegates to the prototype at runtime — changes to the prototype are reflected in all instances immediately. JS class syntax is syntactic sugar over prototypal delegation.' },
  { id: 17, level: 'senior', topic: 'Prototypes & OOP', q: 'What are property descriptors and how do Object.defineProperty and Object.freeze work internally?', hint: 'Descriptors control writable, enumerable, configurable, get/set per property. freeze makes all own properties non-writable and non-configurable and prevents adding new properties — but it is shallow, not recursive.' },
  { id: 18, level: 'senior', topic: 'Prototypes & OOP', q: 'When would you favor composition over inheritance and what problems do deep class hierarchies cause?', hint: 'Deep hierarchies create tight coupling and the fragile base class problem — changes to a parent break all children. Composition via mixins or object composition is more flexible and testable (favor "has-a" over "is-a").' },
  { id: 19, level: 'senior', topic: 'Prototypes & OOP', q: 'What is the Observer pattern and how does Node.js EventEmitter implement it?', hint: 'Observer defines a one-to-many dependency. EventEmitter holds a map of event names to listener arrays; emit iterates and calls each synchronously. Important: not the same as async pub/sub — listeners block the emitter.' },

  // Async & Event Loop
  { id: 20, level: 'mid', topic: 'Async & Event Loop', q: 'What is the event loop and how does it interact with the call stack, task queue, and microtask queue?', hint: 'Call stack runs sync code. When empty, the event loop drains the entire microtask queue (Promises, queueMicrotask) first, then processes one macrotask (setTimeout, I/O) and repeats.' },
  { id: 21, level: 'mid', topic: 'Async & Event Loop', q: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?', hint: 'all: rejects on first rejection. allSettled: always resolves with all outcomes. race: resolves/rejects with the first to settle. any: resolves with first fulfillment, rejects only if all reject (AggregateError).' },
  { id: 22, level: 'mid', topic: 'Async & Event Loop', q: 'What are the pitfalls of using async/await inside forEach loops?', hint: 'forEach ignores returned Promises — the loop finishes synchronously before any awaited work completes. Use for...of for serial execution or Promise.all(array.map(async ...)) for parallel execution.' },
  { id: 23, level: 'senior', topic: 'Async & Event Loop', q: 'How does async/await work under the hood in terms of generators and the event loop?', hint: 'async functions are syntactic sugar over Promises. await suspends the function by scheduling a microtask continuation and returning control to the caller. Conceptually equivalent to generator + Promise.resolve().then(resume).' },
  { id: 24, level: 'senior', topic: 'Async & Event Loop', q: 'What is the difference between concurrency and parallelism in JavaScript\'s single-threaded model?', hint: 'JS achieves concurrency via cooperative multitasking — tasks interleave through the event loop but never run simultaneously on the main thread. True parallelism requires Web Workers or Worker Threads (separate OS threads).' },
  { id: 25, level: 'senior', topic: 'Async & Event Loop', q: 'What is backpressure in streams and how is it handled in Node.js?', hint: 'Backpressure occurs when a writable stream cannot process data as fast as it arrives. Node.js signals this via write() returning false; producers should pause and resume on the "drain" event to avoid unbounded memory growth.' },

  // TypeScript
  { id: 26, level: 'mid', topic: 'TypeScript', q: 'What is the difference between interface and type alias in TypeScript?', hint: 'Both describe object shapes. Interfaces support declaration merging and are extendable via extends. Type aliases support unions, intersections, mapped types, and conditional types. Prefer interface for public API shapes.' },
  { id: 27, level: 'mid', topic: 'TypeScript', q: 'What is the difference between unknown and any?', hint: 'any opts out of type checking entirely — unsafe. unknown is type-safe: you must narrow it (typeof, instanceof, type guard) before using it. Use unknown when a type is genuinely not known upfront.' },
  { id: 28, level: 'mid', topic: 'TypeScript', q: 'What are generics and why are they useful?', hint: 'Generics allow writing reusable, type-safe functions/classes that work across many types without losing type information. e.g. function identity<T>(x: T): T preserves the specific type through the call.' },
  { id: 29, level: 'mid', topic: 'TypeScript', q: 'What is a type guard and what are the different ways to write one?', hint: 'Type guards narrow a union type within a conditional block. Built-in: typeof, instanceof, in. Custom: user-defined type predicates (param is Type), assertion functions (asserts param is Type).' },
  { id: 30, level: 'mid', topic: 'TypeScript', q: 'What is the difference between structural and nominal typing and which does TypeScript use?', hint: 'Structural: two types with the same shape are compatible regardless of name (duck typing). Nominal: identity/name matters. TypeScript is structural — useful for interop but can allow unintended assignability.' },
  { id: 31, level: 'senior', topic: 'TypeScript', q: 'What are conditional types and how does infer work inside them?', hint: 'Conditional types: T extends U ? X : Y. infer introduces a type variable capturing part of the matched type. Used to extract return types (ReturnType), unwrap Promises, infer tuple element types, etc.' },
  { id: 32, level: 'senior', topic: 'TypeScript', q: 'What are mapped types and template literal types? Give an example of combining them.', hint: 'Mapped types iterate over keys: { [K in keyof T]: ... }. Template literals enable string manipulation at the type level. Combined: type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }.' },
  { id: 33, level: 'senior', topic: 'TypeScript', q: 'What is the difference between covariance and contravariance and how does TypeScript handle them in function types?', hint: 'Return types are covariant (narrower subtypes are safe). Parameter types are contravariant (wider supertypes are safe for substitutability). TypeScript has bivariant function params by default; --strictFunctionTypes enables proper contravariance.' },
  { id: 34, level: 'senior', topic: 'TypeScript', q: 'What are declaration files (.d.ts) and when would you author one?', hint: 'Declaration files provide type information for JS code without shipping TS source. You would write one when publishing a JS library, consuming an untyped module (@types/ not available), or augmenting existing types via module augmentation.' },
  { id: 35, level: 'senior', topic: 'TypeScript', q: 'How would you design a fully type-safe event emitter in TypeScript?', hint: 'Define an events map type (Events extends Record<string, unknown>). Overload on/emit so the event name type narrows the payload type automatically. This catches mismatches at compile time with no runtime overhead.' },

  // Error Handling & Observability
  { id: 36, level: 'mid', topic: 'Error Handling', q: 'What is the difference between throwing an Error and rejecting a Promise, and how does each propagate?', hint: 'Thrown errors propagate synchronously up the call stack and are caught by try/catch. Rejected Promises propagate asynchronously through .catch() chains or try/catch inside async functions.' },
  { id: 37, level: 'mid', topic: 'Error Handling', q: 'What happens if you don\'t handle a rejected Promise?', hint: 'In browsers it fires the window "unhandledrejection" event. In Node.js 15+ it throws an unhandled exception and crashes the process by default. Always handle or propagate rejections explicitly.' },
  { id: 38, level: 'senior', topic: 'Error Handling', q: 'How would you implement a global error boundary strategy in a large frontend application?', hint: 'Combine React Error Boundaries (render errors), window.onerror + window.onunhandledrejection (async/global errors), and a centralized error reporter sending to an observability platform like Sentry or Datadog.' },
  { id: 39, level: 'senior', topic: 'Error Handling', q: 'What is structured logging and why is it preferable to console.log in production?', hint: 'Structured logging emits JSON with consistent fields (timestamp, level, traceId, userId, message). Makes logs machine-parseable and queryable in log aggregators (ELK, Datadog, GCP Logging) vs unstructured free-text.' },
  { id: 40, level: 'senior', topic: 'Error Handling', q: 'What are distributed traces and how do correlation IDs help debug cross-service issues?', hint: 'Distributed tracing (OpenTelemetry, Jaeger) tracks a request across services as a tree of spans. A trace/correlation ID propagated in HTTP headers lets you reconstruct the full call graph and pinpoint which service failed.' },
  { id: 41, level: 'senior', topic: 'Error Handling', q: 'What makes an alert actionable and how would you reduce alert fatigue in a production system?', hint: 'Actionable alerts are specific, have runbooks, distinguish symptoms from causes, and have clear ownership. Reduce fatigue by: tuning thresholds, grouping related alerts, suppressing known flapping, using anomaly detection over static limits.' },

  // Performance & Memory
  { id: 42, level: 'mid', topic: 'Performance & Memory', q: 'What is the difference between debouncing and throttling and when would you use each?', hint: 'Debounce delays execution until N ms after the last call — ideal for search inputs (fire after typing stops). Throttle limits to one call per N ms — ideal for scroll/resize handlers (fire periodically, not on every event).' },
  { id: 43, level: 'mid', topic: 'Performance & Memory', q: 'What causes layout thrashing in the browser and how do you avoid it?', hint: 'Reading layout properties (offsetHeight, getBoundingClientRect) after DOM writes forces a synchronous reflow. Fix: batch all reads before writes, or use requestAnimationFrame to schedule writes in the next paint cycle.' },
  { id: 44, level: 'senior', topic: 'Performance & Memory', q: 'How would you profile a memory leak in a Node.js application?', hint: 'Start with --inspect and take heap snapshots in Chrome DevTools at intervals. Compare retained objects between snapshots — growing collections or closures holding large references indicate leaks. clinic.js heap is also useful.' },
  { id: 45, level: 'senior', topic: 'Performance & Memory', q: 'What are V8 hidden classes and how can dynamic property addition hurt performance?', hint: 'V8 assigns a "shape" (hidden class) per object structure. Adding properties in a different order per instance causes shape branching, preventing the JIT compiler from generating efficient property-access code for that shape.' },
  { id: 46, level: 'senior', topic: 'Performance & Memory', q: 'What is the difference between a minor GC (Scavenge) and a major GC (Mark-Sweep/Compact) in V8?', hint: 'Minor GC collects short-lived objects in the young generation — fast and frequent. Major GC collects the old generation — slower, triggered by memory pressure. Long major GC pauses cause jank; use smaller allocations and avoid long-lived large objects.' },
  { id: 47, level: 'senior', topic: 'Performance & Memory', q: 'What are WeakRef and FinalizationRegistry and what use cases do they enable?', hint: 'WeakRef holds an object without preventing GC; deref() returns the object or undefined if collected. FinalizationRegistry runs a callback after collection. Used for optional caches. Behavior is non-deterministic — not a substitute for explicit cleanup.' },

  // Browser & DOM
  { id: 48, level: 'mid', topic: 'Browser & DOM', q: 'What is event delegation and why is it more efficient than per-element listeners?', hint: 'Attach one listener to a common ancestor; use event.target to identify the source element. Reduces total listener count, and works automatically for dynamically added elements without re-attaching listeners.' },
  { id: 49, level: 'mid', topic: 'Browser & DOM', q: 'What is the difference between event.stopPropagation and event.preventDefault?', hint: 'stopPropagation stops the event from bubbling up (or capturing down) the DOM tree. preventDefault cancels the browser\'s default action (link navigation, form submit) but does not stop propagation.' },
  { id: 50, level: 'mid', topic: 'Browser & DOM', q: 'What is the difference between localStorage, sessionStorage, and cookies?', hint: 'localStorage persists indefinitely per origin. sessionStorage is tab-scoped and cleared on close. Cookies are sent to the server on every request and support expiry, domain/path scoping, HttpOnly, and Secure flags.' },
  { id: 51, level: 'senior', topic: 'Browser & DOM', q: 'What is the Critical Rendering Path and which steps can you optimize?', hint: 'HTML → DOM + CSSOM → Render Tree → Layout → Paint → Composite. Optimizations: defer/async non-critical scripts, inline critical CSS, avoid render-blocking resources, reduce layout-triggering style changes, minimize CLS.' },
  { id: 52, level: 'senior', topic: 'Browser & DOM', q: 'What are Web Workers and SharedArrayBuffer used for, and what constraints do they have?', hint: 'Workers run JS in a separate thread with no DOM access; communicate via postMessage (structured clone). SharedArrayBuffer enables shared memory with Atomics for synchronization — requires cross-origin isolation (COOP + COEP headers).' },
  { id: 53, level: 'senior', topic: 'Browser & DOM', q: 'What is the Intersection Observer API and how does it outperform scroll event listeners for lazy loading?', hint: 'IntersectionObserver is asynchronous and off the main thread; fires when elements enter/exit the viewport. Scroll listeners are synchronous, block the main thread, and force layout if they read geometry — causing jank.' },

  // Node.js Internals
  { id: 54, level: 'mid', topic: 'Node.js', q: 'What is the difference between process.nextTick and setImmediate?', hint: 'nextTick fires before any I/O events in the current event loop iteration — it can starve I/O if called recursively. setImmediate fires in the check phase, after I/O callbacks, in the next iteration.' },
  { id: 55, level: 'mid', topic: 'Node.js', q: 'What is the module caching mechanism in Node.js CommonJS?', hint: 'After the first require(), the module is cached by its resolved filename. Subsequent requires return the same exports object — side effects and initialization run only once. Circular requires return the partially-built exports.' },
  { id: 56, level: 'senior', topic: 'Node.js', q: 'What is the Node.js cluster module and how does it differ from Worker Threads?', hint: 'Cluster forks separate OS processes each with their own event loop — ideal for HTTP servers to use all CPU cores. Worker Threads share memory within one process — better for CPU-bound tasks needing shared state (e.g. image processing).' },
  { id: 57, level: 'senior', topic: 'Node.js', q: 'What is libuv and what role does it play in Node.js\'s async I/O model?', hint: 'libuv is the C library implementing the event loop, thread pool (for file system, DNS, crypto), and platform-specific async I/O (epoll, kqueue, IOCP). Node\'s JS APIs are thin bindings over libuv — JS never does I/O directly.' },

  // React & Frameworks
  { id: 58, level: 'mid', topic: 'React & Frameworks', q: 'What is the virtual DOM and how does React use reconciliation to update the real DOM?', hint: 'The vDOM is an in-memory object tree. On state change, React creates a new vDOM, diffs it against the previous (reconciliation using the Fiber algorithm), and applies only the minimal set of real DOM mutations.' },
  { id: 59, level: 'mid', topic: 'React & Frameworks', q: 'What is the difference between controlled and uncontrolled components in React?', hint: 'Controlled: React drives the value via state and onChange — single source of truth. Uncontrolled: the DOM manages state, accessed via refs. Controlled is more predictable; uncontrolled is simpler for file inputs and non-critical fields.' },
  { id: 60, level: 'mid', topic: 'React & Frameworks', q: 'What are common mistakes with useEffect\'s dependency array?', hint: 'Missing deps cause stale closures — the effect uses old values. Over-specifying causes unnecessary reruns. Objects/functions as deps cause infinite loops if recreated each render. Use useCallback/useMemo to stabilize references.' },
  { id: 61, level: 'mid', topic: 'React & Frameworks', q: 'What is the difference between useState and useReducer?', hint: 'useState is simpler for isolated values. useReducer is better when next state depends on previous, or when multiple values update together in response to actions — it also makes state transitions more explicit and testable.' },
  { id: 62, level: 'mid', topic: 'React & Frameworks', q: 'What problem does React Context solve and what are its performance limitations?', hint: 'Context avoids prop-drilling for cross-cutting state. Limitation: every consumer re-renders when the context value changes, even if they only care about part of it. Mitigate by splitting contexts or using a state manager with selectors.' },
  { id: 63, level: 'mid', topic: 'React & Frameworks', q: 'What is the difference between CSR, SSR, and SSG?', hint: 'CSR: JS builds UI in the browser (slow FCP, great interactivity). SSR: server renders HTML per-request (fast FCP, server load). SSG: HTML pre-rendered at build time (fastest, limited to content known at build time). ISR blends SSG and SSR.' },
  { id: 64, level: 'senior', topic: 'React & Frameworks', q: 'What is React Fiber and what problem did it solve over the original stack reconciler?', hint: 'Fiber rewrote reconciliation using a linked-list work unit architecture, making it interruptible. This enables concurrent rendering — React can pause, prioritize, or abort work — enabling useTransition, Suspense, and avoiding dropped frames.' },
  { id: 65, level: 'senior', topic: 'React & Frameworks', q: 'What is the difference between Redux and React Query/SWR and how do you decide which to use?', hint: 'Redux is a general-purpose client state manager. React Query/SWR are purpose-built for server state (fetching, caching, invalidation, background sync). Mixing them for server state is an anti-pattern — use each for what it is designed for.' },
  { id: 66, level: 'senior', topic: 'React & Frameworks', q: 'What is code splitting and how does React.lazy with Suspense implement it?', hint: 'Code splitting breaks the JS bundle into chunks loaded on demand. React.lazy(() => import(...)) dynamically imports a component; Suspense shows a fallback while loading. Route-level splitting has the highest impact-to-effort ratio.' },
  { id: 67, level: 'senior', topic: 'React & Frameworks', q: 'How does React\'s concurrent mode change the rendering model and what new patterns does it enable?', hint: 'Concurrent mode makes rendering interruptible. Enables: useTransition (mark updates as non-urgent to avoid blocking), useDeferredValue (debounce expensive derived state), and Suspense for async data — improving perceived performance.' },
  { id: 68, level: 'senior', topic: 'React & Frameworks', q: 'What are the architectural trade-offs between micro-frontend approaches: module federation, iframes, and web components?', hint: 'Module federation: live code sharing, great DX, but version coupling risk. iframes: strong isolation, poor UX integration, CSP complexity. Web components: standards-based, poor React/TS interop. Choice depends on team autonomy vs integration needs.' },

  // Testing
  { id: 69, level: 'mid', topic: 'Testing', q: 'What is the difference between unit, integration, and end-to-end tests?', hint: 'Unit: one function/class in isolation with mocks. Integration: multiple modules working together. E2E: full system through a real browser. The testing pyramid advocates many unit, fewer integration, minimal E2E — for speed and reliability.' },
  { id: 70, level: 'mid', topic: 'Testing', q: 'What is the difference between a mock, a stub, and a spy?', hint: 'Stub: replaces a function with a fixed return value — controls dependencies. Mock: stub that also asserts on how it was called. Spy: wraps the real implementation and records calls without replacing behavior.' },
  { id: 71, level: 'mid', topic: 'Testing', q: 'Why does Testing Library recommend querying by role or label rather than by class or test ID?', hint: 'Role/label queries mirror how users and assistive technologies interact with UI — making tests resilient to implementation changes and incidentally enforcing good accessibility. Class-based queries test implementation details, not behavior.' },
  { id: 72, level: 'mid', topic: 'Testing', q: 'What is code coverage and what are its limitations as a quality metric?', hint: '100% coverage means all lines were executed — not that they were tested meaningfully. Coverage does not verify correctness, catch missing test cases, or guarantee edge cases are covered. It is a floor, not a ceiling.' },
  { id: 73, level: 'senior', topic: 'Testing', q: 'What is the difference between TDD and BDD and when would you apply each?', hint: 'TDD: write failing unit test → make it pass → refactor (inside-out, developer-centric). BDD: write human-readable Given/When/Then scenarios driving behavior from the user/domain perspective. BDD suits feature specs; TDD suits implementation design.' },
  { id: 74, level: 'senior', topic: 'Testing', q: 'How would you design a testing strategy for a large frontend codebase from scratch?', hint: 'Define pyramid ratios, identify critical user paths for E2E, set coverage targets by module risk, establish mocking conventions (MSW for API), separate environments (unit in-process, E2E against staging), add CI quality gates.' },
  { id: 75, level: 'senior', topic: 'Testing', q: 'What causes test flakiness and how would you systematically address it in CI?', hint: 'Causes: timing/async issues, shared mutable state, external service dependencies, non-deterministic data. Fixes: deterministic factories, test isolation, retry with quarantine, async wait utilities (waitFor), stable selectors, seeded randomness.' },
  { id: 76, level: 'senior', topic: 'Testing', q: 'What is contract testing and how does it differ from integration testing?', hint: 'Contract testing verifies two services agree on an API shape (e.g. Pact) without running both simultaneously. Integration tests run both and verify behavior end-to-end. Contracts scale better in microservice architectures — faster, no orchestration needed.' },

  // CI/CD & Build
  { id: 77, level: 'mid', topic: 'CI/CD & Build', q: 'What stages would you include in a CI pipeline for a frontend project and why?', hint: 'Lint → type-check → unit tests → build → integration/E2E tests → artifact upload. Fail fast: put cheapest checks first. Each stage should be independently cacheable. Parallel where possible.' },
  { id: 78, level: 'mid', topic: 'CI/CD & Build', q: 'What is the difference between continuous delivery and continuous deployment?', hint: 'Continuous delivery: every passing build is releasable, but deploy is a manual decision. Continuous deployment: every passing build deploys to production automatically. CD requires robust automated test gates to be safe.' },
  { id: 79, level: 'mid', topic: 'CI/CD & Build', q: 'What is a bundle analyzer and what would you look for when optimizing a build?', hint: 'Tools like webpack-bundle-analyzer visualize chunk sizes. Look for: duplicated dependencies across chunks, unexpectedly large vendor bundles, missing route-level code splits, and polyfills for already-supported browser features.' },
  { id: 80, level: 'senior', topic: 'CI/CD & Build', q: 'What are feature flags and how do they decouple deployment from release?', hint: 'Feature flags let code be deployed to production but only activated for specific users/cohorts via config. Decouples deploy (code ships) from release (users see it) — enabling dark launches, A/B tests, and instant rollback without redeploying.' },
  { id: 81, level: 'senior', topic: 'CI/CD & Build', q: 'What is a blue-green deployment and what are its trade-offs?', hint: 'Two identical environments run in parallel; traffic switches atomically from old (blue) to new (green). Gives zero-downtime deploys and instant rollback by switching traffic back. Trade-off: doubles infrastructure cost and requires DB migration compatibility.' },
  { id: 82, level: 'senior', topic: 'CI/CD & Build', q: 'How would you implement a performance budget in a CI pipeline?', hint: 'Use tools like Lighthouse CI, bundlesize, or size-limit to assert thresholds (e.g. main bundle < 200kb, LCP < 2.5s) as CI gates. Failing the budget blocks the merge — preventing gradual performance regression.' },
  { id: 83, level: 'senior', topic: 'CI/CD & Build', q: 'What is immutable infrastructure and how does it apply to frontend deployments?', hint: 'Immutable: never modify deployed artifacts — replace them. In frontend: content-hashed assets are uploaded to CDN with long cache TTL; a new deploy uploads new hashes; the HTML entry point (short TTL) points to new hashes. Enables instant rollback.' },

  // Architecture & Design
  { id: 84, level: 'senior', topic: 'Architecture & Design', q: 'What is the principle of least privilege and how does it apply to frontend security?', hint: 'Request only the permissions and data access you need. In frontend: minimal OAuth scopes, no secrets in client code, Content Security Policy to limit script execution, HttpOnly cookies for auth tokens to prevent XSS theft.' },
  { id: 85, level: 'senior', topic: 'Architecture & Design', q: 'What are module boundaries and why do they matter in a large codebase?', hint: 'Module boundaries define what is public API vs internal implementation. Clear boundaries prevent tight coupling, enable teams to work independently, make refactoring safer, and are the foundation of scalable monorepos (e.g. via Nx or Turborepo).' },
  { id: 86, level: 'senior', topic: 'Architecture & Design', q: 'What is the strangler fig pattern and when would you use it for a frontend migration?', hint: 'Gradually replace a legacy system by routing new features to the new implementation while the old one still runs. In frontend: a shell app can route by URL prefix — new routes go to the new framework, old routes to the legacy app.' },
  { id: 87, level: 'senior', topic: 'Architecture & Design', q: 'What are the trade-offs between a monorepo and a polyrepo for a frontend platform?', hint: 'Monorepo: atomic cross-package changes, shared tooling, easier code reuse — but complex CI and tooling overhead. Polyrepo: independent deploys and autonomy — but versioning hell, duplicated tooling, and harder cross-team refactors.' },
  { id: 88, level: 'senior', topic: 'Architecture & Design', q: 'How would you approach designing a scalable client-side data layer for a complex SPA?', hint: 'Separate server state (React Query, Apollo) from client/UI state (Zustand, Context). Normalize data to avoid duplication. Define clear cache invalidation rules. Optimistic updates with rollback for UX. Avoid storing derived state.' },

  // Code Quality & Ownership
  { id: 89, level: 'mid', topic: 'Code Quality & Ownership', q: 'What makes a good pull request description and why does it matter?', hint: 'A good PR description explains why the change is needed (context), what was changed, and how to test it. It accelerates review, creates a historical record, and reduces back-and-forth — especially important in async/remote teams.' },
  { id: 90, level: 'mid', topic: 'Code Quality & Ownership', q: 'What is the difference between a linter and a formatter and how do they complement each other?', hint: 'Linters (ESLint) catch code quality issues and potential bugs by analyzing AST patterns. Formatters (Prettier) enforce consistent code style purely mechanically. Together they eliminate style debates in reviews and catch real errors automatically.' },
  { id: 91, level: 'mid', topic: 'Code Quality & Ownership', q: 'What is the Boy Scout Rule in software development?', hint: 'Leave the code cleaner than you found it. Make small, incremental improvements as you work — fix a confusing name, add a missing test, extract a utility function. Prevents codebase entropy without requiring dedicated refactor sprints.' },
  { id: 92, level: 'senior', topic: 'Code Quality & Ownership', q: 'How would you approach a large-scale refactor of a critical module without breaking production?', hint: 'Characterize with tests first. Use the strangler fig — introduce the new implementation alongside the old, migrate call sites incrementally, use feature flags to control exposure. Keep both in sync during migration. Delete old code only when coverage confirms.' },
  { id: 93, level: 'senior', topic: 'Code Quality & Ownership', q: 'What is technical debt and how do you make the case for paying it down to non-technical stakeholders?', hint: 'Technical debt is deferred work that makes future changes slower and riskier. Frame it in business terms: velocity decrease, incident rate, onboarding time, and feature delivery risk — not code aesthetics. Propose specific, scoped paydown tied to product goals.' },
  { id: 94, level: 'senior', topic: 'Code Quality & Ownership', q: 'What are the qualities of an effective code review and what anti-patterns should reviewers avoid?', hint: 'Good reviews: explain the why, suggest alternatives, distinguish blocking from non-blocking, ask questions rather than demanding. Anti-patterns: nitpicking style (use a formatter), rubber-stamping, blocking on personal preferences, not approving due to scope creep.' },

  // Collaboration & Mentoring
  { id: 95, level: 'senior', topic: 'Collaboration & Mentoring', q: 'How do you approach mentoring a junior developer without creating dependency?', hint: 'Guide with questions rather than answers. Set up pair programming with role rotation. Review their PRs constructively. Assign increasing ownership with safety nets. Goal: build their judgment, not their reliance on yours.' },
  { id: 96, level: 'senior', topic: 'Collaboration & Mentoring', q: 'How would you handle a technical disagreement with a senior peer about an architectural decision?', hint: 'Separate the problem from the person. Articulate trade-offs clearly (data helps). Propose a spike or prototype to de-risk uncertainty. Disagree and commit once a decision is made. Escalate only if the decision risks users or the team.' },
  { id: 97, level: 'senior', topic: 'Collaboration & Mentoring', q: 'What does "owning a feature" mean beyond just writing the code?', hint: 'Owning means: clarifying requirements, designing the solution, writing tests, handling edge cases, monitoring after deploy, documenting, and being accountable for incidents. It is the full lifecycle, not just the PR.' },
  { id: 98, level: 'senior', topic: 'Collaboration & Mentoring', q: 'How do you maintain architectural consistency across a team that moves fast?', hint: 'Lightweight Architecture Decision Records (ADRs) to document key decisions. Shared linting/formatting rules enforced in CI. Regular design review sessions. Agreed patterns documented in a team handbook. Automated guards (module boundary rules via Nx) where possible.' },
]

const TOPICS = [...new Set(questions.map(q => q.topic))]

function shuffleQuestions(pool: Question[]) {
  const shuffled = [...pool]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function getReplacementQuestion(level: Level, topic: string, currentId: number) {
  const replacementPool = questions.filter(
    question =>
      question.level === level && question.topic === topic && question.id !== currentId
  )

  if (replacementPool.length === 0) {
    return null
  }

  return replacementPool[Math.floor(Math.random() * replacementPool.length)]
}

const topicColors: Record<string, string> = {
  'JS Core': 'bg-amber-50 text-amber-800 border-amber-200',
  'Prototypes & OOP': 'bg-orange-50 text-orange-800 border-orange-200',
  'Async & Event Loop': 'bg-blue-50 text-blue-800 border-blue-200',
  'TypeScript': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Error Handling': 'bg-red-50 text-red-800 border-red-200',
  'Performance & Memory': 'bg-green-50 text-green-800 border-green-200',
  'Browser & DOM': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'Node.js': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'React & Frameworks': 'bg-sky-50 text-sky-800 border-sky-200',
  'Testing': 'bg-violet-50 text-violet-800 border-violet-200',
  'CI/CD & Build': 'bg-pink-50 text-pink-800 border-pink-200',
  'Architecture & Design': 'bg-slate-100 text-slate-800 border-slate-300',
  'Code Quality & Ownership': 'bg-teal-50 text-teal-800 border-teal-200',
  'Collaboration & Mentoring': 'bg-rose-50 text-rose-800 border-rose-200',
}

function QuestionCard({ q }: { q: Question }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-2 flex-wrap">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${topicColors[q.topic] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          {q.topic}
        </span>
        <p className="text-sm text-gray-900 leading-relaxed flex-1 min-w-50">{q.q}</p>
      </div>
      {open && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed"><span className="font-medium text-gray-600">Hint: </span>{q.hint}</p>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {open ? 'hide hint' : 'show hint'}
      </button>
    </div>
  )
}

function GeneratedQuestionCard({
  question,
  canReplace,
  onReplace,
}: {
  question: Question
  canReplace: boolean
  onReplace: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex items-start gap-3">
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${topicColors[question.topic] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}
        >
          {question.topic}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-slate-900">{question.q}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
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
            >
              {open ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
              {open ? 'Hide hint' : 'Show hint'}
            </Button>
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-medium text-slate-600">Hint: </span>
            {question.hint}
          </p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [level, setLevel] = useState<Level>('mid')
  const [topic, setTopic] = useState('All')
  const [search, setSearch] = useState('')
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [generatorLevel, setGeneratorLevel] = useState<Level>('mid')
  const [selectedTopics, setSelectedTopics] = useState<string[]>(TOPICS)
  const [questionsPerTopic, setQuestionsPerTopic] = useState(2)
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([])

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

  function handleGenerate() {
    if (selectedTopics.length === 0) {
      setGeneratedQuestions([])
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
  }

  function handleReplaceQuestion(index: number) {
    setGeneratedQuestions(currentQuestions => {
      const currentQuestion = currentQuestions[index]

      if (!currentQuestion) {
        return currentQuestions
      }

      const replacement = getReplacementQuestion(generatorLevel, currentQuestion.topic, currentQuestion.id)

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
                JS / TS Interview Question Bank
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

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setGeneratorOpen(o => !o)}
            className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-slate-50 transition-colors rounded-3xl"
          >
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Random list
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                Generate questions on demand
              </h2>
            </div>
            <div className="shrink-0 text-slate-400">
              {generatorOpen ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
            </div>
          </button>

          {generatorOpen && (
            <div className="border-t border-slate-100 px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
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
            </div>
          )}
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

            <div className="flex flex-col gap-3">
              {generatedQuestions.map((generatedQuestion, index) => (
                <GeneratedQuestionCard
                  key={generatedQuestion.id}
                  question={generatedQuestion}
                  canReplace={questions.some(
                    question =>
                      question.level === generatorLevel &&
                      question.topic === generatedQuestion.topic &&
                      question.id !== generatedQuestion.id
                  )}
                  onReplace={() => handleReplaceQuestion(index)}
                />
              ))}
            </div>
          </section>
        )}

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