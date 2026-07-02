# 05 — De la teoría a la práctica con nuestra app

> Objetivo: ejercicios concretos para fijar conceptos, y la guía para **conectar
> nuestra app a un Unleash real con Docker** (el PoC estrella). Pensado para
> hacerlo al volver (necesita conexión), pero lo dejas leído y entendido.

## 5.1 Repaso de la app

`feature-flag-demo` es una web vanilla (HTML/CSS/JS) con:
- `src/featureFlags.js` — **motor de evaluación** puro (estrategias `on`,
  `gradualRollout` con hashing, `userIds`).
- `src/main.js` — UI: sidebar de config + 4 "pantallas" (4 usuarios).
- `test/featureFlags.test.js` — tests de la lógica.
- `.github/workflows/ci.yml` — pipeline de CI.

Lanzarla:
```bash
cd my_tools/feature-flag-demo
python3 -m http.server 8010   # abre http://localhost:8010
```

## 5.2 Ejercicios sobre la app (mapea concepto ↔ realidad)

1. **Kill switch:** estrategia `on`, desmarca "Flag enabled" → las 4 pantallas
   pasan a OFF al instante. *(Concepto: ops toggle / kill switch, sin redeploy.)*
2. **Gradual rollout / canary:** estrategia `gradualRollout`, sube el % de 0 a
   100. Observa qué usuario enciende y cuándo (buckets: victor=14, bob=44,
   dave=71, eve=73). *(Concepto: progressive delivery + hashing consistente.)*
3. **Consistencia (stickiness):** con un % fijo, recarga: cada usuario mantiene su
   estado. *(Concepto: el bucket es determinista por userId.)*
4. **No es proporcional con pocos usuarios:** entre 71% y 73% encienden DOS a la
   vez (dave y eve). *(Concepto: el % es estadístico; depende del hash, no de un
   reparto del grupo.)*
5. **Targeting:** estrategia `userIds`, pon `victor, dave` → solo esas pantallas
   encienden. *(Concepto: permission/targeting toggle.)*
6. **Reto de código:** añade una estrategia nueva en `featureFlags.js`, p. ej.
   `country` (activar si `context.country === flag.country`), añade su test en
   `test/featureFlags.test.js`, corre `npm test`. *(Concepto: constraints.)*

## 5.3 Conectar a un Unleash REAL con Docker (el PoC top)

> Esto demuestra iniciativa real en la entrevista. Verifica los comandos contra
> la doc oficial (`https://docs.getunleash.io`) el día que lo hagas; las
> versiones cambian.

### Paso 1 — Levantar Unleash con Docker
```bash
# Opción rápida: clonar el repo oficial y usar su docker-compose
git clone https://github.com/Unleash/unleash.git
cd unleash
docker compose up -d
# UI en http://localhost:4242  (login por defecto: admin / unleash4all)
```

### Paso 2 — Crear una flag y un token
1. En la UI (`http://localhost:4242`): crea un **proyecto** y una **feature flag**
   llamada `new-checkout`.
2. Añádele una **activation strategy** `gradualRollout` (o `flexibleRollout`).
3. Crea un **API token**:
   - Para web (navegador): un **Frontend token** (lo usa el frontend SDK vía Edge
     o Frontend API).
   - Para backend: un **Client token**.

### Paso 3 — Conectar un SDK
Para una web, el **Unleash Proxy/Edge + Frontend SDK** es lo correcto (no se usa
token de cliente en el navegador). Esquema con el frontend SDK:

```bash
npm install unleash-proxy-client
```
```js
import { UnleashClient } from 'unleash-proxy-client';

const unleash = new UnleashClient({
  url: 'http://localhost:4242/api/frontend', // o la URL de Unleash Edge
  clientKey: 'TU_FRONTEND_TOKEN',
  appName: 'feature-flag-demo',
  context: { userId: 'victor' },
});

unleash.on('ready', () => {
  const on = unleash.isEnabled('new-checkout');
  console.log('new-checkout =>', on);
});
unleash.start();
```

Para un **script de backend** (Node), el SDK de servidor:
```bash
npm install unleash-client
```
```js
const { initialize } = require('unleash-client');
const unleash = initialize({
  url: 'http://localhost:4242/api/',
  appName: 'demo',
  customHeaders: { Authorization: 'TU_CLIENT_TOKEN' },
});
unleash.on('ready', () => {
  setInterval(() => {
    console.log('new-checkout =>', unleash.isEnabled('new-checkout', { userId: 'victor' }));
  }, 2000);
});
```

### Paso 4 — La demo en vivo (lo que cuentas)
1. Arranca el script → `new-checkout => false`.
2. En la UI de Unleash, **enciende** la flag / sube el rollout.
3. A los pocos segundos el script pasa a `true` **sin reiniciarlo** → eso es
   **evaluación local + sync en background**.
4. Pon un `gradualRollout` al 50% y cambia el `userId` → unos `true`, otros
   `false`, **consistente** por usuario (hashing).
5. **Apaga** la flag (kill switch) → vuelve a `false` en segundos.

### Frase para la entrevista (100% honesta una vez hecho)
> "To really understand the product I spun up Unleash locally with Docker,
> created a `gradualRollout` flag, generated a frontend token and wired an SDK.
> I watched local evaluation update within seconds after changing the flag in the
> UI — no restart — and saw consistent hashing across users. The kill switch
> flipped it back instantly. It made the 'sub-millisecond local evaluation, PII
> never leaves your infra' architecture click."

## 5.4 (Opcional avanzado) Sustituir nuestro motor por el SDK real

Como ejercicio final: cambia en `main.js` la llamada a nuestro `isEnabled(...)`
por la del SDK real de Unleash, manteniendo la UI de 4 pantallas. Verás las 4
pantallas reaccionar a los cambios que hagas en la **UI de Unleash** en vivo.
Eso convierte tu demo de "simulación" a "integración real" — ideal para enseñar.

---

[⬆ Índice](README.md) · [➡️ Siguiente: 06 — Glosario](06-glossary.md)
