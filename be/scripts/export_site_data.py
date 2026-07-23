"""
Exports real backtest/analysis results from the three source project repos
into the JSON files the frontend charts import.

Sources (machine-local paths, see PROJECTS below):
  1. dynamic_hedging_project  -> floor-engine.json   (guaranteed-floor engine)
  2. variance_risk_premium_*  -> vrp.json            (variance-swap replication)
  3. swaption_project         -> ird.json            (IRD pricing engine)

Every series written here is real output copied from those repos' results —
no simulation. Re-run this script (and commit the JSON) whenever a source
project regenerates its results.

Usage:
    source .venv/bin/activate
    python scripts/export_site_data.py
"""

import json
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent.parent
OUT_DIRS = [HERE / "data" / "generated", HERE.parent / "ui" / "src" / "data" / "generated"]

PROJECTS = {
    "dynamic_hedging": Path("/Users/dakshkumar/NCSU/Summer Session 1 2026/FIM 675/dynamic_hedging_project"),
    "vrp": Path("/Users/dakshkumar/NCSU/Quant Projects self/variance_risk_premium_variance_swap_replication"),
    "swaption": Path("/Users/dakshkumar/NCSU/Quant Projects self/swaption_project"),
    "vol_surface": Path("/Users/dakshkumar/NCSU/Quant Projects self/volatility-surface-calibration"),
}


def write_json(name: str, payload: dict) -> None:
    for out_dir in OUT_DIRS:
        out_dir.mkdir(parents=True, exist_ok=True)
        path = out_dir / name
        path.write_text(json.dumps(payload, separators=(",", ":")))
        print(f"wrote {path}")


def r(x, nd=4):
    """Round scalars/lists for compact JSON."""
    if isinstance(x, (list, tuple, np.ndarray, pd.Series)):
        return [r(v, nd) for v in x]
    if isinstance(x, (float, np.floating)):
        return round(float(x), nd)
    return x


# --------------------------------------------------------------------------
# 1. Guaranteed-floor engine (dynamic_hedging_project)
# --------------------------------------------------------------------------
def export_floor_engine() -> None:
    root = PROJECTS["dynamic_hedging"]
    res = root / "results" / "floor_engine"

    curves = {}
    dates = None
    for key, fname in {
        "collarFrictionless": "equity_collar_frictionless.csv",
        "collarBorrow": "equity_collar_borrow.csv",
        "callFrictionless": "equity_call_frictionless.csv",
        "callBorrow": "equity_call_borrow.csv",
    }.items():
        df = pd.read_csv(res / fname, parse_dates=["Date"])
        if dates is None:
            dates = df["Date"]
        curves[key] = r(df["equity"] * 100, 2)  # indexed to 100

    # Naked-short TSLL benchmark: the repo's own published equity series
    # (results/double_short/equity.csv), aligned to the floor-engine dates.
    naked_df = pd.read_csv(root / "results" / "double_short" / "equity.csv", parse_dates=["Date"])
    naked = naked_df.set_index("Date")["equity"].reindex(dates).ffill() * 100
    curves["nakedShort"] = r(naked, 2)
    dd = (naked / naked.cummax() - 1).min()
    print(f"  naked-short TSLL (published series): final {naked.iloc[-1]:.1f}, maxDD {dd:.1%}")

    dial = pd.read_csv(res / "risk_dial.csv")
    lineage = pd.read_csv(res / "lineage.csv")
    summary = pd.read_csv(res / "summary.csv")
    verification = pd.read_csv(res / "verification.csv")

    payload = {
        "dates": [d.strftime("%Y-%m-%d") for d in dates],
        "equity": curves,
        "riskDial": [
            {
                "x": row["x"],
                "bound": r(row["Bound"]),
                "cagr": r(row["CAGR"]),
                "sharpe": r(row["Sharpe"]),
                "maxDD": r(row["MaxDD"]),
                "calmar": r(row["Calmar"]),
                "floorViolations": int(row["FloorViol"]),
            }
            for _, row in dial.iterrows()
        ],
        "lineage": [
            {
                "strategy": row["Strategy"],
                "cagr": r(row["CAGR"]),
                "sharpe": r(row["Sharpe"]),
                "maxDD": r(row["MaxDD"]),
                "calmar": r(row["Calmar"]),
            }
            for _, row in lineage.iterrows()
        ],
        "summary": [
            {
                "strategy": row["Strategy"],
                "cagr": r(row["CAGR"]),
                "sharpe": r(row["Sharpe"]),
                "maxDD": r(row["MaxDD"]),
                "calmar": r(row["Calmar"]),
            }
            for _, row in summary.iterrows()
        ],
        "verification": [
            {
                "label": row["label"],
                "floorViolations": int(row["floor_violations"]),
                "days": int(row["days"]),
                "realizedMaxDD": r(row["realized_maxdd"]),
                "boundLeakAdjusted": r(row["bound_leak_adjusted"]),
                "withinBound": bool(row["within_bound"]),
            }
            for _, row in verification.iterrows()
        ],
    }
    write_json("floor-engine.json", payload)


# --------------------------------------------------------------------------
# 2. Variance risk premium (variance_risk_premium_variance_swap_replication)
# --------------------------------------------------------------------------
def export_vrp() -> None:
    cache = PROJECTS["vrp"] / "data" / "cache"

    track = pd.read_parquet(cache / "synthetic_vs_vix_2017_2023.parquet")
    vrp = pd.read_parquet(cache / "vrp_2017_2023.parquet")
    pnl = pd.read_parquet(cache / "strategy_pnl_2017_2023.parquet")

    corr = track["vol_30d_pct"].corr(track["vix_close"])
    mae = track["error"].abs().mean()
    print(f"  tracking: corr {corr:.4f}, MAE {mae:.3f} vol pts")

    # Compounded NAV, floored at zero once wiped out — matches the source
    # repo's methodology (RESULTS.md: +221% net / +247% gross, MaxDD -70.6%).
    net_equity = 100 * (1 + pnl["net_pnl_usd"]).cumprod().clip(lower=0)
    gross_equity = 100 * (1 + pnl["gross_pnl_usd"]).cumprod().clip(lower=0)
    net_dd = (net_equity / net_equity.cummax() - 1).min()
    print(
        f"  strategy: net total {net_equity.iloc[-1] - 100:.1f}%, "
        f"gross {gross_equity.iloc[-1] - 100:.1f}%, net maxDD {net_dd:.1%}"
    )

    payload = {
        "tracking": {
            "dates": [d.strftime("%Y-%m-%d") for d in track.index],
            "synthetic": r(track["vol_30d_pct"], 2),
            "vix": r(track["vix_close"], 2),
        },
        "vrp": {
            "dates": [d.strftime("%Y-%m-%d") for d in vrp.index],
            "vrpVolPts": r(vrp["vrp_vol_pts"], 2),
            "impliedVol": r(vrp["implied_vol_pct"], 2),
            "realizedVol": r(vrp["realized_vol_pct"], 2),
        },
        "strategy": {
            "dates": [d.strftime("%Y-%m-%d") for d in pnl.index],
            "netEquity": r(net_equity, 2),
            "grossEquity": r(gross_equity, 2),
        },
        "computed": {
            "trackingCorrelation": r(corr),
            "trackingMAE": r(mae, 3),
            "meanVRP": r(vrp["vrp_vol_pts"].mean(), 2),
            "pctPositive": r((vrp["vrp_vol_pts"] > 0).mean(), 3),
        },
    }
    write_json("vrp.json", payload)


# --------------------------------------------------------------------------
# 3. IRD pricing engine (swaption_project)
# --------------------------------------------------------------------------

# ATM swaption normal-vol calibration grid, from results/hw_calibration.txt
# (small fixed grid; the txt report is the source of truth).
HW_EXPIRIES = ["1Y", "2Y", "5Y", "10Y"]
HW_TENORS = ["2Y", "5Y", "10Y"]
HW_MARKET = [[116.0, 108.0, 98.0], [112.0, 104.0, 94.0], [101.0, 93.0, 85.0], [86.0, 80.0, 74.0]]
HW_MODEL = [[116.1, 106.4, 93.1], [112.6, 103.1, 90.2], [103.4, 94.9, 82.9], [90.9, 83.4, 73.9]]


def export_ird() -> None:
    res = PROJECTS["swaption"] / "results"

    curve = pd.read_csv(res / "bootstrapped_curve.csv")
    # Thin the 200-point curve to every 2nd point; keep the short end dense.
    curve = pd.concat([curve.iloc[:20], curve.iloc[20::2]]).drop_duplicates("maturity_yrs")

    hist = pd.read_csv(res / "curve_history.csv", parse_dates=["date"])
    spread_bp = (hist["10Y"] - hist["2Y"]) * 10000

    payload = {
        "curve": {
            "maturity": r(curve["maturity_yrs"], 3),
            "zero": r(curve["zero_rate"] * 100, 3),
            "forward": r(curve["fwd_rate"] * 100, 3),
            "nss": r(curve["nss_zero"] * 100, 3),
        },
        "spread2s10s": {
            "dates": [d.strftime("%Y-%m-%d") for d in hist["date"]],
            "bp": r(spread_bp, 1),
        },
        "hwCalibration": {
            "expiries": HW_EXPIRIES,
            "tenors": HW_TENORS,
            "market": HW_MARKET,
            "model": HW_MODEL,
        },
    }
    write_json("ird.json", payload)


# --------------------------------------------------------------------------
# 4. Volatility surface calibration (volatility-surface-calibration)
# --------------------------------------------------------------------------
def _svi_iv(x, T, p):
    w = p["a"] + p["b"] * (p["rho"] * (x - p["m"]) + np.sqrt((x - p["m"]) ** 2 + p["sigma"] ** 2))
    return np.sqrt(np.maximum(w, 1e-10) / T)


def export_vol_surface() -> None:
    svi = PROJECTS["vol_surface"] / "data" / "svi_calibration"

    params = pd.read_csv(svi / "svi_parameters.csv").sort_values("T").reset_index(drop=True)
    surf = pd.read_csv(svi / "svi_fitted_surface.csv")
    dupire = pd.read_csv(svi / "dupire_local_vol.csv")
    heston_fit = pd.read_csv(svi / "heston_fit.csv")
    metrics = json.loads((svi / "surface_metrics.json").read_text())
    heston = json.loads((svi / "heston_params.json").read_text())
    dupire_rep = json.loads((svi / "dupire_report.json").read_text())

    # 3D SVI implied-vol surface: evaluate params on a regular (T, x) grid.
    keep = params[params["T"] >= 14 / 365].reset_index(drop=True)
    slice_idx = np.unique(np.linspace(0, len(keep) - 1, 14).astype(int))
    x_grid = np.round(np.arange(-0.30, 0.301, 0.02), 2)
    surface_rows = []
    for i in slice_idx:
        p = keep.iloc[i]
        iv = _svi_iv(x_grid, p["T"], p)
        surface_rows.append({"T": r(p["T"]), "iv": r(iv * 100, 2)})

    # Matching Dupire local-vol surface on its own grid, thinned the same way.
    lv_rows = []
    dup_ts = np.array(sorted(dupire["T"].unique()))
    for t in dup_ts[np.unique(np.linspace(0, len(dup_ts) - 1, 14).astype(int))]:
        g = dupire[(dupire["T"] == t) & (dupire["x"].abs() <= 0.301)].sort_values("x")
        lv = pd.to_numeric(g["local_vol"], errors="coerce") * 100
        lv_rows.append({"T": r(float(t)), "lv": [r(v, 2) if np.isfinite(v) else None for v in lv]})

    # Smile fits: market dots + SVI line (+ Heston line where in subsample).
    smile_targets = [30 / 365, 91 / 365, 182 / 365, 365 / 365]
    smiles = []
    for target in smile_targets:
        T_near = float(params.iloc[(params["T"] - target).abs().argmin()]["T"])
        p = params[params["T"] == T_near].iloc[0]
        mkt = surf[surf["T"] == T_near].sort_values("x")
        mkt = mkt[mkt["x"].abs() <= 0.30]
        line_iv = _svi_iv(x_grid, T_near, p)
        hes = heston_fit[heston_fit["T"] == T_near].sort_values("x")
        smiles.append(
            {
                "T": r(T_near),
                "label": f"{round(T_near * 365)}d",
                "market": {"x": r(mkt["x"], 3), "iv": r(mkt["iv"] * 100, 2)},
                "svi": {"x": r(x_grid, 2), "iv": r(line_iv * 100, 2)},
                "heston": {"x": r(hes["x"], 3), "iv": r(hes["iv_heston"] * 100, 2)},
            }
        )

    payload = {
        "surface": {"x": r(x_grid, 2), "slices": surface_rows},
        "localVolSurface": {"x": r(x_grid, 2), "slices": lv_rows},
        "smiles": smiles,
        "termStructure": {
            "T": r(params["T"], 4),
            "atmVol": r(params["atm_vol"] * 100, 2),
        },
        "metrics": metrics,
        "heston": heston,
        "dupire": dupire_rep,
    }
    write_json("vol-surface.json", payload)
    print(f"  vol surface: RMSE {metrics['rmse_vol_pts']} pts, heston {heston['heston_iv_rmse_vol_pts']} pts")


if __name__ == "__main__":
    for name, path in PROJECTS.items():
        if not path.exists():
            raise SystemExit(f"source project not found: {name} at {path}")
    export_floor_engine()
    export_vrp()
    export_ird()
    export_vol_surface()
