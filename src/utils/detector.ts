import * as fs from 'fs';
import * as path from 'path';

export type SupportedFramework = 
  | 'spring-boot'
  | 'quarkus'
  | 'express'
  | 'fastify'
  | 'django'
  | 'fastapi'
  | 'axum'
  | 'actix-web'
  | 'gin'
  | 'fiber'
  | 'unknown';

export function detectFramework(projectRoot: string): SupportedFramework {
  // Check for Node.js (package.json)
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['express']) return 'express';
      if (deps['fastify']) return 'fastify';
    } catch (e) {
      // Ignore
    }
  }

  // Check for Java (pom.xml or build.gradle)
  const pomPath = path.join(projectRoot, 'pom.xml');
  const gradlePath = path.join(projectRoot, 'build.gradle');
  if (fs.existsSync(pomPath)) {
    const pom = fs.readFileSync(pomPath, 'utf8');
    if (pom.includes('spring-boot')) return 'spring-boot';
    if (pom.includes('quarkus')) return 'quarkus';
  } else if (fs.existsSync(gradlePath)) {
    const gradle = fs.readFileSync(gradlePath, 'utf8');
    if (gradle.includes('spring-boot')) return 'spring-boot';
    if (gradle.includes('quarkus')) return 'quarkus';
  }

  // Check for Python (requirements.txt or pyproject.toml)
  const reqPath = path.join(projectRoot, 'requirements.txt');
  const tomlPath = path.join(projectRoot, 'pyproject.toml');
  if (fs.existsSync(reqPath)) {
    const reqs = fs.readFileSync(reqPath, 'utf8');
    if (reqs.includes('Django') || reqs.includes('django')) return 'django';
    if (reqs.includes('fastapi')) return 'fastapi';
  } else if (fs.existsSync(tomlPath)) {
    const toml = fs.readFileSync(tomlPath, 'utf8');
    if (toml.includes('django')) return 'django';
    if (toml.includes('fastapi')) return 'fastapi';
  }

  // Check for Rust (Cargo.toml)
  const cargoPath = path.join(projectRoot, 'Cargo.toml');
  if (fs.existsSync(cargoPath)) {
    const cargo = fs.readFileSync(cargoPath, 'utf8');
    if (cargo.includes('axum')) return 'axum';
    if (cargo.includes('actix-web')) return 'actix-web';
  }

  // Check for Go (go.mod)
  const goModPath = path.join(projectRoot, 'go.mod');
  if (fs.existsSync(goModPath)) {
    const goMod = fs.readFileSync(goModPath, 'utf8');
    if (goMod.includes('github.com/gin-gonic/gin')) return 'gin';
    if (goMod.includes('github.com/gofiber/fiber')) return 'fiber';
  }

  return 'unknown';
}
