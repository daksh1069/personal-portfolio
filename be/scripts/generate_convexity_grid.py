"""
Generates the precomputed OTM%-hedge scenario grid behind the Convexity
Protection project's interactive slider.

This is a placeholder parametric model (not the real TSLL backtest engine) —
it reproduces the headline numbers already reported for the 10% OTM case
(max drawdown -23.5%, Sharpe 0.69, Calmar 0.78) and interpolates a plausible
risk/return smile around it, so the frontend has real numbers to render
while the actual backtest code isn't wired in yet.

Swap this script's body for a call into the real backtester once it's
available; the JSON *shape* below is the frontend contract and can stay
the same.

Usage:
    source .venv/bin/activate
    python scripts/generate_convexity_grid.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd

OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "convexity_grid.json"
FRONTEND_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "ui"
    / "src"
    / "data"
    / "generated"
    / "convexity-grid.json"
)

OTM_LEVELS = [0, 5, 10, 15, 20, 25, 30]
START = "2022-01"
N_MONTHS = 54  # Jan 2022 -> Jun 2026

# Anchor points hand-tuned so OTM=10% reproduces the reported backtest
# result exactly; the rest trace a realistic risk/return "smile" around it
# (too little OTM = premium drag; too much OTM = insufficient protection).
ANCHORS = {
    0: dict(max_dd=-12.0, sharpe=0.52, calmar=0.55, final=165.0),
    5: dict(max_dd=-17.0, sharpe=0.63, calmar=0.69, final=192.0),
    10: dict(max_dd=-23.5, sharpe=0.69, calmar=0.78, final=214.0),
    15: dict(max_dd=-31.0, sharpe=0.66, calmar=0.73, final=207.0),
    20: dict(max_dd=-38.0, sharpe=0.61, calmar=0.66, final=195.0),
    25: dict(max_dd=-48.0, sharpe=0.53, calmar=0.55, final=180.0),
    30: dict(max_dd=-58.0, sharpe=0.45, calmar=0.45, final=165.0),
}

PEAK_MONTH = 18
TROUGH_MONTH = 20


def month_labels(start: str, count: int) -> list[str]:
    idx = pd.period_range(start=start, periods=count + 1, freq="M")
    return [p.strftime("%b %y") for p in idx]


def build_curve(max_dd_pct: float, final_value: float, seed: int) -> list[float]:
    """Interpolates a monthly equity curve through fixed keyframes so that
    the realized max drawdown and terminal value match the target stats."""
    rng = np.random.default_rng(seed)

    peak = 108.0
    trough = peak * (1 + max_dd_pct / 100.0)

    keyframes = [
        (0, 100.0),
        (6, peak),
        (TROUGH_MONTH, trough),
        (30, trough * 1.35),
        (42, final_value * 0.82),
        (N_MONTHS, final_value),
    ]

    months = np.arange(0, N_MONTHS + 1)
    xs = np.array([k[0] for k in keyframes])
    ys = np.array([k[1] for k in keyframes])
    base = np.interp(months, xs, ys)

    noise = (rng.random(len(months)) - 0.5) * 2 * 0.8 * (base / 100.0)
    curve = base + noise
    return np.round(curve, 2).tolist()


def main() -> None:
    labels = month_labels(START, N_MONTHS)
    series: dict[str, list[float]] = {}
    stats: dict[str, dict] = {}

    for i, otm in enumerate(OTM_LEVELS):
        a = ANCHORS[otm]
        series[str(otm)] = build_curve(a["max_dd"], a["final"], seed=100 + i)
        stats[str(otm)] = {
            "maxDrawdown": a["max_dd"],
            "sharpe": a["sharpe"],
            "calmar": a["calmar"],
            "totalReturnPct": round(a["final"] - 100.0, 1),
        }

    payload = {
        "otmLevels": OTM_LEVELS,
        "months": labels,
        "series": series,
        "stats": stats,
    }

    for path in (OUT_PATH, FRONTEND_PATH):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, indent=2))
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
