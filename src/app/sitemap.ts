import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/domain/site-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteData();
  const routes = ["", "/services", "/zone-intervention", "/contact"];

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
  }));
}
