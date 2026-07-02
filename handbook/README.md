# Handbook: de cero a senior en CI/CD, Feature Management y Unleash

Un manual autocontenido (pensado para leer **offline**) para pasar de "soy nuevo
en esto" a poder mantener una conversación de tú a tú con un VP de Ingeniería o
un Solutions Engineer senior. Usa como hilo conductor **nuestra app de ejemplo**
(`feature-flag-demo`) para que la teoría aterrice en algo tangible.

## Cómo leerlo (orden recomendado)

1. **[01 — Ciclo de vida del software (SDLC)](01-software-delivery-lifecycle.md)**
   Cómo se construye y entrega software hoy: fases, ramas, entornos, releases.
2. **[02 — CI/CD a fondo](02-ci-cd.md)**
   Integración y entrega continua, pipelines, GitHub Actions, runners, artifacts.
3. **[03 — Feature Management y FeatureOps](03-feature-management-and-featureops.md)**
   Qué son las feature flags, toda la terminología, estrategias y el porqué.
4. **[04 — Unleash a fondo](04-unleash-deep-dive.md)**
   Qué venden, cómo lo venden, arquitectura, SDKs, integración, OSS vs Enterprise.
5. **[08 — Integración en código: el contrato cliente ↔ Unleash](08-code-and-integration.md)**
   Ejemplos de código reales: qué pone el cliente, qué JSON recibe de Unleash,
   cómo se comunican (polling/métricas) y cómo se gestionan las configuraciones.
6. **[05 — De la teoría a la práctica con nuestra app](05-hands-on-with-this-app.md)**
   Ejercicios concretos + cómo conectar la app a un Unleash real con Docker.
7. **[06 — Glosario](06-glossary.md)**
   Todos los términos, de los básicos a los avanzados.
8. **[07 — Preguntas técnicas de entrevista (Q&A)](07-interview-qa.md)**
   Las preguntas que te pueden hacer y cómo responderlas.

> Nota: el capítulo de código es el `08-...` (lo escribí después), pero conviene
> leerlo aquí, justo tras Unleash, por eso aparece en 5º lugar.

## Idea de fondo que lo une todo

> **Desplegar código (deploy) no es lo mismo que lanzar una funcionalidad (release).**
> CI/CD lleva el código a producción de forma fiable; las **feature flags**
> deciden *quién* ve *qué* y *cuándo*, y permiten apagarlo al instante. A esa
> disciplina —controlar el comportamiento del software en producción— Unleash la
> llama **FeatureOps**.

Si interiorizas esa frase y sabes explicarla con ejemplos, ya no eres "nuevo".

## Nuestra app de ejemplo (el hilo conductor)

`feature-flag-demo` es una mini web que muestra, para 4 usuarios a la vez, si una
feature está **ON/OFF** según una flag, incluyendo **gradual rollout** con
hashing consistente. Tiene `lint`, `test` y `build`, y un workflow de CI en
GitHub Actions. La usaremos en cada capítulo para conectar concepto ↔ realidad.
