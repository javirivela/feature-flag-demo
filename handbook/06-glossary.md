# 06 — Glosario (de básico a avanzado)

Términos ordenados por bloques. Si dominas estos, hablas el idioma del sector.

## Desarrollo y entrega (SDLC / DevOps)

- **SDLC:** ciclo de vida del desarrollo de software (plan → diseño → código →
  test → release → operación → mantenimiento).
- **Agile / Scrum / Kanban:** marcos de trabajo iterativo.
- **DevOps:** cultura + automatización para unir Dev y Ops y entregar rápido y
  fiable.
- **Git:** control de versiones distribuido.
- **Commit / branch / merge / tag:** unidad de cambio / línea de trabajo /
  integración / etiqueta de versión.
- **Pull Request (PR):** propuesta de cambios con revisión + CI antes de fusionar.
- **Trunk-Based Development (TBD):** trabajar sobre `main` con ramas muy cortas;
  encaja con feature flags.
- **Environment:** entorno (dev/staging/prod).
- **SemVer (MAJOR.MINOR.PATCH):** versionado semántico.
- **Deploy:** poner código en un entorno (acto técnico).
- **Release:** exponer una funcionalidad a usuarios (acto de producto).

## CI/CD

- **CI (Continuous Integration):** integrar y validar (build/test/lint) en cada
  cambio.
- **CD (Continuous Delivery):** dejar el artefacto listo para desplegar (con
  posible aprobación manual).
- **CD (Continuous Deployment):** desplegar automáticamente sin intervención.
- **Pipeline:** secuencia automatizada de pasos.
- **Stage / job / step:** etapa / unidad en un runner / paso individual.
- **Trigger / event:** lo que dispara el pipeline (push, PR, tag, cron, manual).
- **Runner / agent:** máquina (VM/contenedor) donde corre el pipeline.
- **Artifact:** resultado producido y guardado (bundle, imagen, informe).
- **Cache:** dependencias guardadas entre ejecuciones para acelerar.
- **Secret:** credencial sensible inyectada de forma segura.
- **Matrix:** ejecutar un job en varias combinaciones (versiones/SO) en paralelo.
- **`npm ci` vs `npm install`:** instalación reproducible (lockfile, para CI) vs
  instalación de desarrollo.
- **Action (`uses:`):** código reutilizable en GitHub Actions (p. ej.
  `actions/checkout`).
- **GitHub Actions / GitLab CI / Jenkins / CircleCI:** herramientas de CI/CD.

## Estrategias de despliegue

- **Big bang / recreate:** sustituir todo de golpe.
- **Rolling update:** sustituir instancias gradualmente.
- **Blue-Green:** dos entornos; conmutas el tráfico de uno a otro.
- **Canary:** soltar a un % pequeño, vigilar, escalar.
- **Dark launch:** desplegar sin exponer en la UI (probar bajo tráfico real).

## Feature management / FeatureOps

- **Feature flag / toggle:** interruptor de funcionalidad en runtime.
- **Tipos:** release / experiment / ops / permission toggles.
- **Activation strategy:** regla de activación (on, gradualRollout/flexible,
  userWithId, IPs, hostnames...).
- **Constraints:** condiciones extra (country, plan...).
- **Segment:** grupo reutilizable de constraints.
- **Context:** datos del request para evaluar (userId, sessionId, properties).
- **Stickiness:** campo que garantiza consistencia del rollout (p. ej. userId).
- **Variant:** valor más allá de on/off (A/B/n testing, payloads).
- **Gradual / flexible rollout:** activación por % de usuarios.
- **Bucketing / hashing:** asignar cada usuario a un cajón 0–99 de forma
  determinista.
- **Kill switch:** apagar una feature al instante.
- **Targeting:** activar según atributos del usuario/contexto.
- **Stale flag:** flag obsoleta que hay que retirar (deuda técnica).
- **FeatureOps:** disciplina de controlar el comportamiento en runtime (runtime
  control + progressive delivery + observability + governance).
- **A/B testing / experimentation:** comparar variantes y medir.
- **Progressive delivery:** entregar gradualmente (canary + flags + métricas).
- **Impression / metrics data:** datos de exposición/uso de flags.

## Unleash (producto)

- **Unleash Server:** API + UI + base de datos (gestión de flags).
- **Backend SDK (server-side):** descarga toda la config y evalúa **local** (PII
  no sale).
- **Frontend SDK (client-side):** manda contexto a Edge/server; recibe resultados.
- **Unleash Edge (antes Proxy):** caché/evaluación cercana al cliente; escala y
  resiliencia; polling o streaming.
- **Project / Environment:** organización de flags / por entorno.
- **API tokens:** **client** (backend), **frontend** (cliente), **admin**
  (gestión).
- **Change request / approval:** flujo de aprobación de cambios (Enterprise).
- **RBAC / SSO / SCIM:** control de acceso, single sign-on, aprovisionamiento.
- **Audit log:** registro de cambios (quién/qué/cuándo).
- **OpenFeature:** estándar CNCF para feature flags (evita lock-in).
- **Open-core:** modelo OSS gratis + ediciones de pago (Pro/Enterprise).

## Negocio / ventas (para el SE)

- **Solutions Engineer (SE) / Sales Engineer:** brazo técnico de ventas
  (preventa).
- **AE (Account Executive):** comercial que lleva el cierre.
- **Discovery:** fase de entender el dolor/arquitectura del cliente.
- **PoC (Proof of Concept):** prueba técnica para validar el encaje.
- **Technical win:** ganar la confianza técnica que desbloquea el cierre.
- **MEDDIC/MEDDPICC:** metodología de cualificación de oportunidades (Metrics,
  Economic buyer, Decision criteria, Decision process, Identify pain, Champion;
  +Paper process, Competition).
- **Champion:** aliado interno en el cliente que empuja por ti.
- **Land & expand:** entrar pequeño y crecer la cuenta.
- **OTE / base / variable:** retribución objetivo / fijo / variable.
- **EOR (Employer of Record):** intermediario que te contrata con contrato local
  (p. ej. Deel).
- **DORA metrics:** deployment frequency, lead time, change failure rate, MTTR.
- **Data residency / sovereignty:** que el dato no salga de cierta
  infraestructura/jurisdicción (clave GDPR/Schrems II).

---

[⬆ Índice](README.md) · [➡️ Siguiente: 07 — Preguntas técnicas de entrevista (Q&A)](07-interview-qa.md)
