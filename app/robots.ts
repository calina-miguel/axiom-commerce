import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: "/workspace" }], sitemap: "https://eshme-commerce.calina-miguel.chatgpt.site/sitemap.xml" };
}
