import type { APIRoute } from "astro";
import { readFileSync } from "fs";
import path from "path";

export const GET: APIRoute = () => {
  const resumePath = path.join(process.cwd(), "public", "resume_cameron_decoster.pdf")
  const response = Buffer.from(readFileSync(resumePath, "binary"), "binary")
	
  return new Response(response);
}