import { promises as fs } from "fs";
import { spawn } from "child_process";
import path from "path";
import os from "os";
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

    const serverCwd = path.join(projectRoot, config.cwd);

    // Spawn the process in the background (detached)
    spawn(config.runtimeExecutable, config.runtimeArgs, {
      cwd: serverCwd,
      detached: true,
      stdio: "ignore",
      env: {
        ...process.env,
        ...config.env,
      },
    }).unref();

    // Wait a bit for the process to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true, message: `Server ${serverName} started` });
  } catch (error) {
    console.error("Error starting server:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start server" },
      { status: 500 }
    );
  }
}
