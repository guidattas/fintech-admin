import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    // Get the project root from home directory or current working directory
    const projectRoot = process.env.FINTECH_PROJECT_ROOT ||
      path.join(os.homedir(), "fintech-project") ||
      process.cwd();
    const launchJsonPath = path.join(projectRoot, ".claude/launch.json");

    const content = await fs.readFile(launchJsonPath, "utf-8");
    const data = JSON.parse(content);
    return NextResponse.json(data.configurations || []);
  } catch (error) {
    console.error("Error reading launch.json:", error);
    return NextResponse.json(
      {
        error: "Failed to read server configurations",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
