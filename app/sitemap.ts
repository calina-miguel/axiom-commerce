import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://eshme-commerce.calina-miguel.chatgpt.site/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
