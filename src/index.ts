import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// Import advisors
import { architectureAdvisorDef, runArchitectureAdvisor } from "./advisors/architecture.js";
import { restApiAdvisorDef, runRestApiAdvisor } from "./advisors/restApi.js";
import { securityAdvisorDef, runSecurityAdvisor } from "./advisors/security.js";
import { vulnerabilitiesAdvisorDef, runVulnerabilitiesAdvisor } from "./advisors/vulnerabilities.js";
import { pentestAdvisorDef, runPentestAdvisor } from "./advisors/pentest.js";
import { telemetryAdvisorDef, runTelemetryAdvisor } from "./advisors/telemetry.js";
import { mcpAdvisorDef, runMcpAdvisor } from "./advisors/mcp.js";

const server = new Server(
  {
    name: "project-advisors-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      architectureAdvisorDef,
      restApiAdvisorDef,
      securityAdvisorDef,
      vulnerabilitiesAdvisorDef,
      pentestAdvisorDef,
      telemetryAdvisorDef,
      mcpAdvisorDef,
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "run_architecture_scan":
        return await runArchitectureAdvisor(args);
      case "run_rest_api_scan":
        return await runRestApiAdvisor(args);
      case "run_security_scan":
        return await runSecurityAdvisor(args);
      case "run_vulnerability_scan":
        return await runVulnerabilitiesAdvisor(args);
      case "run_pentest_scan":
        return await runPentestAdvisor(args);
      case "get_telemetry_stream":
        return await runTelemetryAdvisor(args);
      case "run_mcp_design_scan":
        return await runMcpAdvisor(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error executing ${name}: ${error.message}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Project Advisors MCP Server running on stdio");
}

main().catch(console.error);
