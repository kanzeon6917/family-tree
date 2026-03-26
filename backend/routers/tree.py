from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
from database import get_db

router = APIRouter(prefix="/api/tree", tags=["tree"])


@router.get("")
def get_tree(db: Session = Depends(get_db)):
    return crud.get_tree_data(db)
