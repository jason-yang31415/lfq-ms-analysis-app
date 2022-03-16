import micropip
import sys, io, pickle

await micropip.install("/python/proteomics_analysis-0.0.2-py3-none-any.whl")

sys.setrecursionlimit(2000)
namespace = {}  # use separate namespace to hide run_code, modules, etc.


def run_code(code):
    """run specified code and return stdout and stderr"""
    out = io.StringIO()
    oldout = sys.stdout
    sys.stdout = out
    # change next line to exec(code, {}) if you want to clear vars each time
    exec(code, namespace)

    sys.stdout = oldout
    return out.getvalue()


def get(var):
    return namespace[var]


def get_pickle(var):
    return pickle.dumps(namespace[var])


run_code(
    """
import proteomics
import numpy as np
import pandas as pd

lfq_col = proteomics.util.lfq_col
"""
)

print("worker initialization complete!")
