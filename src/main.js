import { isEnabled, hashUserId } from './featureFlags.js';

// --- UI wiring -------------------------------------------------------------
// A tiny visual playground: change the flag config on the left and instantly
// see whether the "New Checkout Experience" feature is ON or OFF on the right.

const els = {
  enabled: document.getElementById('enabled'),
  strategy: document.getElementById('strategy'),
  percentage: document.getElementById('percentage'),
  percentageValue: document.getElementById('percentageValue'),
  userId: document.getElementById('userId'),
  userIds: document.getElementById('userIds'),
  rolloutRow: document.getElementById('rolloutRow'),
  userIdsRow: document.getElementById('userIdsRow'),
  badge: document.getElementById('badge'),
  feature: document.getElementById('feature'),
  bucket: document.getElementById('bucket'),
};

function currentFlag() {
  return {
    enabled: els.enabled.checked,
    strategy: els.strategy.value,
    percentage: Number(els.percentage.value),
    userIds: els.userIds.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function render() {
  const flag = currentFlag();
  const context = { userId: els.userId.value.trim() };

  // Show/hide the controls that only apply to a given strategy.
  els.rolloutRow.style.display = flag.strategy === 'gradualRollout' ? '' : 'none';
  els.userIdsRow.style.display = flag.strategy === 'userIds' ? '' : 'none';
  els.percentageValue.textContent = `${flag.percentage}%`;

  const on = isEnabled(flag, context);

  els.badge.textContent = on ? 'FEATURE ON' : 'FEATURE OFF';
  els.badge.className = `badge ${on ? 'on' : 'off'}`;

  els.feature.className = `feature ${on ? 'on' : 'off'}`;
  els.feature.innerHTML = on
    ? '<h2>New Checkout Experience</h2><p>One-click checkout enabled for this user.</p>'
    : '<h2>Classic Checkout</h2><p>The new experience is hidden for this user.</p>';

  // Educational: show which rollout bucket this user falls into.
  const bucket = context.userId ? hashUserId(context.userId) : null;
  els.bucket.textContent =
    bucket == null
      ? 'No userId set'
      : `userId "${context.userId}" → rollout bucket ${bucket}/99`;
}

for (const el of Object.values(els)) {
  if (el && el.addEventListener) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  }
}

render();
