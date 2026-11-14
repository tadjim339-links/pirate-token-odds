// pirate-token-odds: drop-rate math for a 1-in-N rare drop (zero dependencies).
// Works in Node and the browser. Default rate: 1 in 137,500 per chest.
'use strict';
const DEFAULT_ODDS = 137500;

/** Chance (0..1) of at least one drop after `tries` independent tries. */
function chanceAfter(tries, oneIn = DEFAULT_ODDS) {
  if (!(tries >= 0) || !(oneIn > 1)) throw new RangeError('tries must be >= 0 and oneIn > 1');
  // expm1/log1p keep precision when 1/oneIn is tiny
  return -Math.expm1(tries * Math.log1p(-1 / oneIn));
}

/** Smallest number of tries that gives at least `target` (0..1) chance of one drop. */
function triesFor(target, oneIn = DEFAULT_ODDS) {
  if (!(target > 0 && target < 1)) throw new RangeError('target must be between 0 and 1');
  return Math.ceil(Math.log1p(-target) / Math.log1p(-1 / oneIn));
}

/** Expected number of tries until the first drop (mean of the geometric distribution). */
function expectedTries(oneIn = DEFAULT_ODDS) { return oneIn; }

/** Chance of still having nothing after `tries` tries. */
function chanceOfNothing(tries, oneIn = DEFAULT_ODDS) { return 1 - chanceAfter(tries, oneIn); }

/** One simulated hunt: returns the try number on which the first drop happened. */
function simulate(oneIn = DEFAULT_ODDS, rng = Math.random) {
  // inverse-transform sampling of a geometric distribution
  return Math.max(1, Math.ceil(Math.log(1 - rng()) / Math.log1p(-1 / oneIn)));
}

const api = { DEFAULT_ODDS, chanceAfter, triesFor, expectedTries, chanceOfNothing, simulate };
if (typeof module !== 'undefined' && module.exports) module.exports = api;
else if (typeof window !== 'undefined') window.PirateTokenOdds = api;
