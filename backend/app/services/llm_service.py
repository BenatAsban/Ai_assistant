from langchain.schema import HumanMessage, AIMessage
from config import settings
import json
from datetime import datetime, timedelta

try:
    from langchain_groq import ChatGroq
except ImportError:
    ChatGroq = None

class LLMService:
    def __init__(self):
        self.llm = None
        try:
            if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "":
                self.llm = ChatGroq(
                    model=settings.GROQ_MODEL_PRIMARY,
                    api_key=settings.GROQ_API_KEY,
                    temperature=0.3,
                    max_tokens=1024,
                )
        except Exception as e:
            print(f"Warning: Could not initialize Groq LLM: {e}")
            self.llm = None
    
    def extract_interaction_data(self, text: str) -> dict:
        """Extract structured interaction data from free-form text."""
        if not self.llm:
            return self._extract_fallback(text)
        
        try:
            prompt = f"""
Analyze the following healthcare professional interaction notes and extract structured data.
Return ONLY valid JSON with these fields:
{{
  "hcp_name": "name of healthcare professional",
  "interaction_type": "Call/Meeting/Email/In-Person/Virtual",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "attendees": "people involved",
  "topics_discussed": "main discussion points",
  "materials_shared": "documents or resources",
  "samples_distributed": "samples provided",
  "sentiment": "Positive/Neutral/Negative",
  "outcomes": "results and agreements"
}}

Interaction notes:
{text}

Return ONLY the JSON, no other text.
"""
            response = self.llm.invoke([HumanMessage(content=prompt)])
            content = response.content.strip()
            
            # Try to parse JSON
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                # Try to extract JSON from response
                start = content.find('{')
                end = content.rfind('}') + 1
                if start >= 0 and end > start:
                    return json.loads(content[start:end])
                return self._extract_fallback(text)
        except Exception as e:
            print(f"Error in LLM extraction: {e}")
            return self._extract_fallback(text)
    
    def detect_sentiment(self, text: str) -> str:
        """Detect sentiment from text."""
        if not self.llm:
            return "Neutral"
        
        try:
            prompt = f"""
Detect the sentiment of the following text. Return ONLY one word: Positive, Neutral, or Negative.

Text: {text}
"""
            response = self.llm.invoke([HumanMessage(content=prompt)])
            sentiment = response.content.strip()
            if sentiment in ["Positive", "Neutral", "Negative"]:
                return sentiment
            return "Neutral"
        except Exception:
            return "Neutral"
    
    def suggest_followup_actions(self, interaction_text: str) -> list:
        """Suggest follow-up actions based on interaction."""
        if not self.llm:
            return []
        
        try:
            prompt = f"""
Based on this healthcare professional interaction, suggest 2-3 brief follow-up actions.
Return ONLY a JSON array of strings, no other text.

Interaction: {interaction_text}

Example: ["Send product information", "Schedule follow-up call for next month", "Provide sample delivery date"]
"""
            response = self.llm.invoke([HumanMessage(content=prompt)])
            content = response.content.strip()
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                start = content.find('[')
                end = content.rfind(']') + 1
                if start >= 0 and end > start:
                    return json.loads(content[start:end])
                return []
        except Exception:
            return []
    
    def _extract_fallback(self, text: str) -> dict:
        """Fallback extraction when LLM is not available."""
        return {
            "hcp_name": "",
            "interaction_type": "Meeting",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "time": datetime.now().strftime("%H:%M"),
            "attendees": "",
            "topics_discussed": text[:200] if text else "",
            "materials_shared": "",
            "samples_distributed": "",
            "sentiment": "Neutral",
            "outcomes": "",
        }
