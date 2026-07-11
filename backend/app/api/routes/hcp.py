from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import HCP, SearchResponse
from app.services.interaction_service import HCPService

router = APIRouter(prefix="/hcp", tags=["hcp"])

@router.get("/search", response_model=SearchResponse)
def search_hcp(
    query: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    results = HCPService.search_hcp(db, query, limit)
    return SearchResponse(results=results)
