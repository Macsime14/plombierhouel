import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/domain/site-data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteData();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
