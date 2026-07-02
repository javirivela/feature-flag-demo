# 02 — CI/CD a fondo

> Objetivo: dominar CI/CD para explicarlo y para razonar sobre pipelines reales.
> Hilo conductor: el pipeline de nuestra app en GitHub Actions.

## 2.1 El problema que resuelve

Antes, integrar el trabajo de varios devs y sacar una versión era **manual,
lento y arriesgado**: "integration hell" (merges enormes), "en mi máquina
funcionaba", releases nocturnas con todo el mundo cruzando los dedos. CI/CD
**automatiza y hace fiable** ese camino de "código escrito" → "software en
producción".

## 2.2 CI — Continuous Integration (Integración Continua)

**Definición:** cada vez que alguien sube código (push o PR), se **integra** con
el resto y se **valida automáticamente**: build + tests + análisis estático.

**Prácticas que implica:**
- Integrar **a menudo** (varias veces al día), en trozos pequeños.
- Mantener la rama principal **siempre "verde"** (que compile y pasen los tests).
- **Feedback rápido**: si algo rompe, te enteras en minutos, no en semanas.

**Pasos típicos de CI** (los verás en nuestro pipeline):
1. **Checkout**: clonar el repo en el runner.
2. **Setup**: instalar el runtime (Node, Java, etc.).
3. **Install**: dependencias (`npm ci`).
4. **Lint**: análisis estático (estilo/errores) → `npm run lint`.
5. **Test**: pruebas automáticas → `npm test`.
6. **Build**: compilar/empaquetar → `npm run build`.

## 2.3 CD — las dos "D"

- **Continuous Delivery (Entrega Continua):** tras CI, el artefacto queda
  **listo para desplegar/publicar**, pero el paso final puede requerir una
  **aprobación manual** (un botón). Garantiza que *siempre* puedes desplegar.
- **Continuous Deployment (Despliegue Continuo):** un paso más allá: si todo
  pasa, **se despliega/publica solo**, sin intervención humana.

> La diferencia entre las dos D es **si hay o no un botón manual** antes de
> producción. Delivery = listo para desplegar; Deployment = se despliega solo.

**Conexión con NPAW:** *Delivery* = el paquete del plugin queda construido y
listo para `npm publish`. *Deployment* = se publica automáticamente al crear un
tag/release.

## 2.4 Anatomía de un pipeline (vocabulario)

- **Pipeline:** la secuencia automatizada completa (de commit a entrega).
- **Stage / phase:** una etapa lógica (build, test, deploy...).
- **Job:** una unidad de trabajo que corre en **un** runner. Puede haber varios
  (en paralelo o encadenados).
- **Step:** cada paso dentro de un job, de arriba abajo.
- **Trigger / event:** lo que dispara el pipeline (push, PR, tag, cron, manual).
- **Runner / agent:** la máquina (VM o contenedor) donde se ejecuta. Puede ser
  **gestionado** (lo pone el proveedor) o **self-hosted** (tuyo).
- **Artifact:** el resultado que se produce y guarda (un bundle, un `.zip`, un
  contenedor de imagen, un informe de cobertura).
- **Cache:** guardar dependencias entre ejecuciones para acelerar (p. ej. caché
  de `node_modules`/npm).
- **Secret:** credencial sensible (token, password) guardada de forma segura y
  expuesta al pipeline como variable (nunca en el código).
- **Environment / approval:** entornos protegidos que pueden requerir aprobación
  antes de desplegar.
- **Matrix:** ejecutar el mismo job en varias combinaciones (p. ej. Node 18, 20,
  22) en paralelo.

## 2.5 Herramientas de CI/CD

- **GitHub Actions** (la que usamos): integrada en GitHub, YAML en
  `.github/workflows/`.
- **GitLab CI** (`.gitlab-ci.yml`), **Jenkins** (el clásico, muy flexible,
  self-hosted), **CircleCI**, **Travis CI**, **Azure DevOps**, **Bitbucket
  Pipelines**, **Drone**, etc.

Todas comparten el mismo modelo mental: **eventos → jobs → steps → runners →
artifacts**.

## 2.6 GitHub Actions en detalle

- GitHub **solo busca workflows en `.github/workflows/`** (convención fija).
- Cada archivo `.yml`/`.yaml` ahí es un **workflow** independiente.
- Estructura mínima:

```yaml
name: CI                 # etiqueta visible en la pestaña Actions
on:                      # CUÁNDO (triggers)
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch: {}  # permite ejecutarlo a mano
jobs:                    # QUÉ
  ci:
    runs-on: ubuntu-latest   # el runner (VM Linux efímera)
    steps:
      - uses: actions/checkout@v4      # 'uses' = acción reutilizable
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci                    # 'run' = comando de shell
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

Conceptos importantes:
- **`uses:`** ejecuta una **action** (código reutilizable publicado por otros o
  por ti). Ej: `actions/checkout` clona tu repo; `actions/setup-node` instala
  Node. Se versionan con `@v4`.
- **`run:`** ejecuta un **comando de shell** en el runner.
- **El runner es efímero y limpio**: empieza de cero (sin tu `node_modules`, sin
  tu config local) → por eso CI es reproducible y fiable.
- **`npm ci` vs `npm install`:** `npm ci` instala **exactamente** lo que dice el
  `package-lock.json` (reproducible, borra `node_modules` primero, ideal para
  CI). `npm install` puede actualizar el lock y es para desarrollo.

## 2.7 Estrategias de despliegue (deployment strategies)

Cuando el pipeline llega a producción, hay varias formas de soltar el cambio:

- **Big bang / recreate:** apagas la versión vieja y enciendes la nueva. Simple
  pero con downtime y riesgo.
- **Rolling update:** vas sustituyendo instancias poco a poco.
- **Blue-Green:** dos entornos idénticos (azul=actual, verde=nuevo). Conmutas el
  tráfico de golpe al verde; si algo va mal, vuelves al azul al instante.
- **Canary:** sueltas la versión nueva a un **pequeño % de tráfico/usuarios**,
  vigilas métricas, y si va bien escalas. (Nombre por los canarios en las minas.)
- **Dark launch:** despliegas código en producción **sin exponerlo en la UI**,
  para probar rendimiento/carga con tráfico real.

> ⚠️ Ojo a la diferencia con feature flags: canary/blue-green son estrategias a
> nivel de **infraestructura/despliegue**. Las **feature flags** hacen algo
> parecido pero a nivel de **aplicación y por usuario**, sin redeploy y con
> granularidad fina. A menudo se combinan. Esto enlaza con el capítulo 3.

## 2.8 Métricas DORA (cómo se mide un buen CI/CD)

Las **DORA metrics** miden el rendimiento de entrega de un equipo:
- **Deployment Frequency:** cada cuánto despliegas.
- **Lead Time for Changes:** tiempo de "commit" a "en producción".
- **Change Failure Rate:** % de despliegues que causan un fallo.
- **MTTR (Mean Time To Recovery):** cuánto tardas en recuperarte de un fallo.

Las feature flags **mejoran** estas métricas: permiten desplegar más a menudo
(con menos riesgo) y **recuperarte al instante** (apagar la flag = MTTR de
segundos, sin rollback de despliegue).

## 2.9 Cómo se ve en NUESTRA app

- Workflow: `.github/workflows/ci.yml` (de momento un esqueleto que haremos
  crecer a checkout → setup-node → npm ci → lint → test → build).
- Los scripts ya existen y los puedes correr en local:
  ```bash
  npm ci && npm run lint && npm test && npm run build
  ```
- El `build` genera `dist/bundle.js` → ese es tu **artifact**.
- El runner ejecuta exactamente esos pasos, pero en una VM limpia, en cada push.

---

[⬆ Índice](README.md) · [➡️ Siguiente: 03 — Feature Management y FeatureOps](03-feature-management-and-featureops.md)
