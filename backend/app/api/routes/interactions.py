from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import (
    InteractionCreate,
    InteractionUpdate,
    Interaction,
    PaginatedResponse,
)
from app.services.interaction_service import InteractionService

router = APIRouter(prefix="/interaction", tags=["interactions"])

# For now, using a default user_id = 1
DEFAULT_USER_ID = 1

@router.post("", response_model=Interaction)
def create_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db),
):
    try:
        db_interaction = InteractionService.create_interaction(
            db, interaction, DEFAULT_USER_ID
        )
        return db_interaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating interaction: {str(e)}")

@router.get("", response_model=PaginatedResponse)
def get_interactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * limit
    interactions, total = InteractionService.get_interactions(
        db, DEFAULT_USER_ID, skip=skip, limit=limit
    )
    pages = (total + limit - 1) // limit
    
    return PaginatedResponse(
        items=interactions,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
    )

@router.get("/{interaction_id}", response_model=Interaction)
def get_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
):
    interaction = InteractionService.get_interaction(db, interaction_id)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.put("/{interaction_id}", response_model=Interaction)
def update_interaction(
    interaction_id: int,
    interaction: InteractionUpdate,
    db: Session = Depends(get_db),
):
    db_interaction = InteractionService.update_interaction(
        db, interaction_id, interaction
    )
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return db_interaction

@router.delete("/{interaction_id}")
def delete_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
):
    success = InteractionService.delete_interaction(db, interaction_id)
    if not success:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return {"message": "Interaction deleted successfully"}
