from typing import TypedDict, List, Optional, Any

class InteractionAgentState(TypedDict):
    """State for the interaction workflow agent."""
    messages: List[dict]
    current_step: str
    extracted_data: dict
    user_input: str
    tool_results: dict
    final_output: dict
    sentiment: str
    follow_ups: List[str]
