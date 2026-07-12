# langgraph_g4f_full.py
# Requires: pip install -U langgraph langchain-openai python-dotenv
import httpx
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.agents import create_agent

load_dotenv()

# g4f's free, no-API-key-required Groq-backed proxy. The endpoint rejects
# requests that carry an Authorization header, so we use a custom httpx
# transport that strips it before the request leaves the wire.

class _StripAuthTransport(httpx.BaseTransport):
    def __init__(self):
        self._inner = httpx.HTTPTransport()
    def handle_request(self, request):
        request.headers.pop("authorization", None)
        return self._inner.handle_request(request)
    def close(self):
        self._inner.close()

llm = ChatOpenAI(
    model="llama-3.3-70b-versatile",
    base_url="https://g4f.space/api/groq/v1",
    api_key="sk-placeholder",
    http_client=httpx.Client(transport=_StripAuthTransport()),
)

# ---------------------- Tools ----------------------
@tool
def add_numbers(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b

@tool
def get_capital(country: str) -> str:
    """Return the capital city of a country."""
    capitals = {"france": "Paris", "japan": "Tokyo", "pakistan": "Islamabad"}
    return capitals.get(country.lower(), "Unknown")

# ---------------------- Tool-calling agent (LangGraph) ----------------------
# create_react_agent builds a small LangGraph graph under the hood: it loops
# between the LLM and your tools until the LLM stops requesting tool calls.
agent = create_agent(model=llm, tools=[add_numbers, get_capital])

# ---------------------- Structured output ----------------------
class Greeting(BaseModel):
    greeting: str
    mood: str

structured_llm = llm.with_structured_output(Greeting, method="function_calling")

if __name__ == "__main__":
    # 1) Plain chat / greeting
    plain_response = llm.invoke([
        SystemMessage(content="You are a warm, friendly assistant."),
        HumanMessage(content="Hi there! Please greet me."),
    ])
    print("Greeting:", plain_response.content)

    # 2) Tool calling via the LangGraph agent
    tool_response = agent.invoke({
        "messages": [HumanMessage(content="What's the capital of Japan, and what is 15 + 27?")]
    })
    print("Tool-calling result:", tool_response["messages"][-1].content)

    # 3) Structured output (returns a validated Greeting instance, not raw text)
    structured_response = structured_llm.invoke("Greet me warmly and tell me your mood.")
    print("Structured output:", structured_response)