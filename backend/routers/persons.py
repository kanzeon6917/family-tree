from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/api/persons", tags=["persons"])


@router.get("", response_model=List[schemas.PersonOut])
def list_persons(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    return crud.get_persons(db, search=search)


@router.post("", response_model=schemas.PersonOut, status_code=201)
def create_person(data: schemas.PersonCreate, db: Session = Depends(get_db)):
    return crud.create_person(db, data)


@router.get("/{person_id}", response_model=schemas.PersonOut)
def get_person(person_id: int, db: Session = Depends(get_db)):
    person = crud.get_person(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person


@router.put("/{person_id}", response_model=schemas.PersonOut)
def update_person(person_id: int, data: schemas.PersonUpdate, db: Session = Depends(get_db)):
    person = crud.get_person(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return crud.update_person(db, person, data)


@router.delete("/{person_id}", status_code=204)
def delete_person(person_id: int, db: Session = Depends(get_db)):
    person = crud.get_person(db, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    crud.delete_person(db, person)
