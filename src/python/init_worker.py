import micropip
import sys

sys.setrecursionlimit(2000)

await micropip.install("/python/proteomics_analysis-0.0.1-py3-none-any.whl")
import proteomics
import numpy as np
import pandas as pd

print("worker initialization complete!")
