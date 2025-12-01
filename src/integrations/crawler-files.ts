import type { AstroIntegration } from "astro";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DISALLOWED = [
  "/notes/",
  "/drafts/",
  "/private/",
  "/cart/",
  "/checkout/",
  "/api/",
];

const STATIC_ROUTES = ["/", "/blog", "/photography"];
type UrlEntry = { path: string; lastmod?: string };

function parseFrontmatter(filePath: string) {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^---\n([\s\S]+?)\n---/);
  if (!match) return {};

  return match[1].split("\n").reduce<Record<string, string>>((acc, line) => {
    const [rawKey, ...valueParts] = line.split(":");
    if (!rawKey || valueParts.length === 0) {
      return acc;
    }

    const key = rawKey.trim();
    const value = valueParts.join(":").trim().replace(/^"|"$/g, "");
    acc[key] = value;
    return acc;
  }, {});
}

function buildBlogRoutes(blogDir: string): UrlEntry[] {
  return readdirSync(blogDir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const frontmatter = parseFrontmatter(join(blogDir, file));
      const lastmod = frontmatter.pubDate
        ? new Date(frontmatter.pubDate).toISOString()
        : new Date().toISOString();

      return { path: `/blog/${slug}`, lastmod };
    });
}

function generateSitemap(publicDir: string, blogDir: string, siteUrl: string) {
  const blogRoutes = buildBlogRoutes(blogDir);
  const urls: UrlEntry[] = [
    ...STATIC_ROUTES.map((path) => ({ path })),
    ...blogRoutes,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ path, lastmod }) => {
    return [
      "  <url>",
      `    <loc>${siteUrl}${path}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
      "    <changefreq>weekly</changefreq>",
      "    <priority>0.8</priority>",
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n")}
</urlset>
`;

  writeFileSync(join(publicDir, "sitemap.xml"), xml, "utf-8");
}

function generateRobots(publicDir: string, siteUrl: string) {
  const body = [
    "User-agent: *",
    "Allow: /",
    ...DISALLOWED.map((path) => `Disallow: ${path}`),
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `LLMS: ${siteUrl}/llms.txt`,
    "",
  ].join("\n");

  writeFileSync(join(publicDir, "robots.txt"), body, "utf-8");
}

export default function crawlerFilesIntegration(): AstroIntegration {
  let rootDir = process.cwd();
  let siteUrl = "https://kurtiskemple.com";

  return {
    name: "crawler-files",
    hooks: {
      "astro:config:setup": ({ config }) => {
        rootDir = fileURLToPath(config.root);
        siteUrl = config.site ?? siteUrl;
      },
      "astro:build:start": async () => {
        const publicDir = join(rootDir, "public");
        const blogDir = join(rootDir, "src", "content", "blog");

        generateSitemap(publicDir, blogDir, siteUrl);
        generateRobots(publicDir, siteUrl);
      },
    },
  };
}
