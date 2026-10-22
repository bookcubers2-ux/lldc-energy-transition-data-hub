from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROCESSED = ROOT / "data" / "processed"
WEB_DATA = ROOT / "web" / "public" / "data"
CONFIG = Path(__file__).resolve().parent / "config"

for d in (RAW, PROCESSED, WEB_DATA):
    d.mkdir(parents=True, exist_ok=True)


def load_country(code: str) -> dict:
    with open(CONFIG / f"{code}.yaml") as f:
        return yaml.safe_load(f)


def load_costs() -> dict:
    with open(CONFIG / "costs.yaml") as f:
        return yaml.safe_load(f)


def raw(country: dict, name: str) -> Path:
    return RAW / country["country"] / name


def processed(country: dict, name: str) -> Path:
    return PROCESSED / f"{country['country'].lower()}_{name}"
