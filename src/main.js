import { isEnabled, hashUserId } from './featureFlags.js';

// One shared flag configuration (the sidebar) applied to four independent
// "screens", each representing a different user receiving the same deployment.
//
// Default users are chosen so their hash buckets are spread out, with one pair
// (dave=71, eve=73) almost together — to show that what enables a feature is the
// user's HASH BUCKET, not a proportional split of the group.

const sidebar = {
  enabled: document.getElementById('enabled'),
  strategy: document.getElementById('strategy'),
  percentage: document.getElementById('percentage'),
  percentageValue: document.getElementById('percentageValue'),
  userIds: document.getElementById('userIds'),
  rolloutRow: document.getElementById('rolloutRow'),
  userIdsRow: document.getElementById('userIdsRow'),
};

const DEFAULT_USERS = ['victor', 'bob', 'dave', 'eve'];
const screensEl = document.getElementById('screens');
const screens = [];

function currentFlag() {
  return {
    enabled: sidebar.enabled.checked,
    strategy: sidebar.strategy.value,
    percentage: Number(sidebar.percentage.value),
    userIds: sidebar.userIds.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

function buildScreens() {
  DEFAULT_USERS.forEach((userId, i) => {
    const screen = document.createElement('section');
    screen.className = 'screen';

    const head = document.createElement('div');
    head.className = 'screen-head';
    const label = document.createElement('span');
    label.className = 'screen-label';
    label.textContent = `Screen ${i + 1}`;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'userId-input';
    input.value = userId;
    head.append(label, input);

    const badge = document.createElement('div');
    const feature = document.createElement('div');
    const bucket = document.createElement('p');
    bucket.className = 'hint bucket';

    // Visual threshold bar: fill = rollout %, marker = this user's bucket.
    const bar = document.createElement('div');
    bar.className = 'rollout-bar';
    const fill = document.createElement('div');
    fill.className = 'rollout-fill';
    const marker = document.createElement('div');
    marker.className = 'rollout-marker';
    bar.append(fill, marker);

    screen.append(head, badge, feature, bucket, bar);
    screensEl.appendChild(screen);

    input.addEventListener('input', render);
    screens.push({ input, badge, feature, bucket, bar, fill, marker });
  });
}

function render() {
  const flag = currentFlag();

  sidebar.rolloutRow.style.display = flag.strategy === 'gradualRollout' ? '' : 'none';
  sidebar.userIdsRow.style.display = flag.strategy === 'userIds' ? '' : 'none';
  sidebar.percentageValue.textContent = `${flag.percentage}%`;

  for (const s of screens) {
    const userId = s.input.value.trim();
    const userBucket = userId ? hashUserId(userId) : null;
    const on = isEnabled(flag, { userId });

    s.badge.textContent = on ? 'FEATURE ON' : 'FEATURE OFF';
    s.badge.className = `badge ${on ? 'on' : 'off'}`;

    s.feature.className = `feature ${on ? 'on' : 'off'}`;
    s.feature.innerHTML = on
      ? '<h3>New Checkout</h3><p>One-click checkout enabled</p>'
      : '<h3>Classic Checkout</h3><p>New experience hidden</p>';

    s.bucket.textContent =
      userBucket == null
        ? 'No userId set'
        : `userId "${userId}" → bucket ${userBucket}/99`;

    // Show the threshold bar only for gradualRollout (it's about the % cutoff).
    const showBar = flag.strategy === 'gradualRollout' && userBucket != null;
    s.bar.style.display = showBar ? '' : 'none';
    if (showBar) {
      s.fill.style.width = `${flag.percentage}%`;
      s.marker.style.left = `${userBucket}%`;
      s.marker.classList.toggle('inside', userBucket < flag.percentage);
    }
  }
}

for (const el of [sidebar.enabled, sidebar.strategy, sidebar.percentage, sidebar.userIds]) {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
}

buildScreens();
render();
