# 01 — Ciclo de vida del desarrollo y entrega de software (SDLC)

> Objetivo del capítulo: entender **cómo nace, evoluciona y llega a producción**
> el software hoy, para que CI/CD y las feature flags tengan contexto.

## 1.1 ¿Qué es el SDLC?

**SDLC** = *Software Development Life Cycle* (ciclo de vida del desarrollo de
software). Es el conjunto de **fases** por las que pasa una funcionalidad desde
que es una idea hasta que está en producción y se mantiene:

1. **Planificación / requisitos** — qué problema resolvemos y para quién.
2. **Diseño** — arquitectura, APIs, modelo de datos, decisiones técnicas.
3. **Implementación (coding)** — escribir el código.
4. **Testing** — validar que funciona y no rompe nada.
5. **Release / despliegue** — llevarlo a los usuarios.
6. **Operación y monitorización** — mantenerlo vivo, observar, alertar.
7. **Mantenimiento / evolución** — bugs, mejoras, deuda técnica.

En la práctica esto **no es lineal**: es un ciclo continuo (iterativo). Hoy se
entrega en ciclos cortos (días u horas), no en grandes entregas anuales.

## 1.2 Metodologías: de Waterfall a Agile

- **Waterfall (cascada):** fases secuenciales y largas (mucha documentación,
  entregas grandes y poco frecuentes). Riesgo alto: si algo está mal, se
  descubre tarde.
- **Agile (ágil):** iteraciones cortas (sprints de 1–2 semanas), entregas
  frecuentes, feedback continuo. Marcos típicos: **Scrum** (sprints, roles,
  ceremonias) y **Kanban** (flujo continuo con límites de trabajo en curso).
- **DevOps:** no es una metodología de gestión, sino una **cultura + prácticas**
  para que Desarrollo (Dev) y Operaciones (Ops) trabajen juntos y se automatice
  todo el camino a producción. CI/CD es la columna vertebral de DevOps.

> Idea clave: cuanto **más pequeñas y frecuentes** son las entregas, **menos
> riesgo** por entrega y más fácil es localizar qué causó un problema.

## 1.3 Control de versiones (Git) y modelos de ramas

Todo gira en torno a **Git** (control de versiones distribuido). Conceptos:

- **Repository (repo):** el proyecto y su historial.
- **Commit:** una "foto" de cambios con un mensaje.
- **Branch (rama):** una línea de trabajo paralela.
- **Merge:** integrar una rama en otra.
- **Pull Request (PR) / Merge Request:** propuesta de integrar cambios, con
  revisión de código (code review) y validaciones automáticas (CI) antes de
  fusionar.
- **Tag:** una etiqueta sobre un commit, normalmente para marcar una **versión**
  (p. ej. `v1.4.0`).

**Modelos de ramas habituales:**

- **Trunk-Based Development (TBD):** casi todo el mundo trabaja sobre una sola
  rama principal (`main`/`trunk`) con ramas muy cortas. Se integra muy a menudo.
  **Es el modelo que mejor encaja con CI/CD y con las feature flags** (porque el
  código a medio terminar puede estar en `main` pero **apagado** tras una flag).
- **GitHub Flow:** `main` siempre desplegable + ramas de feature cortas + PR.
- **Git Flow:** modelo más pesado con ramas `develop`, `release/*`, `hotfix/*`,
  `feature/*`. Potente pero con mucha ceremonia; hoy se usa menos en SaaS.

> Conexión con feature flags: TBD + feature flags es la combinación moderna. En
> vez de mantener una rama larga separada durante semanas (con su doloroso merge
> final), metes el código en `main` **detrás de una flag apagada** y lo enciendes
> cuando esté listo. Menos conflictos, integración continua de verdad.

## 1.4 Entornos (environments)

El código suele pasar por varios **entornos** antes de llegar al usuario:

- **Local / development:** la máquina del desarrollador.
- **CI:** entorno efímero donde se valida automáticamente cada cambio.
- **Staging / pre-production:** una réplica de producción para pruebas finales.
- **Production (prod):** donde están los usuarios reales.

A veces hay más (QA, UAT, canary). Cada entorno tiene su **configuración** y, con
feature flags, **puede tener flags distintas** (p. ej. una feature encendida en
staging y apagada en prod).

## 1.5 Versionado: SemVer

**SemVer** (Semantic Versioning) = `MAJOR.MINOR.PATCH` (p. ej. `2.4.1`):

- **MAJOR:** cambios incompatibles (rompe la API). `2.x.x → 3.0.0`.
- **MINOR:** nueva funcionalidad compatible hacia atrás. `2.4.x → 2.5.0`.
- **PATCH:** correcciones de bugs compatibles. `2.4.1 → 2.4.2`.

Esto es justo lo que gestionas al **releasear el plugin JS de NPAW**: decides si
un cambio es patch/minor/major, creas el **tag** (`vX.Y.Z`), generas el
**changelog** y **publicas** (npm). CI/CD automatiza ese proceso.

## 1.6 Deploy vs Release (la distinción CLAVE)

- **Deploy (despliegue):** poner el código nuevo en el servidor/entorno. Es un
  acto **técnico**.
- **Release (lanzamiento):** hacer que una funcionalidad esté **disponible para
  los usuarios**. Es un acto de **producto/negocio**.

Tradicionalmente eran lo mismo: si desplegabas, el usuario lo veía. **Las feature
flags los separan:** despliegas el código apagado (deploy) y decides aparte
cuándo y para quién encenderlo (release). Esto es el fundamento del capítulo 3.

## 1.7 Cómo se ve en NUESTRA app

- El **repo** `feature-flag-demo` está en Git/GitHub, rama `main`.
- Tiene scripts (`lint`, `test`, `build`) = parte de las fases 3–4 del SDLC.
- El **workflow de CI** valida cada push (fase 4 automatizada).
- La **lógica de flags** (`src/featureFlags.js`) es justo el mecanismo que separa
  *deploy* de *release*: el código de "New Checkout" está desplegado en las 4
  pantallas, pero solo se **lanza** a quien la flag activa.

---

[⬆ Índice](README.md) · [➡️ Siguiente: 02 — CI/CD a fondo](02-ci-cd.md)
