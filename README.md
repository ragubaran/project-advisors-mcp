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
