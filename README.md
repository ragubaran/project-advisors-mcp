# Project Advisors MCP Server

An MCP (Model Context Protocol) server providing diagnostic tools to analyze software architecture, security, REST API compliance, and dependencies.

Supports: Python, Rust, Go, Node.js, Java, Swift (iOS), and Kotlin (Android).

> **Inspiration:** The design and concept of these diagnostic advisors were heavily inspired by the **BootUI** platform.

## Setup
```bash
npm install
npm run build
```

## Running the Server
The server runs via stdio:
```bash
npm start
```

## Available Tools
* `run_architecture_scan`
* `run_rest_api_scan`
* `run_security_scan`
* `run_vulnerability_scan`
* `run_pentest_scan`
* `get_telemetry_stream`
* `run_mcp_design_scan`

## Using the Agent Skill
This project includes a custom AI Agent Skill located at `.agents/skills/project-advisor/SKILL.md`. Agents like Antigravity will automatically use it when you ask them to "audit codebase" or "give project health score".

## How to use this MCP Server

To use this library with your AI Coding Assistant, you need to configure the assistant to spawn this server via its `stdio` transport mechanism. 

### 1. Claude Desktop Configuration
Add the following to your Claude Desktop config file (e.g. `~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "project-advisors": {
      "command": "node",
      "args": ["/Users/ragu/Code/project-advisors/dist/index.js"]
    }
  }
}
```
*Note: Make sure to run `npm run build` first so the `dist/index.js` file exists, and update the absolute path to point to your repository.*

### 2. Cursor IDE Configuration
1. Open Cursor Settings -> **Features** -> **MCP**.
2. Click **+ Add new MCP server**.
3. Set the Name to `project-advisors`.
4. Set the Type to `command`.
5. Set the Command to `node /absolute/path/to/project-advisors/dist/index.js`.
6. Click **Save**.

### 3. Example AI Prompts
Once connected, you can ask your AI Agent to run audits on your current workspace:
* *"Run an architecture scan on this project and tell me if there are any boundary violations."*
* *"Check my REST APIs for compliance and security issues."*
* *"Give me an overall health score for this project using the project advisor tools."*
