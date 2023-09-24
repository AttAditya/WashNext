from __future__ import annotations
from deta import Deta, _Base, _Drive

class Database:
    key: str|None = None
    deta: Deta|None = None

    bases: dict[str, _Base] = {}
    drives: dict[str, _Drive] = {}

    def __init__(self, deta_key: str|None=None) -> None:
        """
        Creates a database object that can contain data,
        database has deta support.
        """

        self.key = deta_key
        if self.key:
            self.deta = Deta(self.key)
        else:
            self.deta = Deta()

        return None
    
    def new_base(self, base_name: str) -> bool:
        """
        Creates a base in the DataBase and returns true when created
        """

        if not self.deta: return False
        self.bases[base_name] = self.deta.Base(base_name)

        return True
    
    def new_drive(self, drive_name: str) -> bool:
        """
        Creates a drive in the DataBase and returns true when created
        """

        if not self.deta: return False
        self.drives[drive_name] = self.deta.Drive(drive_name)

        return True
    
    def get(self, base_name: str, key: str) -> dict | None:
        """
        Gets value of key from given base if both exist
        """

        if base_name not in self.bases:
            return None
        
        item = self.bases[base_name].get(key)
        return item
    
    def put(self, base_name: str, key: str, data: dict) -> bool:
        """
        Puts data to given base at key
        """
        
        if base_name not in self.bases:
            return False
        
        self.bases[base_name].put(data, key)

        return True
    
    def get_all(self, base_name: str) -> list[dict]:
        """
        Returns all the items in a given base
        """

        if base_name not in self.bases:
            return []
        
        res = self.bases[base_name].fetch()
        all_items = res.items

        while res.last:
            res = self.bases[base_name].fetch(last=res.last)
            all_items += res.items
        
        return all_items

