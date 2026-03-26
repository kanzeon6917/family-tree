from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import persons, relationships, tree

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Family Tree API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(persons.router)
app.include_router(relationships.router)
app.include_router(tree.router)


@app.get("/")
def root():
    return {"message": "Family Tree API"}
