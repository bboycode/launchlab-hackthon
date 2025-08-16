import asyncio
import json
from fastmcp import Client
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Initialize Gemini client
gemini_client = genai.Client()

config = {
    "mcpServers": {
        "mcp-server": {
            "transport": "http", 
            "url": "http://localhost:8008/mcp",
            "headers": {"Authorization": "bbd3f8b47e44bf4ddaafa0dd434a8b38c25e66affc3605a1f7c1a1eb5e0638c0"}
        }
    }
}

# Create HTTP client for MCP server
mcp_client = Client(config)

async def get_available_tools():
    """Get list of available MCP tools"""
    try:
        async with mcp_client:
            tools = await mcp_client.list_tools()
            return [{"name": tool.name, "description": getattr(tool, 'description', 'No description')} for tool in tools]
    except Exception as e:
        print(f"Error getting tools: {e}")
        return []

async def execute_mcp_tool(tool_name: str, parameters: dict):
    """Execute a specific MCP tool with parameters"""
    try:
        async with mcp_client:
            result = await mcp_client.call_tool(tool_name, parameters)
            return result.content[0].text if result.content else "No result"
    except Exception as e:
        return f"Error executing tool {tool_name}: {e}"

def ask_gemini_to_pick_tool(user_question: str, available_tools: list) -> dict:
    """Ask Gemini to analyze question and pick the right tool"""
    
    tools_description = "\n".join([f"- {tool['name']}: {tool['description']}" for tool in available_tools])
    
    prompt = f"""
You are an AI assistant that helps users by selecting the appropriate tool and parameters.

USER QUESTION: "{user_question}"

AVAILABLE TOOLS:
{tools_description}

TASK: Analyze the user's question and determine:
1. Which tool to use (if any)
2. What parameters to pass to that tool

RESPONSE FORMAT: Return a JSON object with this exact structure:
{{
    "tool_needed": true/false,
    "tool_name": "tool_name_here" or null,
    "parameters": {{"param1": value1, "param2": value2}} or null,
    "reasoning": "explain why you chose this tool and parameters"
}}

EXAMPLES:


Analyze the question and respond with the JSON:
"""

    try:
        resp = gemini_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt
        )
        
        # Try to parse JSON from response
        response_text = resp.text.strip()
        
        # Handle markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].strip()
            
        return json.loads(response_text)
        
    except json.JSONDecodeError as e:
        print(f"Failed to parse Gemini response as JSON: {e}")
        print(f"Raw response: {resp.text}")
        return {"tool_needed": False, "reasoning": "Failed to parse response"}
    except Exception as e:
        print(f"Error with Gemini: {e}")
        return {"tool_needed": False, "reasoning": f"Error: {e}"}

async def process_user_question(user_question: str):
    """Main function to process user questions with Gemini + MCP"""
    
    print(f"\n🤔 User Question: {user_question}")
    print("=" * 50)
    
    # Step 1: Get available tools
    print("1️⃣ Getting available MCP tools...")
    available_tools = await get_available_tools()
    print(f"Available tools: {[tool['name'] for tool in available_tools]}")
    
    # Step 2: Ask Gemini to pick the right tool
    print("\n2️⃣ Asking Gemini to analyze question...")
    gemini_decision = ask_gemini_to_pick_tool(user_question, available_tools)
    print(f"Gemini's decision: {json.dumps(gemini_decision, indent=2)}")
    
    # Step 3: Execute the tool if needed
    if gemini_decision.get("tool_needed", False):
        tool_name = gemini_decision.get("tool_name")
        parameters = gemini_decision.get("parameters", {})
        
        print(f"\n3️⃣ Executing tool '{tool_name}' with parameters: {parameters}")
        result = await execute_mcp_tool(tool_name, parameters)
        print(f"📊 Result: {result}")
        
        # Step 4: Ask Gemini to format the final response
        final_prompt = f"""
The user asked: "{user_question}"

We used the {tool_name} tool with parameters {parameters} and got this result: {result}

Please provide a natural, helpful response to the user's original question using this result.
"""
        
        try:
            final_resp = gemini_client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=final_prompt
            )
            print(f"\n✅ Final Answer: {final_resp.text}")
        except Exception as e:
            print(f"✅ Final Answer: The result is {result}")
            
    else:
        print(f"\n💭 Gemini says: {gemini_decision.get('reasoning', 'No tool needed')}")

async def main():
    print("🚀 Gemini + MCP Integration Demo")
    print("=" * 50)
    
    # Test questions
    test_questions = [
        "What is 15 plus 27?"
    ]
    
    # Process each test question
    for question in test_questions:
        await process_user_question(question)
        print("\n" + "="*70 + "\n")
    
    # Interactive mode
    print("💬 Interactive Mode - Ask me anything! (type 'exit' to quit)")
    while True:
        try:
            user_input = input("\nYour question: ").strip()
            if user_input.lower() in ['exit', 'quit', '']:
                break
            
            await process_user_question(user_input)
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())