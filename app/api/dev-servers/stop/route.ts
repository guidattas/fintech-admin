import { execSync } from "child_process";
import path from "path";
import os from "os";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const serverName = body.name;

    if (!serverName) {
      return NextResponse.json(
        { error: "Server name is required" },
        { status: 400 }
      );
    }

    const projectRoot = process.env.FINTECH_PROJECT_ROOT ||
      path.join(os.homedir(), "fintech-project") ||
      process.cwd();
    const launchJsonPath = path.join(projectRoot, ".claude/launch.json");

    const content = await fs.readFile(launchJsonPath, "utf-8");
    const data = JSON.parse(content);
    const config = (data.configurations || []).find(
      (c: any) => c.name === serverName
    );

    if (!config) {
      return NextResponse.json(
        { error: "Server configuration not found" },
        { status: 404 }
      );
    }

    const port = config.port;

    // Kill the process using the port
    try {
      execSync(`lsof -ti :${port} | xargs kill -9`, {
        timeout: 5000,
        stdio: "ignore",
      });
    } catch {
      // Try alternative method for different OS
      try {
        execSync(`fuser -k ${port}/tcp`, {
          timeout: 5000,
          stdio: "ignore",
        });
      } catch {
        // Port might already be free
      }
    }

    return NextResponse.json({ success: true, message: `Server ${serverName} stopped` });
  } catch (error) {
    console.error("Error stopping server:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to stop server" },
      { status: 500 }
    );
  }
}
