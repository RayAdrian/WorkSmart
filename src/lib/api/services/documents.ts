import { apiGet, apiPost } from "../client";
import { Document } from "../types";

export const documentsApi = {
  getAll: (params?: { status?: string; userId?: string }) =>
    apiGet<Document[]>("/documents", params),

  create: (data: { name: string; size: string }) =>
    apiPost<Document>("/documents", data),
};
