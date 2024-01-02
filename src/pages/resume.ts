import type { APIRoute } from "astro";

const path = "https://docs.google.com/document/d/1juuz3vISqaGdMOt0wzDf_jfugJrqt_CqnqIqHvAJBrU/export?format=pdf"

export const GET: APIRoute = ({ redirect }) => redirect(path, 304);