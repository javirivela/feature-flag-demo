// Pure, testable feature-flag evaluation logic.
// This mirrors how an Unleash-style SDK evaluates flags locally:
//  - a flag can be globally off
//  - "on" strategy: enabled for everyone
//  - "gradualRollout": enabled for a % of users, CONSISTENTLY (same user always
//    gets the same result) thanks to hashing the userId — exactly like Unleash
//  - "userIds": enabled only for a specific list of users (targeting)

/**
 * Deterministic hash of a userId into a bucket 0..99.
 * Same userId always lands in the same bucket → consistent rollout.
 * @param {string|number} userId
 * @returns {number} bucket in [0, 99]
 */
export function hashUserId(userId) {
  let h = 0;
  for (const ch of String(userId)) {
    h = (h * 31 + ch.charCodeAt(0)) % 100000;
  }
  return h % 100;
}

/**
 * Evaluate a feature flag for a given context.
 * @param {object} flag - { enabled, strategy, percentage?, userIds? }
 * @param {object} [context] - { userId? }
 * @returns {boolean}
 */
export function isEnabled(flag, context = {}) {
  if (!flag || flag.enabled === false) return false;

  const strategy = flag.strategy || 'on';

  if (strategy === 'on') return true;

  if (strategy === 'gradualRollout') {
    const percentage = flag.percentage ?? 0;
    if (context.userId == null) return false;
    return hashUserId(context.userId) < percentage;
  }

  if (strategy === 'userIds') {
    return (flag.userIds || []).includes(context.userId);
  }

  return false;
}
