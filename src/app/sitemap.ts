import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/festive"].map((path) => ({ url: `https://www.screenery.design${path}` }));
}
