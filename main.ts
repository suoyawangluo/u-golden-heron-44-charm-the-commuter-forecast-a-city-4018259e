// Charm the Commuter: Forecast a City That Isn't
// One line of weather, at most 140 characters, for a city that does not exist.
// The forecast names the invented city, gives its weather, and lands one small
// joke a bored commuter at a rainy bus stop will smile at.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 140 characters,
// not only white space. A single line, like a real broadcast forecast.
function checkGate(text: string): void {
  const cps = [...text].length;
  if (cps < 1 || cps > 140) {
    throw new Error(`gate: entry is ${cps} code points, must be 1-140`);
  }
  if (!text.trim()) {
    throw new Error("gate: entry is only white space");
  }
  if (text.includes("\n")) {
    throw new Error("gate: entry must be a single line");
  }
}

const ENTRY =
  "Mizzleford: light drizzle all morning, a high of 11°, and the 7:42 bus running 20 minutes late, as is tradition.";

checkGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY + "\n", "utf8");

// Read-back verification: the file on disk must be exactly the entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY + "\n") {
  throw new Error("read-back: file differs from the entry");
}
const sha = createHash("sha256").update(written, "utf8").digest("hex");
console.log(
  `wrote ${outPath} (${[...ENTRY].length} code points, sha256 ${sha}), verified: ${JSON.stringify(ENTRY)}`,
);
