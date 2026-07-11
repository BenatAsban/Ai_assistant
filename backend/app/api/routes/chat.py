from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.llm_service import LLMService

router = APIRouter(prefix="/chat", tags=["chat"])
llm_service = LLMService()

@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Process user message and extract interaction data.
    """
    try:
        # Extract structured data from message
        extracted_data = llm_service.extract_interaction_data(request.message)
        
        # Detect sentiment
        sentiment = llm_service.detect_sentiment(request.message)
        
        # Suggest follow-up actions
        follow_ups = llm_service.suggest_followup_actions(request.message)
        
        hcp_name = extracted_data.get('hcp_name', 'Unknown HCP')
        interaction_type = extracted_data.get('interaction_type', 'Meeting')
        date = extracted_data.get('date', 'TBD')
        
        return ChatResponse(
            response=f"I've extracted the following information from your interaction: {hcp_name} - {interaction_type} on {date}",
            extracted_data=extracted_data,
            sentiment=sentiment,
            follow_ups=follow_ups,
            confidence=0.85,
        )
    except Exception as e:
        return ChatResponse(
            response=f"I encountered an error processing your message: {str(e)}",
            extracted_data={},
            sentiment="Neutral",
            follow_ups=[],
            confidence=0.0,
        )
