import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { getPublishedProjects } from "@/lib/data";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const h=await headers();const host=h.get("host")||"localhost:3000";const protocol=h.get("x-forwarded-proto")||"https";const base=`${protocol}://${host}`;const projects=await getPublishedProjects();return["","/about","/projects","/contact"].map(path=>({url:`${base}${path}`,changeFrequency:"monthly" as const,priority:path===""?1:.8})).concat(projects.map(project=>({url:`${base}/projects/${project.slug}`,lastModified:project.updatedAt?new Date(project.updatedAt):new Date(),changeFrequency:"monthly" as const,priority:.7})));}
