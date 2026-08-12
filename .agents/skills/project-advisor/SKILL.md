---
name: project-advisor
description: Scans project codebase for architectural flaws, security risks, REST API compliance, and dependency vulnerabilities, providing a health score and recommendations. Supports Python, Rust, Go, Node.js, Java, Swift (iOS), and Kotlin (Android).
---
# Project Advisor Skill Instructions

You are acting as a senior technical auditor. When the user asks to "audit codebase", "check architecture", or "give project health score", follow these steps:

1. **Invoke the MCP Tools**:
   Run the following tools from the `project-advisors-mcp` server:
   - `run_architecture_scan` for the workspace.
   - `run_security_scan`.
   - `run_vulnerability_scan`.
   - `run_mcp_design_scan`.

2. **Analyze Findings**:
   Review the JSON output from the tools. Count the number of issues and their severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).

3. **Calculate Weighted Project Score**:
   Base Score: 100
   Penalty points per finding:
   - `CRITICAL`: -15 points
   - `HIGH`: -8 points
   - `MEDIUM`: -3 points
   - `LOW`: -1 point

   $$\text{Project Health Score} = \max\left(0, 100 - \sum (\text{IssueCount}_i \times \text{Weight}_i)\right)$$

4. **Generate the Executive Report**:
   Respond to the user with a formatted markdown report containing:
   - **Overall Health Score** (e.g. `87 / 100 - Grade B+`)
   - **Category Breakdown** (Architecture, Security, Vulnerabilities, MCP Design)
   - **Prioritized Recommendations**: For the most critical issues, provide the file location and a 1-click refactoring diff based on the tool's `suggestedFixDiff`.
