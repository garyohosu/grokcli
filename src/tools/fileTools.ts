import fs from "fs/promises";
import path from "path";

/**
 * Validates and resolves a file path to ensure it's safe and within project boundaries
 * @param p - The file path to validate
 * @returns The resolved absolute path
 * @throws Error if path is invalid or unsafe
 */
function safePath(p: string): string {
  const baseDir = process.cwd();
  const resolved = path.resolve(baseDir, p);

  // Prevent path traversal attacks
  if (p.includes("..")) {
    throw new Error("Path traversal not allowed");
  }

  // Ensure path is within project directory
  if (!resolved.startsWith(baseDir)) {
    throw new Error("Access denied: invalid path");
  }

  return resolved;
}

/**
 * Reads a text file from the filesystem
 * @param params - Object containing filePath
 * @returns Object with filePath and content
 */
export async function readFile({ filePath }: { filePath: string }) {
  try {
    const target = safePath(filePath);
    const content = await fs.readFile(target, "utf-8");
    return { filePath, content, status: "success" };
  } catch (error: any) {
    return {
      filePath,
      status: "error",
      error: error.message || "Failed to read file"
    };
  }
}

/**
 * Writes content to a text file (creates or overwrites)
 * @param params - Object containing filePath and content
 * @returns Object with filePath and status
 */
export async function writeFile({
  filePath,
  content
}: {
  filePath: string;
  content: string;
}) {
  try {
    const target = safePath(filePath);

    // Ensure parent directory exists
    const dir = path.dirname(target);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(target, content, "utf-8");
    return { filePath, status: "written", bytesWritten: content.length };
  } catch (error: any) {
    return {
      filePath,
      status: "error",
      error: error.message || "Failed to write file"
    };
  }
}

/**
 * Appends content to a text file
 * @param params - Object containing filePath and content
 * @returns Object with filePath and status
 */
export async function appendFile({
  filePath,
  content
}: {
  filePath: string;
  content: string;
}) {
  try {
    const target = safePath(filePath);

    // Ensure parent directory exists
    const dir = path.dirname(target);
    await fs.mkdir(dir, { recursive: true });

    await fs.appendFile(target, content, "utf-8");
    return { filePath, status: "appended", bytesAppended: content.length };
  } catch (error: any) {
    return {
      filePath,
      status: "error",
      error: error.message || "Failed to append to file"
    };
  }
}
