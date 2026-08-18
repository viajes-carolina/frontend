import fs from "node:fs";
import path from "node:path";

const dirsToClean = [
  "apps/web/.next",
  "apps/admin/.next",
  ".turbo",
  "apps/web/.turbo",
  "apps/admin/.turbo",
];

for (const rel of dirsToClean) {
  const full = path.resolve(process.cwd(), rel);
  if (fs.existsSync(full)) {
    console.log(`Cleaning ${rel}...`);
    fs.rmSync(full, { recursive: true, force: true });
  }
}
console.log("Cleanup complete!");
