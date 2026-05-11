from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

import models
import schemas


# --- Person CRUD ---

def get_persons(db: Session, search: Optional[str] = None) -> List[models.Person]:
    q = db.query(models.Person)
    if search:
        like = f"%{search}%"
        q = q.filter(
            or_(
                models.Person.first_name.ilike(like),
                models.Person.last_name.ilike(like),
            )
        )
    return q.order_by(models.Person.last_name, models.Person.first_name).all()


def get_person(db: Session, person_id: int) -> Optional[models.Person]:
    return db.query(models.Person).filter(models.Person.id == person_id).first()


def create_person(db: Session, data: schemas.PersonCreate) -> models.Person:
    person = models.Person(**data.model_dump())
    db.add(person)
    db.commit()
    db.refresh(person)
    return person


def update_person(db: Session, person: models.Person, data: schemas.PersonUpdate) -> models.Person:
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(person, key, value)
    db.commit()
    db.refresh(person)
    return person


def delete_person(db: Session, person: models.Person) -> None:
    db.delete(person)
    db.commit()


# --- Relationship CRUD ---

def get_relationships(db: Session, person_id: Optional[int] = None) -> List[models.Relationship]:
    q = db.query(models.Relationship)
    if person_id is not None:
        q = q.filter(
            or_(
                models.Relationship.person1_id == person_id,
                models.Relationship.person2_id == person_id,
            )
        )
    return q.all()


def get_relationship(db: Session, rel_id: int) -> Optional[models.Relationship]:
    return db.query(models.Relationship).filter(models.Relationship.id == rel_id).first()


def create_relationship(db: Session, data: schemas.RelationshipCreate) -> models.Relationship:
    p1_id = data.person1_id
    p2_id = data.person2_id

    # Normalize spouse pairs so (A,B) and (B,A) map to the same row
    if data.relationship_type == models.RelationshipType.spouse:
        p1_id, p2_id = min(p1_id, p2_id), max(p1_id, p2_id)

    rel = models.Relationship(
        person1_id=p1_id,
        person2_id=p2_id,
        relationship_type=data.relationship_type,
        birth_order=data.birth_order,
    )
    db.add(rel)
    db.commit()
    db.refresh(rel)
    return rel


def update_relationship(db: Session, rel: models.Relationship, data: schemas.RelationshipUpdate) -> models.Relationship:
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rel, key, value)
    db.commit()
    db.refresh(rel)
    return rel


def delete_relationship(db: Session, rel: models.Relationship) -> None:
    db.delete(rel)
    db.commit()


# --- Tree data assembly ---

def get_tree_data(db: Session) -> dict:
    persons = db.query(models.Person).all()
    relationships = db.query(models.Relationship).all()

    nodes = []
    for p in persons:
        nodes.append({
            "id": f"person-{p.id}",
            "type": "personNode",
            "position": {"x": 0, "y": 0},
            "data": {
                "id": p.id,
                "first_name": p.first_name,
                "last_name": p.last_name,
                "birth_date": p.birth_date.isoformat() if p.birth_date else None,
                "death_date": p.death_date.isoformat() if p.death_date else None,
                "gender": p.gender.value,
            },
        })

    edges = []
    for r in relationships:
        edge_type = "parentChildEdge" if r.relationship_type == models.RelationshipType.parent_child else "spouseEdge"
        edges.append({
            "id": f"rel-{r.id}",
            "source": f"person-{r.person1_id}",
            "target": f"person-{r.person2_id}",
            "type": edge_type,
            "data": {
                "relationship_type": r.relationship_type.value,
                "birth_order": r.birth_order,
                "rel_id": r.id,
            },
        })

    return {"nodes": nodes, "edges": edges}
