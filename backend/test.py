import asyncio

from fastmcp import Client

client = Client("http://localhost:8000/tools/mcp")


async def call_tool(name: str):
    async with client:
        result = await client.list_tools()
        print(result)


asyncio.run(call_tool("Ford"))
