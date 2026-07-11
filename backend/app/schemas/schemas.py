from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HCPBase(BaseModel):
    name: str
    title: Optional[str] = None
    organization: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class HCPCreate(HCPBase):
    pass

class HCPUpdate(HCPBase):
    pass

class HCP(HCPBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FollowUpBase(BaseModel):
    action_description: str
    due_date: Optional[str] = None
    status: str = "Pending"

class FollowUpCreate(FollowUpBase):
    interaction_id: int

class FollowUpUpdate(FollowUpBase):
    pass

class FollowUp(FollowUpBase):
    id: int
    interaction_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class InteractionBase(BaseModel):
    interaction_type: str
    date: str
    time: str
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: str = "Neutral"
    outcomes: Optional[str] = None
    summary: Optional[str] = None

class InteractionCreate(InteractionBase):
    hcp_id: Optional[int] = None
    hcp_name: Optional[str] = None

class InteractionUpdate(InteractionBase):
    pass

class Interaction(InteractionBase):
    id: int
    user_id: int
    hcp_id: int
    follow_ups: List[FollowUp] = []
    hcp: Optional[HCP] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    extracted_data: dict
    sentiment: str
    follow_ups: List[str]
    confidence: float

class SearchResponse(BaseModel):
    results: List[HCP]

class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 20

class PaginatedResponse(BaseModel):
    items: List[Interaction]
    total: int
    page: int
    limit: int
    pages: int
