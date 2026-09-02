import { test } from "node:test";
import assert from "node:assert/strict";

import { architectureAdvisorDef, runArchitectureAdvisor } from "../src/advisors/architecture.js";
import { restApiAdvisorDef, runRestApiAdvisor } from "../src/advisors/restApi.js";
import { securityAdvisorDef, runSecurityAdvisor } from "../src/advisors/security.js";
import { vulnerabilitiesAdvisorDef, runVulnerabilitiesAdvisor } from "../src/advisors/vulnerabilities.js";
import { pentestAdvisorDef, runPentestAdvisor } from "../src/advisors/pentest.js";
import { telemetryAdvisorDef, runTelemetryAdvisor } from "../src/advisors/telemetry.js";
import { mcpAdvisorDef, runMcpAdvisor } from "../src/advisors/mcp.js";

const allTools = [
  architectureAdvisorDef,
  restApiAdvisorDef,
  securityAdvisorDef,
  vulnerabilitiesAdvisorDef,
  pentestAdvisorDef,
  telemetryAdvisorDef,
  mcpAdvisorDef,
];

test("All 7 tools declare all four annotations as boolean values", () => {
  assert.equal(allTools.length, 7);

  const requiredHints = ["readOnlyHint", "destructiveHint", "idempotentHint", "openWorldHint"] as const;

  for (const tool of allTools) {
    assert.ok(tool.annotations, `Tool ${tool.name} must have annotations property`);

    for (const hint of requiredHints) {
      assert.ok(
        hint in tool.annotations,
        `Tool ${tool.name} is missing hint: ${hint}`
      );
      assert.equal(
        typeof tool.annotations[hint],
        "boolean",
        `Tool ${tool.name} hint ${hint} must be a boolean, got ${typeof tool.annotations[hint]}`
      );
    }
  }
});

test("Tool annotation values match handler behavior", () => {
  // run_architecture_scan: read-only local scan
  assert.deepEqual(architectureAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });

  // run_rest_api_scan: read-only local scan
  assert.deepEqual(restApiAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });

  // run_security_scan: read-only local audit
  assert.deepEqual(securityAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });

  // run_vulnerability_scan: read-only external CVE lookup
  assert.deepEqual(vulnerabilitiesAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true,
  });

  // run_pentest_scan: non-read-only active HTTP request probing to target server
  assert.deepEqual(pentestAdvisorDef.annotations, {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  });

  // get_telemetry_stream: read-only external live stream reading
  assert.deepEqual(telemetryAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  });

  // run_mcp_design_scan: read-only local design scan
  assert.deepEqual(mcpAdvisorDef.annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  });
});

test("runArchitectureAdvisor execution", async () => {
  const result = await runArchitectureAdvisor({ projectRoot: process.cwd() });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "ArchitectureAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runRestApiAdvisor execution", async () => {
  const result = await runRestApiAdvisor({ strictMode: true });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "RestApiAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runSecurityAdvisor execution", async () => {
  const result = await runSecurityAdvisor({ scanSecrets: true, scanConfig: true });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "SecurityAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runVulnerabilitiesAdvisor execution", async () => {
  const result = await runVulnerabilitiesAdvisor({ manifestPath: "package.json" });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "VulnerabilitiesAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runPentestAdvisor execution", async () => {
  const result = await runPentestAdvisor({ targetUrl: "http://localhost:8080", payloadTypes: ["sqli", "xss"] });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "PentestAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runTelemetryAdvisor execution", async () => {
  const result = await runTelemetryAdvisor({ limit: 10, severity: "INFO" });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "TelemetryAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});

test("runMcpAdvisor execution", async () => {
  const result = await runMcpAdvisor({ projectRoot: process.cwd() });
  assert.ok(result.content);
  assert.equal(result.content[0].type, "text");
  const parsed = JSON.parse(result.content[0].text);
  assert.equal(parsed.advisor, "McpAdvisor");
  assert.ok(Array.isArray(parsed.findings));
});
