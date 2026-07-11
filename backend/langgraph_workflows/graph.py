from langgraph.graph import StateGraph, END
from typing import Any
import json
from config import settings

try:
    from langchain_groq import ChatGroq
except ImportError:
    from langchain.chat_models import ChatOpenAI as ChatGroq

from langgraph_workflows.tools.all_tools import (
    log_interaction_tool,
    edit_interaction_tool,
    search_hcp_tool,
    generate_summary_tool,
    schedule_followup_tool,
)
from langgraph_workflows.state import InteractionAgentState

# Initialize LLM
try:
    llm = ChatGroq(
        model=settings.GROQ_MODEL_PRIMARY,
        api_key=settings.GROQ_API_KEY,
        temperature=0.3,
    )
except Exception:
    # Fallback for development
    llm = None

def input_node(state: InteractionAgentState) -> InteractionAgentState:
    """Process user input."""
    state["current_step"] = "processing_input"
    return state

def router_node(state: InteractionAgentState) -> InteractionAgentState:
    """Route to appropriate tool based on user input."""
    state["current_step"] = "routing"
    user_input = state["user_input"].lower()
    
    if "edit" in user_input or "update" in user_input:
        state["current_step"] = "edit_interaction"
    elif "search" in user_input or "find" in user_input:
        state["current_step"] = "search_hcp"
    elif "summary" in user_input or "summarize" in user_input:
        state["current_step"] = "generate_summary"
    elif "follow" in user_input or "schedule" in user_input:
        state["current_step"] = "schedule_followup"
    else:
        state["current_step"] = "log_interaction"
    
    return state

def tool_node(state: InteractionAgentState) -> InteractionAgentState:
    """Execute the appropriate tool."""
    step = state["current_step"]
    results = {}
    
    try:
        if step == "log_interaction":
            results = json.loads(log_interaction_tool.invoke({}))
        elif step == "edit_interaction":
            results = json.loads(edit_interaction_tool.invoke({}))
        elif step == "search_hcp":
            results = json.loads(search_hcp_tool.invoke({}))
        elif step == "generate_summary":
            results = json.loads(generate_summary_tool.invoke({}))
        elif step == "schedule_followup":
            results = json.loads(schedule_followup_tool.invoke({}))
    except Exception as e:
        results = {"status": "error", "error": str(e)}
    
    state["tool_results"] = results
    return state

def output_node(state: InteractionAgentState) -> InteractionAgentState:
    """Format and return the final output."""
    state["current_step"] = "complete"
    state["final_output"] = state["tool_results"]
    return state

def create_workflow():
    """Create the LangGraph workflow."""
    workflow = StateGraph(InteractionAgentState)
    
    # Add nodes
    workflow.add_node("input", input_node)
    workflow.add_node("router", router_node)
    workflow.add_node("tool", tool_node)
    workflow.add_node("output", output_node)
    
    # Add edges
    workflow.set_entry_point("input")
    workflow.add_edge("input", "router")
    workflow.add_edge("router", "tool")
    workflow.add_edge("tool", "output")
    workflow.add_edge("output", END)
    
    return workflow.compile()

app = create_workflow()
