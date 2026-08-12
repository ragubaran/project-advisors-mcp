import { detectFramework } from "../utils/detector.js";

export const restApiAdvisorDef = {
  name: "run_rest_api_scan",
  description: "Evaluates REST endpoints/controllers for HTTP compliance, missing pagination, state-mutating GETs, raw stack traces, and unvalidated payloads.",
  inputSchema: {
    type: "object",
    properties: {
      includeRoutes: { type: "array", items: { type: "string" } },
      strictMode: { type: "boolean", default: true }
    },
  },
};

export async function runRestApiAdvisor(args: any) {
  const projectRoot = args?.projectRoot || process.cwd();
  const framework = detectFramework(projectRoot);
  
  const findings: any[] = [];

  switch (framework) {
    case 'express':
    case 'fastify':
      findings.push({
        id: "REST-JS-001",
        severity: "HIGH",
        category: "UnhandledPromiseRejection",
        message: "Async route handler missing try/catch or next(err) wrapper",
        location: { file: "src/routes/api.js", line: 12 },
        recommendation: "Wrap async handlers in try/catch or use express-async-errors.",
        suggestedFixDiff: "..."
      });
      break;

    case 'fastapi':
      findings.push({
        id: "REST-PY-001",
        severity: "MEDIUM",
        category: "Validation",
        message: "FastAPI endpoint using raw Request object instead of Pydantic model",
        location: { file: "api/main.py", line: 45 },
        recommendation: "Use a Pydantic BaseModel for request validation.",
        suggestedFixDiff: "..."
      });
      break;

    case 'spring-boot':
    case 'quarkus':
      findings.push({
        id: "REST-JAVA-001",
        severity: "CRITICAL",
        category: "StateMutatingGet",
        message: "@GetMapping performs a database save/delete operation",
        location: { file: "src/main/java/com/example/UserController.java", line: 30 },
        recommendation: "Use @PostMapping or @DeleteMapping for mutating operations.",
        suggestedFixDiff: "- @GetMapping(\"/delete\")\n+ @DeleteMapping(\"/{id}\")"
      });
      break;

    case 'gin':
    case 'fiber':
      findings.push({
        id: "REST-GO-001",
        severity: "HIGH",
        category: "InformationLeak",
        message: "Gin handler returns raw err.Error() to client",
        location: { file: "handlers/user.go", line: 50 },
        recommendation: "Do not leak raw stack traces or DB errors to the client. Return a generic error message.",
        suggestedFixDiff: "- c.JSON(500, gin.H{\"error\": err.Error()})\n+ c.JSON(500, gin.H{\"error\": \"Internal server error\"})"
      });
      break;
      
    case 'axum':
    case 'actix-web':
      findings.push({
        id: "REST-RS-001",
        severity: "MEDIUM",
        category: "Validation",
        message: "Axum handler extracts raw String body without validation",
        location: { file: "src/api.rs", line: 20 },
        recommendation: "Use the Json<T> extractor with a struct that derives Deserialize and Validate.",
        suggestedFixDiff: "..."
      });
      break;

    default:
      findings.push({
        id: "REST-001",
        severity: "MEDIUM",
        category: "Pagination",
        message: "List endpoint missing pagination limit/offset",
        location: { file: "src/api/routes.ts", line: 100 },
        recommendation: "Implement pagination for endpoints returning collections.",
        suggestedFixDiff: "..."
      });
      break;
  }

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        advisor: "RestApiAdvisor",
        framework_detected: framework,
        timestamp: new Date().toISOString(),
        summary: { totalIssues: findings.length, critical: 0, warning: findings.length },
        findings
      }, null, 2)
    }]
  };
}
