from typing import Callable
from os.path import isfile

def fread(
        path: str, *,
	    root: str="web/",
	    tokenizer: Callable=lambda s: f"[[{s}]]",
	    **replace
	) -> str:
	"""
	Checks if a file exists and if does returns its contents or else an empty string if not.
	"""

	fpath = root + path
	
	if not isfile(fpath): return ""
	
	data = ""
	with open(fpath, "r") as file:
		data = file.read()
		file.close()
	
	if not replace: return data

	for rkey in replace:
		data = data.replace(tokenizer(rkey), str(replace[rkey]))
	
	return data

