# 03 — Feature Management y FeatureOps

> Objetivo: dominar feature flags de cero a senior, con TODA la terminología, y
> entender cuándo y cómo intervienen en el ciclo de entrega.

## 3.1 Qué es una feature flag

Una **feature flag** (también *feature toggle*) es un **interruptor** en el
código que permite **activar o desactivar** una funcionalidad **en tiempo de
ejecución**, sin desplegar código nuevo.

En su forma más simple:

```js
if (unleash.isEnabled('new-checkout')) {
  renderNewCheckout();   // código nuevo
} else {
  renderClassicCheckout(); // código actual
}
```

El código de ambos caminos está desplegado; **la flag decide cuál se ejecuta**.
La decisión puede cambiar en caliente desde un panel, sin tocar el código.

## 3.2 El "porqué": desacoplar deploy de release

Es la idea central (y la pregunta de entrevista clásica):

- **Deploy:** poner el código en producción (acto técnico).
- **Release:** exponer la funcionalidad a usuarios (acto de producto).

Las feature flags **separan** ambos. Beneficios:
1. **Menos riesgo:** despliegas código apagado; lo enciendes cuando quieras.
2. **Lanzamientos progresivos:** 1% → 10% → 100% (canary a nivel de app).
3. **Kill switch:** si algo va mal, **apagas la flag** y vuelve al estado
   anterior en segundos, sin rollback de despliegue (MTTR mínimo).
4. **Targeting:** activar solo para ciertos usuarios (beta testers, un país, un
   cliente VIP, usuarios premium...).
5. **Trunk-Based Development:** mergear a `main` código incompleto pero apagado.
6. **Experimentación (A/B testing):** mostrar variantes a distintos grupos y
   medir cuál funciona mejor.
7. **Empoderar a negocio/producto:** encender una campaña sin pedir un deploy a
   ingeniería.

## 3.3 Tipos de feature flags (taxonomía clásica, de Martin Fowler)

Según su **propósito y vida útil**:

- **Release toggles:** ocultan trabajo en curso hasta que esté listo. Vida
  corta. (Las más comunes.)
- **Experiment toggles:** para A/B testing. Vida media (lo que dure el experimento).
- **Ops toggles:** controlar aspectos operativos (apagar una feature pesada bajo
  carga). El **kill switch** es uno de estos.
- **Permission toggles:** dar acceso a ciertos usuarios (premium, beta, interno).
  Pueden ser de vida larga.

> Regla de oro: la mayoría de flags deben ser **de vida corta**. Una flag que se
> queda años se convierte en **deuda técnica** (stale flag). Hay que limpiarlas.

## 3.4 Terminología esencial (glosario rápido)

- **Flag / toggle:** el interruptor.
- **Enabled/disabled:** estado global de la flag.
- **Activation strategy (estrategia de activación):** la **regla** que decide
  para quién se activa. Ejemplos:
  - **standard / on-off:** para todos o para nadie.
  - **gradualRollout / flexibleRollout:** para un **% de usuarios**.
  - **userWithId / userIds:** lista de usuarios concretos (targeting).
  - **IPs / hostnames:** por IP o servidor.
  - **applicationHostname**, **remoteAddress**, etc.
- **Constraints (restricciones):** condiciones extra sobre la estrategia (p. ej.
  "solo si `country == ES`", "solo si `plan == premium`").
- **Segment:** un grupo reutilizable de constraints (p. ej. "usuarios premium de
  EU") que puedes aplicar a varias flags.
- **Context (contexto):** los datos que la app pasa al evaluar la flag: `userId`,
  `sessionId`, país, dispositivo, plan, etc. La evaluación depende del contexto.
- **Stickiness:** qué campo del contexto se usa para que la asignación sea
  **consistente** (que al mismo usuario le toque siempre lo mismo). Normalmente
  `userId` o `sessionId`.
- **Variant:** valor más allá de on/off, para A/B/n testing (p. ej. variante
  "azul" vs "verde", o un payload con configuración).
- **Rollout %:** el porcentaje de la estrategia gradual.
- **Bucketing / hashing:** cómo se asigna cada usuario a un "cajón" 0–99 para
  decidir si entra en el % (ver 3.5).
- **Kill switch:** apagar una feature al instante.
- **Stale flag (flag obsoleta):** flag que ya no se usa y habría que borrar.
- **Targeting:** activar según atributos del usuario/contexto.
- **Environment:** el mismo flag puede tener configuración distinta por entorno
  (dev/staging/prod).
- **Project:** agrupación de flags (por equipo/producto).
- **Audit log:** registro de quién cambió qué flag y cuándo.
- **Change request / approvals:** flujo de aprobación para cambiar flags en
  producción (gobernanza enterprise).
- **Stale/cleanup:** proceso de retirar flags muertas.

## 3.5 Gradual rollout y hashing consistente (importante)

Un gradual rollout al X% **no** reparte "el X% de un grupo concreto". Funciona
así:
1. A cada usuario se le calcula un **bucket fijo 0–99** con un **hash** de su
   `userId` (+ un identificador del flag/grupo).
2. La feature se activa si `bucket < X`.

Consecuencias:
- **Consistencia:** el mismo usuario cae siempre en el mismo bucket → no le
  "parpadea" la feature entre recargas. Eso es la **stickiness**.
- **Proporción estadística:** con muchos usuarios, ~X% quedan activados. Con
  **pocos** usuarios la proporción no es exacta (puede salir 0, 1, 3 de 4).
- **Monotonía:** subir el % solo **añade** usuarios, no quita (si el hashing está
  bien hecho), así nadie pierde la feature al ampliar el rollout.

> Esto es **exactamente** lo que hace nuestra app (`src/featureFlags.js`,
> función `hashUserId` + `isEnabled`) y lo que hace Unleash internamente.

## 3.6 FeatureOps (el término de Unleash)

**FeatureOps** = la **disciplina** de controlar el comportamiento del software
**en runtime**, alrededor de las feature flags. Es a las features lo que DevOps es
al despliegue:

> DevOps se ocupa de **llevar el código a producción** de forma fiable.
> FeatureOps se ocupa de **qué pasa después del deploy**: quién ve qué, cuándo, y
> cómo revertir si algo va mal.

Combina cuatro pilares:
1. **Runtime control:** encender/apagar/segmentar en caliente.
2. **Progressive delivery:** rollouts graduales, canary, targeting.
3. **Observability:** medir el impacto (métricas, errores) de cada feature.
4. **Governance:** permisos (RBAC), auditoría, aprobaciones, ciclo de vida de las
   flags (creación → uso → limpieza).

**El ángulo 2026 / IA:** con la IA generando código a gran velocidad, FeatureOps
es la **red de seguridad** para "shippear rápido sin romper": cada cambio va
detrás de una flag, cada rollout es gradual, todo es reversible al instante. De
ahí el eslogan de Unleash: *"friends don't let friends ship AI-generated code
without feature flags"*, y la idea de **autonomous releases** (rollouts que
avanzan o se revierten solos según señales de producción).

## 3.7 Buy vs build (por qué pagar por una plataforma)

"¿Para qué pagar si me hago un `if` con un booleano en una tabla?" — pregunta
típica. Respuesta:

- Un booleano en una tabla es **configuración estática**, no feature management.
- Hacer **bien** lo otro (evaluación en runtime con SDKs, gradual rollout con
  hashing consistente, targeting por atributos, segmentos, **baja latencia a
  escala**, auditoría, RBAC, aprobaciones, SDKs para 25+ lenguajes, resiliencia
  si el servicio cae...) es un **proyecto de plataforma** enorme.
- Mantenerlo es una distracción de tu producto → **deuda técnica**. Por eso
  existen plataformas como Unleash/LaunchDarkly.

## 3.8 Antipatrones y buenas prácticas

**Buenas prácticas:**
- Flags de **vida corta**; planifica su retirada desde que la creas.
- Nombres claros y con convención (`team.feature-name`).
- Default seguro: si no hay datos/conexión, la flag debe caer a un valor seguro
  (normalmente **off**).
- Evaluar en **backend** cuando la decisión es sensible (no fiarte solo del
  cliente).
- Auditar cambios en producción.

**Antipatrones:**
- **Flags zombi** que nunca se borran (deuda + confusión + riesgo).
- Lógica de negocio compleja escondida en flags anidadas.
- Usar flags como sistema de configuración permanente.
- Exponer datos sensibles del usuario al evaluar en cliente.

## 3.9 Cómo se ve en NUESTRA app

- `src/featureFlags.js` implementa las estrategias `on`, `gradualRollout`
  (con hashing) y `userIds` (targeting) → es un mini "motor de evaluación".
- La UI (4 pantallas) muestra el **mismo deploy** aplicándose distinto **por
  usuario** según la estrategia → visualiza release ≠ deploy, gradual rollout,
  targeting y kill switch (toggle global).
- El bucket de cada usuario es fijo (consistencia/stickiness).

---

[⬆ Índice](README.md) · [➡️ Siguiente: 04 — Unleash a fondo](04-unleash-deep-dive.md)
