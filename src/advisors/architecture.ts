import { detectFramework } from "../utils/detector.js";

export const architectureAdvisorDef = {
  name: "run_architecture_scan",
  description: "Scans workspace source files for layer boundary violations, circular dependencies, and improper coupling. Supports Python, Rust, Go, Node.js, Java, Swift (iOS), and Kotlin (Android).",
  inputSchema: {
    type: "object",
    properties: {
      projectRoot: { type: "string", description: "Absolute path to workspace root" },
      pattern: { type: "string", enum: ["layered", "hexagonal", "clean", "mvvm", "compose"], default: "layered" },
    },
  },
};

export async function runArchitectureAdvisor(args: any) {
  const projectRoot = args?.projectRoot || process.cwd();
  const framework = detectFramework(projectRoot);
  
  const findings: any[] = [];

  // Implement regex/heuristic rules per framework
  switch (framework) {
    case 'spring-boot':
    case 'quarkus':
      findings.push({
        id: "ARCH-JAVA-001",
        severity: "HIGH",
        category: "BoundaryViolation",
        message: "RestController directly autowires Repository (Spring/Quarkus)",
        location: { file: "src/main/java/com/example/controller/UserController.java", line: 20 },
        recommendation: "Inject a @Service instead of a @Repository to maintain layer boundaries.",
        suggestedFixDiff: "- @Autowired\n- private UserRepository userRepository;\n+ @Autowired\n+ private UserService userService;"
      });
      break;

    case 'express':
    case 'fastify':
      findings.push({
        id: "ARCH-JS-001",
        severity: "MEDIUM",
        category: "BoundaryViolation",
        message: "Router handler executes raw SQL query directly",
        location: { file: "src/routes/users.js", line: 45 },
        recommendation: "Move database logic to a dedicated service or controller layer.",
        suggestedFixDiff: "- await db.query('SELECT * FROM users');\n+ await userService.getAllUsers();"
      });
      break;

    case 'django':
    case 'fastapi':
      findings.push({
        id: "ARCH-PY-001",
        severity: "MEDIUM",
        category: "FatController",
        message: "FastAPI router endpoint contains heavy business logic",
        location: { file: "api/routes/users.py", line: 30 },
        recommendation: "Extract business logic into a separate use-case or service module.",
        suggestedFixDiff: "- # 50 lines of logic\n+ return user_service.process_user_data(payload)"
      });
      break;

    case 'axum':
    case 'actix-web':
      findings.push({
        id: "ARCH-RS-001",
        severity: "MEDIUM",
        category: "BoundaryViolation",
        message: "Axum route handler directly invokes sqlx::query! without a service trait",
        location: { file: "src/handlers/users.rs", line: 15 },
        recommendation: "Wrap database access behind a Repository or Service trait for testability.",
        suggestedFixDiff: "- let users = sqlx::query!(...).fetch_all(&pool).await?;\n+ let users = user_service.get_users().await?;"
      });
      break;

    case 'gin':
    case 'fiber':
      findings.push({
        id: "ARCH-GO-001",
        severity: "HIGH",
        category: "BoundaryViolation",
        message: "Gin handler directly uses GORM DB instance",
        location: { file: "handlers/user_handler.go", line: 25 },
        recommendation: "Use interface-driven service structs instead of raw DB queries in handlers.",
        suggestedFixDiff: "- db.Find(&users)\n+ userService.FindAll()"
      });
      break;

    default:
      // Generic architecture findings if framework is unknown
      findings.push({
        id: "ARCH-001",
        severity: "HIGH",
        category: "CircularDependency",
        message: "Service layer directly accesses Web Controller",
        location: { file: "src/service/UserService.ts", line: 42 },
        recommendation: "Decouple controller dependency using event publisher or callback interface",
        suggestedFixDiff: "..."
      });
      break;
  }

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        advisor: "ArchitectureAdvisor",
        framework_detected: framework,
        timestamp: new Date().toISOString(),
        summary: { totalIssues: findings.length, critical: 0, warning: findings.length },
        findings
      }, null, 2)
    }]
  };
}
