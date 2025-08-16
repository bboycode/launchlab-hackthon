# Some sources:
# https://composio.dev/blog/mcp-server-step-by-step-guide-to-building-from-scrtch
# https://medium.com/data-engineering-with-dremio/building-a-basic-mcp-server-with-python-4c34c41031ed
# https://www.solo.io/blog/understanding-mcp-authorization-step-by-step-part-one
# https://gofastmcp.com/tutorials/create-mcp-server

# basic import 
import os
import math
from fastmcp import FastMCP
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

# instantiate an MCP server client
mcp = FastMCP("MCP_Server")

# Configure the server to run on all interfaces for Docker
def run_server(transport="stdio", host="localhost", port=8008):
    """Run the MCP server with configurable transport"""
    mcp.run(transport=transport, host=host, port=port)

    #  division tool
@mcp.tool() 
def request_stat(q: str) -> str:
    

 
# execute and return the stdio output
if __name__ == "__main__":
    print("Starting MCP server...")
    run_server(transport="streamable-http", host="localhost", port=8008)