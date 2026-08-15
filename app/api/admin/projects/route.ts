import { desc } from "drizzle-orm";
import { getReadyDb } from "@/db";
import { projects } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { projectSchema } from "@/lib/validation";
export async function GET(){if(!await isAdminRequest())return Response.json({error:"Não autorizado"},{status:401});return Response.json({projects:await (await getReadyDb()).select().from(projects).orderBy(desc(projects.updatedAt))});}
export async function POST(request:Request){if(!await isAdminRequest())return Response.json({error:"Não autorizado"},{status:401});try{const parsed=projectSchema.safeParse(await request.json());if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||"Dados inválidos"},{status:400});const data=parsed.data;const [project]=await (await getReadyDb()).insert(projects).values({...data,coverImage:data.coverImage||null,gallery:JSON.stringify(data.gallery),technologies:JSON.stringify(data.technologies),projectUrl:data.projectUrl||null,githubUrl:data.githubUrl||null}).returning();return Response.json({project},{status:201});}catch(error){const message=error instanceof Error&&error.message.includes("UNIQUE")?"Este slug já está em uso.":"Não foi possível criar o projeto.";return Response.json({error:message},{status:500});}}
