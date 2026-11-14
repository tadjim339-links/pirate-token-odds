"""pirate-token-odds: drop-rate math for a 1-in-N rare drop (standard library only)."""
import math
import random

DEFAULT_ODDS = 137_500


def chance_after(tries: int, one_in: float = DEFAULT_ODDS) -> float:
    """Chance (0..1) of at least one drop after `tries` independent tries."""
    if tries < 0 or one_in <= 1:
        raise ValueError("tries must be >= 0 and one_in > 1")
    return -math.expm1(tries * math.log1p(-1 / one_in))


def tries_for(target: float, one_in: float = DEFAULT_ODDS) -> int:
    """Smallest number of tries that gives at least `target` (0..1) chance of one drop."""
    if not 0 < target < 1:
        raise ValueError("target must be between 0 and 1")
    return math.ceil(math.log1p(-target) / math.log1p(-1 / one_in))


def simulate(one_in: float = DEFAULT_ODDS, rng: random.Random | None = None) -> int:
    """One simulated hunt: the try number on which the first drop happened."""
    r = (rng or random).random()
    return max(1, math.ceil(math.log(1 - r) / math.log1p(-1 / one_in)))


if __name__ == "__main__":
    for n in (1_000, 2_000, 10_000, 50_000, 137_500):
        print(f"{n:>8,} chests -> {chance_after(n) * 100:6.2f}%")
    for t in (0.5, 0.9, 0.99):
        print(f"{int(t * 100)}% chance needs {tries_for(t):,} chests")
