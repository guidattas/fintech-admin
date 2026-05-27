import { promises as fs } from "fs";
import { execSync } from "child_process";
import path from "path";
import os from "os";
import { NextResponse } from "next/server";

interface ServerConfig {
  name: string;
  port: number;
  cwd: string;
}

interface ServerStatus {
  name: string;
  status: "running" | "stopped" | "unknown";
  port: number;
  pid?: number;
  error?: string;
}

async function getServerStatus(config: ServerConfig): Promise<ServerStatus> {
  try {
    // Try to get process info using lsof (macOS/Linux)
    try {
      const output = execSync(
        `lsof -i :${config.port} 2>/dev/null | grep LISTEN | awk '{print $2}'`,
        { encoding: "utf-8", timeout: 2000 }
      ).trim();

      if (output) {
        const pid = parseInt(output, 10);
        return {
          name: config.name,
          status: "running",
          port: config.port,
          pid: isNaN(pid) ? undefined : pid,
        };
      }
    } catch (err) {
      // lsof command failed, try netstat as fallback
      try {
        const output = execSync(
          `netstat -tuln 2>/dev/null | grep :${config.port}`,
          { encoding: "utf-8", timeout: 2000 }
        ).trim();

        if (output) {
          return {
            name: config.name,
            status: "running",
            port: config.port,
          };
        }
      } catch {
        // netstat also failed
      }
    }

    return {
      name: config.name,
      status: "stopped",
      port: config.port,
    };
  } catch (error) {
    return {
      name: config.name,
      status: "unknown",
      port: config.port,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  try {
    const projectRoot = process.env.FINTECH_PROJECT_ROOT ||
      path.join(os.homedir(), "fintech-project") ||
      process.cwd();
    const launchJsonPath = path.join(projectRoot, ".claude/launch.json");

    const content = await fs.readFile(launchJsonPath, "utf-8");
    const data = JSON.parse(content);
    const configs: ServerConfig[] = (data.configurations || []).map(
      (c: any) => ({
        name: c.name,
        port: c.port,
        cwd: c.cwd,
      })
    );

    const statuses = await Promise.all(configs.map(getServerStatus));
    return NextResponse.json(statuses);
  } catch (error) {
    console.error("Error getting server status:", error);
    return NextResponse.json(
      {
        error: "Failed to get server status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
