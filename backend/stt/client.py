# import asyncio
# import json
# from fastmcp import Client
# from dotenv import load_dotenv
# from google import genai

# # Load environment variables
# load_dotenv()

# # Initialize Gemini client
# gemini_client = genai.Client()

# config = {
#     "mcpServers": {
#         "mcp-server": {
#             "transport": "http", 
#             "url": "http://localhost:8008/mcp",
#             "headers": {"Authorization": "bbd3f8b47e44bf4ddaafa0dd434a8b38c25e66affc3605a1f7c1a1eb5e0638c0"}
#         }
#     }
# }

# # Create HTTP client for MCP server
# mcp_client = Client(config)

# async def get_available_tools():
#     """Get list of available MCP tools"""
#     try:
#         async with mcp_client:
#             tools = await mcp_client.list_tools()
#             return [{"name": tool.name, "description": getattr(tool, 'description', 'No description')} for tool in tools]
#     except Exception as e:
#         print(f"Error getting tools: {e}")
#         return []

# async def execute_mcp_tool(tool_name: str, parameters: dict):
#     """Execute a specific MCP tool with parameters"""
#     try:
#         async with mcp_client:
#             result = await mcp_client.call_tool(tool_name, parameters)
#             return result.content[0].text if result.content else "No result"
#     except Exception as e:
#         return f"Error executing tool {tool_name}: {e}"

# def ask_gemini_to_pick_tool(user_question: str, available_tools: list) -> dict:
#     """Ask Gemini to analyze question and pick the right tool"""
    
#     tools_description = "\n".join([f"- {tool['name']}: {tool['description']}" for tool in available_tools])
    
#     prompt = f"""
# You are an AI assistant that helps users by selecting the appropriate tool and parameters.

# USER QUESTION: "{user_question}"

# AVAILABLE TOOLS:
# {tools_description}

# TASK: Analyze the user's question and determine:
# 1. Which tool to use (if any)
# 2. What parameters to pass to that tool

# RESPONSE FORMAT: Return a JSON object with this exact structure:
# {{
#     "tool_needed": true/false,
#     "tool_name": "tool_name_here" or null,
#     "parameters": {{"param1": value1, "param2": value2}} or null,
#     "reasoning": "explain why you chose this tool and parameters"
# }}

# EXAMPLES:


# Analyze the question and respond with the JSON:
# """

#     try:
#         resp = gemini_client.models.generate_content(
#             model="gemini-2.0-flash-exp",
#             contents=prompt
#         )
        
#         # Try to parse JSON from response
#         response_text = resp.text.strip()
        
#         # Handle markdown code blocks
#         if "```json" in response_text:
#             response_text = response_text.split("```json")[1].split("```")[0].strip()
#         elif "```" in response_text:
#             response_text = response_text.split("```")[1].strip()
            
#         return json.loads(response_text)
        
#     except json.JSONDecodeError as e:
#         print(f"Failed to parse Gemini response as JSON: {e}")
#         print(f"Raw response: {resp.text}")
#         return {"tool_needed": False, "reasoning": "Failed to parse response"}
#     except Exception as e:
#         print(f"Error with Gemini: {e}")
#         return {"tool_needed": False, "reasoning": f"Error: {e}"}

# async def process_user_question(user_question: str):
#     """Main function to process user questions with Gemini + MCP"""
    
#     print(f"\n🤔 User Question: {user_question}")
#     print("=" * 50)
    
#     # Step 1: Get available tools
#     print("1️⃣ Getting available MCP tools...")
#     available_tools = await get_available_tools()
#     print(f"Available tools: {[tool['name'] for tool in available_tools]}")
    
#     # Step 2: Ask Gemini to pick the right tool
#     print("\n2️⃣ Asking Gemini to analyze question...")
#     gemini_decision = ask_gemini_to_pick_tool(user_question, available_tools)
#     print(f"Gemini's decision: {json.dumps(gemini_decision, indent=2)}")
    
#     # Step 3: Execute the tool if needed
#     if gemini_decision.get("tool_needed", False):
#         tool_name = gemini_decision.get("tool_name")
#         parameters = gemini_decision.get("parameters", {})
        
#         print(f"\n3️⃣ Executing tool '{tool_name}' with parameters: {parameters}")
#         result = await execute_mcp_tool(tool_name, parameters)
#         print(f"📊 Result: {result}")
        
#         # Step 4: Ask Gemini to format the final response
#         final_prompt = f"""
# The user asked: "{user_question}"

# We used the {tool_name} tool with parameters {parameters} and got this result: {result}

# Please provide a natural, helpful response to the user's original question using this result.
# """
        
#         try:
#             final_resp = gemini_client.models.generate_content(
#                 model="gemini-2.0-flash-exp",
#                 contents=final_prompt
#             )
#             print(f"\n✅ Final Answer: {final_resp.text}")
#         except Exception as e:
#             print(f"✅ Final Answer: The result is {result}")
            
#     else:
#         print(f"\n💭 Gemini says: {gemini_decision.get('reasoning', 'No tool needed')}")

# async def main():
#     print("🚀 Gemini + MCP Integration Demo")
#     print("=" * 50)
    
#     # Test questions
#     test_questions = [
#         "What is 15 plus 27?"
#     ]
    
#     # Process each test question
#     for question in test_questions:
#         await process_user_question(question)
#         print("\n" + "="*70 + "\n")
    
#     # Interactive mode
#     print("💬 Interactive Mode - Ask me anything! (type 'exit' to quit)")
#     while True:
#         try:
#             user_input = input("\nYour question: ").strip()
#             if user_input.lower() in ['exit', 'quit', '']:
#                 break
            
#             await process_user_question(user_input)
            
#         except KeyboardInterrupt:
#             print("\nGoodbye!")
#             break
#         except Exception as e:
#             print(f"❌ Error: {e}")

# if __name__ == "__main__":
#     asyncio.run(main())

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

async def get_database_context():
    """Get database context first before answering any questions"""
    try:
        print("🗄️ Getting database context...")
        context_result = await execute_mcp_tool("get_database_context", {})
        relationships_result = await execute_mcp_tool("get_table_relationships", {})
        
        return {
            "database_context": context_result,
            "relationships": relationships_result
        }
    except Exception as e:
        print(f"Error getting database context: {e}")
        return None

def ask_gemini_with_context(user_question: str, database_context: dict, available_tools: list) -> dict:
    """Ask Gemini to analyze question with database context and pick the right tool"""
    
    tools_description = "\n".join([f"- {tool['name']}: {tool['description']}" for tool in available_tools])
    
    # Format the database context properly
    context_info = ""
    if database_context:
        if database_context.get("database_context"):
            context_info += f"Database Structure:\n{database_context['database_context']}\n\n"
        if database_context.get("relationships"):
            context_info += f"Table Relationships:\n{database_context['relationships']}\n\n"
    
    prompt = f"""
You are helping to query a medical database. Here's what you need to know:

{context_info}

Available MCP tools:
{tools_description}

User Question: "{user_question}"

IMPORTANT WORKFLOW:
1. First, analyze the database context provided above to understand:
   - What tables actually exist in the database
   - What columns each table has
   - The correct table names to use

2. Based on the database context, determine:
   - Which table(s) contain the information needed to answer the question
   - Which tool is most appropriate for the query
   - What parameters to use with the EXACT table names from the context

3. Return your analysis as JSON:
{{
  "context_understood": true/false,
  "available_tables": ["list", "of", "actual", "tables"],
  "relevant_table": "exact_table_name_from_context",
  "tool_needed": true/false,
  "tool_name": "exact_tool_name",
  "parameters": {{"param1": "value1", "param2": "value2"}},
  "reasoning": "Explain your choice based on the database context and table names"
}}

CRITICAL: Use the EXACT table names from the database context, not assumed names.
If the database context shows a table is called "doctor_table", use "doctor_table", not "doctors".
"""

    try:
        resp = gemini_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=prompt
        )
        
        response_text = resp.text.strip()
        
        # Handle markdown code blocks
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].strip()
        
        # Find JSON in the response
        if "{" in response_text and "}" in response_text:
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            json_content = response_text[json_start:json_end]
            return json.loads(json_content)
        else:
            return json.loads(response_text)
        
    except json.JSONDecodeError as e:
        print(f"Failed to parse Gemini response as JSON: {e}")
        print(f"Raw response: {resp.text}")
        return {
            "context_understood": False,
            "tool_needed": False,
            "reasoning": "Failed to parse response"
        }
    except Exception as e:
        print(f"Error with Gemini: {e}")
        return {
            "context_understood": False,
            "tool_needed": False,
            "reasoning": f"Error: {e}"
        }

async def process_user_question(user_question: str):
    """Process user question with proper workflow: context -> analysis -> query -> answer"""
    
    print(f"\n🤔 User Question: {user_question}")
    print("=" * 50)
    
    # Step 1: Get database context FIRST
    print("1️⃣ Getting database context...")
    database_context = await get_database_context()
    
    if not database_context:
        return "❌ Unable to get database context. Please check the MCP server connection."
    
    # Step 2: Get available tools
    print("2️⃣ Getting available MCP tools...")
    available_tools = await get_available_tools()
    print(f"Available tools: {[tool['name'] for tool in available_tools]}")
    
    # Step 3: Ask Gemini to analyze with context
    print("3️⃣ Asking Gemini to analyze question with database context...")
    gemini_decision = ask_gemini_with_context(user_question, database_context, available_tools)
    print(f"Gemini's analysis: {json.dumps(gemini_decision, indent=2)}")
    
    # Step 4: Execute tool if needed
    if gemini_decision.get("tool_needed") and gemini_decision.get("tool_name"):
        tool_name = gemini_decision["tool_name"]
        parameters = gemini_decision.get("parameters", {})
        
        print(f"4️⃣ Executing tool '{tool_name}' with parameters: {parameters}")
        tool_result = await execute_mcp_tool(tool_name, parameters)
        print(f"📊 Tool Result: {tool_result}")
        
        # Step 5: Generate final answer
        final_prompt = f"""
Based on the database query results, provide a clear answer to the user's question.

User Question: "{user_question}"
Database Query Results: {tool_result}
Context Understanding: {gemini_decision.get('reasoning', '')}

Provide a helpful, natural language response. If the query found results, summarize them clearly. If no results were found, explain that clearly too.
"""
        
        try:
            final_resp = gemini_client.models.generate_content(
                model="gemini-2.0-flash-exp",
                contents=final_prompt
            )
            
            final_answer = final_resp.text.strip()
            print(f"✅ Final Answer: {final_answer}")
            return final_answer
            
        except Exception as e:
            print(f"✅ Final Answer: Based on the query: {tool_result}")
            return f"Query completed. Result: {tool_result}"
    
    else:
        # No tool needed or context issues
        reasoning = gemini_decision.get("reasoning", "Unable to determine appropriate action")
        print(f"ℹ️ No tool execution needed: {reasoning}")
        return f"Based on the database context: {reasoning}"

async def main():
    print("🚀 Gemini + MCP Integration with Database Context")
    print("=" * 50)
    
    # Test questions
    test_questions = [
        "Is there a doctor Emily?",
        "Show me recent clinical notes",
        "What tables are available in the database?"
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