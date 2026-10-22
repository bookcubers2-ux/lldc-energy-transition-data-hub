#!/usr/bin/env bash
set -e
C=${1:-bolivia}
python 01_download.py "$C"
python 02_settlements.py "$C"
python 03_distance.py "$C"
python 04_costs.py "$C"
python 05_prioritize.py "$C"
