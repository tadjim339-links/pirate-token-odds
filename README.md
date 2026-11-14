# pirate-token-odds

Small, dependency-free helpers (JavaScript and Python) for the math of a very rare drop.
The default rate is **1 in 137,500 per chest**, the drop rate Epic published for the Fortnite
Pirate Token on 7 November 2026, but every function takes any `oneIn` value.

Want the answer without code? The online version is the
[Pirate Token odds calculator](https://piratetokencalculator.com/?utm_source=github&utm_medium=readme).

## The math

Each chest is an independent try with probability `p = 1/137,500`. The number of chests until the
first drop follows a geometric distribution, so:

- chance of at least one drop in `n` chests: `1 - (1 - p)^n`
- chests needed for a target chance `t`: `ceil( ln(1 - t) / ln(1 - p) )`
- average number of chests until the first drop: `1/p = 137,500`

| Chests opened | Chance of at least one |
|---:|---:|
| 1,000 | 0.72% |
| 2,000 | 1.44% |
| 10,000 | 7.0% |
| 50,000 | 30.5% |
| 95,308 | 50% |
| 137,500 | 63.2% |
| 316,605 | 90% |
| 633,209 | 99% |

Two things people get wrong:

1. Opening 137,500 chests is **not** a guarantee. It gives about a 63% chance.
2. Chests have no memory. 2,000 misses do not make chest 2,001 any more likely.

## JavaScript

```js
const { chanceAfter, triesFor, simulate } = require('./odds.js');

chanceAfter(2000);      // 0.01444...  (1.44%)
triesFor(0.5);          // 95308
triesFor(0.9, 5000);    // any other 1-in-N rate works too
simulate();             // one simulated hunt, e.g. 211734
```

In the browser, include `odds.js` and use `window.PirateTokenOdds`.

## Python

```python
from odds import chance_after, tries_for
chance_after(10_000)   # 0.0701...
tries_for(0.99)        # 633209
```

Run `python3 odds.py` for a quick table, `npm test` (or `node test.js`) for the checks.

## Notes

- Precision: the functions use `log1p`/`expm1`, so results stay accurate for tiny probabilities.
- Weekly boost sessions exist in the game, but their size has not been confirmed, so this library
  does not model them. Pass your own `oneIn` if you want to explore "what if".
- Unofficial fan project. Not affiliated with or endorsed by Epic Games.

MIT licensed.
