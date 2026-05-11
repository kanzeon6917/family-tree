from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator

from models import Gender, RelationshipType


# --- Person ---

class PersonBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    gender: Gender = Gender.unknown
    notes: Optional[str] = None


class PersonCreate(PersonBase):
    pass


class PersonUpdate(PersonBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class PersonOut(PersonBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# --- Relationship ---

class RelationshipBase(BaseModel):
    person1_id: int
    person2_id: int
    relationship_type: RelationshipType
    birth_order: Optional[int] = None

    @field_validator("birth_order")
    @classmethod
    def birth_order_positive(cls, v):
        if v is not None and v < 1:
            raise ValueError("birth_order must be >= 1")
        return v


class RelationshipCreate(RelationshipBase):
    pass


class RelationshipUpdate(BaseModel):
    birth_order: Optional[int] = None


class RelationshipOut(RelationshipBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Tree ---

class TreeNodeData(BaseModel):
    id: int
    first_name: str
    last_name: str
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    gender: str


class TreeNode(BaseModel):
    id: str
    type: str
    position: dict
    data: TreeNodeData


class TreeEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str
    data: dict


class TreeResponse(BaseModel):
    nodes: List[TreeNode]
    edges: List[TreeEdge]
