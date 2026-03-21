import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const blogDir = join(process.cwd(), "src", "content", "blog");
const hiddenFrontmatterPattern = /^\s*hide:\s*(?:true|"true")\s*$/m;

export const hiddenBlogPaths = new Set(
  readdirSync(blogDir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .filter((file) =>
      hiddenFrontmatterPattern.test(readFileSync(join(blogDir, file), "utf-8"))
    )
    .map((file) => `/blog/${file.replace(/\.mdx?$/, "")}`)
);
