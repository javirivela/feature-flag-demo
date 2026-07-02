# 07 — Preguntas técnicas de entrevista (Q&A)

> Preguntas típicas para un Solutions Engineer de Unleash y cómo responderlas.
> Practica decirlas en voz alta. Las respuestas "modelo" están en inglés porque
> es el idioma de la entrevista.

## CI/CD y SDLC

**P: ¿Qué diferencia hay entre Continuous Delivery y Continuous Deployment?**
> "Both automate the path to production after CI. Continuous Delivery leaves the
> artifact ready to deploy, but the final step to production can require a manual
> approval. Continuous Deployment removes that gate — if everything passes, it
> ships automatically."

**P: ¿Qué es un pipeline y sus partes?**
> "An automated sequence from commit to delivery. It's triggered by an event
> (push, PR, tag), runs one or more jobs on ephemeral runners, and each job has
> steps — either shell commands or reusable actions. It can produce artifacts."

**P: ¿Qué es trunk-based development y por qué encaja con feature flags?**
> "Everyone works off a short-lived branch on main and integrates very often.
> Feature flags make it safe: you can merge unfinished work to main behind a
> disabled flag, avoiding long-lived branches and painful merges. Deploy stays
> decoupled from release."

## Feature flags / FeatureOps

**P: ¿Por qué no me hago yo un booleano en una tabla?**
> "A boolean in a config table is static configuration, not feature management.
> Real flags need runtime SDK evaluation, gradual rollouts with consistent
> hashing, targeting and segments, low latency at scale, audit logs, RBAC,
> approvals, SDKs for many languages, and resilience if the service is down.
> Building and maintaining that is a platform project — a distraction from your
> product. That's the technical debt a platform like Unleash removes."

**P: ¿Cómo funciona un gradual rollout? ¿Es proporcional?**
> "Each user is hashed into a fixed bucket 0–99, and the flag is on if the bucket
> is below the rollout percentage. That gives consistency — the same user always
> gets the same result, no flicker. The percentage is statistical: it converges
> to X% with many users, but with few users it won't be an exact split. Raising
> the percentage only adds users, never removes them."

**P: ¿Qué es FeatureOps?**
> "It's the discipline of controlling software behavior at runtime, around
> feature flags. DevOps gets code to production; FeatureOps governs what happens
> after the deploy — who sees what, when, and how to roll back safely. It
> combines runtime control, progressive delivery, observability and governance."

**P: ¿Deploy vs release?**
> "Deploy is putting the code in production — a technical act. Release is exposing
> the functionality to users — a product act. Feature flags decouple them: you
> deploy code turned off, then decide when and to whom to release it."

## Arquitectura de Unleash

**P: ¿Cómo evitáis impacto de latencia evaluando millones de flags?**
> "Backend SDKs evaluate locally in memory using a cached ruleset they sync in
> the background, so there's no HTTP call per check — latency is effectively zero,
> and the user's PII never leaves their infrastructure. For frontend SDKs,
> Unleash Edge evaluates close to the user and returns only the results."

**P: ¿Qué es Unleash Edge y por qué importa?**
> "A lightweight caching and evaluation layer between the SDKs and the Unleash
> server. It scales to thousands of SDKs without hitting the core instance, keeps
> serving the last known config if the server is temporarily down (resilience),
> and for frontend SDKs it evaluates at the edge so PII stays inside the
> customer's infra. It supports polling and, in Enterprise, real-time streaming."

**P: ¿Diferencia entre backend y frontend SDK?**
> "Backend SDKs download the full flag configuration and evaluate locally —
> user data stays in the app. Frontend SDKs don't evaluate locally; they send the
> context to Edge (or the server), which evaluates and returns the enabled flags.
> Edge keeps PII from leaving the customer's environment."

**P: ¿Qué tipos de token hay?**
> "Client tokens for backend SDKs, frontend tokens for client-side SDKs (browser/
> mobile), and admin tokens for managing Unleash via the API."

## Unleash vs competencia / negocio

**P: ¿Unleash vs LaunchDarkly?**
> "LaunchDarkly is the strongest closed SaaS, with the biggest SDK matrix and
> integrated experimentation. Unleash wins when self-hosting and data sovereignty
> are non-negotiable — banking, insurance, healthcare, EU under GDPR/Schrems II.
> It's the most enterprise-mature open-source option, no vendor lock-in, and PII
> never leaves your infrastructure."

**P: ¿Qué es Enterprise vs Open Source en Unleash?**
> "The open-source edition gives you real feature flags, activation strategies and
> SDKs, self-hosted for free. Enterprise adds governance and scale: SSO, RBAC,
> change requests/approvals, advanced audit logs, Unleash Edge with streaming,
> SOC 2, data residency and support. Customers pay for governance and scale, not
> for the flag itself."

**P: Diseña un PoC para un VP of Engineering.**
> "First I'd run discovery to define success criteria with them. Then: stand up
> Unleash (self-hosted via Docker or cloud), integrate one backend SDK into a
> real service, create a flag with a gradual rollout, and demonstrate a kill
> switch, an audit log entry, and targeting by segment — ideally in their own
> infrastructure. I'd measure time-to-value and map it back to their DORA
> metrics: more frequent deploys, lower change failure rate, near-zero MTTR."

## Tu encaje (cómo conectar con tu experiencia)

**P: No tienes experiencia directa con feature flags, ¿cómo lo compensas?**
> "True, I haven't run a feature-flag platform in production, but the concepts are
> very transferable: at NPAW I work daily with an embedded SDK model — customers
> integrate a plugin/adapter that evaluates and streams data — which is the mirror
> image of how an Unleash SDK pulls config and sends usage metrics. And I got
> hands-on: I spun up Unleash with Docker and wired an SDK to see local
> evaluation and rollouts in action."

**P: ¿De dónde te viene la experiencia con entornos regulados?**
> "From aviation — 7+ years on air-traffic-management systems, safety-critical and
> heavily regulated, zero-downtime. That rigor maps well to what finance or
> government customers expect, which is exactly where Unleash's self-hosting and
> governance shine."

**P: ¿Cómo usas la IA en tu trabajo?**
> "I use agentic AI daily — Cursor with LLMs — for technical analysis, prototyping
> and docs. That gives me a first-hand feel for how fast AI ships code and exactly
> why FeatureOps and safe, reversible releases matter so much in that world —
> which is the angle behind Unleash's 'don't ship AI-generated code without
> feature flags'."

---

Recuerda la frase que lo resume todo: **deploy ≠ release; las flags deciden quién
ve qué, cuándo, y permiten revertir al instante. Eso es FeatureOps.**

---

[⬆ Índice](README.md) · (fin del handbook 🎉)
