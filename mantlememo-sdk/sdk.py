from mantlememo import Agent

# Initialize agent with wallet address for authentication
agent = Agent(
    agent_id="custom-a29ae9f0",
    chat_id="d8de5399-424b-4a48-864f-146a7628c130",
    wallet_address="0x90df1528054FFccA5faE38EC6447f1557168620E",
    base_url="http://localhost:8000"  # Optional: defaults to http://localhost:8000
)

# Send a message to the agent
# The message is saved to chat history and memory is automatically updated
response = agent.chat("Analyze this chat")

print(response)