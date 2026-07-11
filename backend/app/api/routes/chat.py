from fastapi import APIRouter
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.llm_service import LLMService
from langgraph_workflows.graph import app as workflow_app
from langgraph_workflows.state import InteractionAgentState

router = APIRouter(prefix="/chat", tags=["chat"])
llm_service = LLMService()

@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Process user message through LangGraph workflow and extract interaction data.
    """
    try:
        # Extract structured data from message
        extracted_data = llm_service.extract_interaction_data(request.message)
        
        # Detect sentiment
        sentiment = llm_service.detect_sentiment(request.message)
        
        # Suggest follow-up actions
        follow_ups = llm_service.suggest_followup_actions(request.message)
        
        # Run through LangGraph workflow
        initial_state = InteractionAgentState(
            messages=[{"role": "user", "content": request.message}],
            current_step="start",
            extracted_data=extracted_data,
            user_input=request.message,
            tool_results={},
            final_output={},
            sentiment=sentiment,
            follow_ups=follow_ups,
        )
        
        result = workflow_app.invoke(initial_state)
        
        return ChatResponse(
            response=f"I've extracted the following information from your interaction: {extracted_data.get('hcp_name', 'Unknown HCP')} - {extracted_data.get('interaction_type', 'Meeting')} on {extracted_data.get('date', 'TBD')}",
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
