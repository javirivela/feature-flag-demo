import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEnabled, hashUserId } from '../src/featureFlags.js';

test('a globally disabled flag returns false', () => {
  assert.equal(isEnabled({ enabled: false, strategy: 'on' }), false);
});

test('"on" strategy returns true for everyone', () => {
  assert.equal(isEnabled({ enabled: true, strategy: 'on' }), true);
});

test('gradual rollout is CONSISTENT for the same user', () => {
  const flag = { enabled: true, strategy: 'gradualRollout', percentage: 50 };
  const first = isEnabled(flag, { userId: 'user-123' });
  const second = isEnabled(flag, { userId: 'user-123' });
  assert.equal(first, second);
});

test('gradual rollout at 0% is off, at 100% is on', () => {
  assert.equal(
    isEnabled({ enabled: true, strategy: 'gradualRollout', percentage: 0 }, { userId: 'x' }),
    false,
  );
  assert.equal(
    isEnabled({ enabled: true, strategy: 'gradualRollout', percentage: 100 }, { userId: 'x' }),
    true,
  );
});

test('userIds strategy targets only specific users', () => {
  const flag = { enabled: true, strategy: 'userIds', userIds: ['vip-1', 'vip-2'] };
  assert.equal(isEnabled(flag, { userId: 'vip-1' }), true);
  assert.equal(isEnabled(flag, { userId: 'nobody' }), false);
});

test('hashUserId always falls in range 0..99', () => {
  for (const id of ['a', 'abc', 'user-123', 42, 'x'.repeat(50)]) {
    const bucket = hashUserId(id);
    assert.ok(bucket >= 0 && bucket < 100, `bucket out of range: ${bucket}`);
  }
});
