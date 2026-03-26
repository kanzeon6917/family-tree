from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/api/relationships", tags=["relationships"])


@router.get("", response_model=List[schemas.RelationshipOut])
def list_relationships(person_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    return crud.get_relationships(db, person_id=person_id)


@router.post("", response_model=schemas.RelationshipOut, status_code=201)
def create_relationship(data: schemas.RelationshipCreate, db: Session = Depends(get_db)):
    if data.person1_id == data.person2_id:
        raise HTTPException(status_code=400, detail="A person cannot have a relationship with themselves")

    # Validate both persons exist
    if not crud.get_person(db, data.person1_id):
        raise HTTPException(status_code=404, detail=f"Person {data.person1_id} not found")
    if not crud.get_person(db, data.person2_id):
        raise HTTPException(status_code=404, detail=f"Person {data.person2_id} not found")

    try:
        return crud.create_relationship(db, data)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Relationship already exists")


@router.put("/{rel_id}", response_model=schemas.RelationshipOut)
def update_relationship(rel_id: int, data: schemas.RelationshipUpdate, db: Session = Depends(get_db)):
    rel = crud.get_relationship(db, rel_id)
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    return crud.update_relationship(db, rel, data)


@router.delete("/{rel_id}", status_code=204)
def delete_relationship(rel_id: int, db: Session = Depends(get_db)):
    rel = crud.get_relationship(db, rel_id)
    if not rel:
        raise HTTPException(status_code=404, detail="Relationship not found")
    crud.delete_relationship(db, rel)
