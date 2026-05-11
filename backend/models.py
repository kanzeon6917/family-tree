import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Date, Text, DateTime,
    Enum, ForeignKey, UniqueConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    unknown = "unknown"


class RelationshipType(str, enum.Enum):
    parent_child = "parent_child"
    spouse = "spouse"


class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    birth_date = Column(Date, nullable=True)
    death_date = Column(Date, nullable=True)
    gender = Column(Enum(Gender), nullable=False, default=Gender.unknown)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    relationships_as_p1 = relationship(
        "Relationship",
        foreign_keys="Relationship.person1_id",
        back_populates="person1",
        cascade="all, delete-orphan",
    )
    relationships_as_p2 = relationship(
        "Relationship",
        foreign_keys="Relationship.person2_id",
        back_populates="person2",
        cascade="all, delete-orphan",
    )


class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(Integer, primary_key=True, index=True)
    person1_id = Column(Integer, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    person2_id = Column(Integer, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)
    relationship_type = Column(Enum(RelationshipType), nullable=False)
    # For parent_child: birth order among siblings (1=eldest, 2=second, ...)
    birth_order = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    person1 = relationship("Person", foreign_keys=[person1_id], back_populates="relationships_as_p1")
    person2 = relationship("Person", foreign_keys=[person2_id], back_populates="relationships_as_p2")

    __table_args__ = (
        UniqueConstraint("person1_id", "person2_id", "relationship_type", name="uq_relationship"),
    )
