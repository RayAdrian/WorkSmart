import { apiGet, apiPost } from "../client";
import { TimeEntry, TimeEntryCreate } from "../types";

export const timeEntriesApi = {
  getAll: (params?: { tag?: string; date?: string; userId?: string }) =>
    apiGet<TimeEntry[]>("/time-entries", params),

  create: (data: TimeEntryCreate) => apiPost<TimeEntry>("/time-entries", data),

  update: (id: number, data: Partial<TimeEntryCreate>) =>
    apiPost<TimeEntry>(`/time-entries/${id}`, { ...data, _method: "PUT" }),

  delete: (id: number) =>
    apiPost<void>(`/time-entries/${id}`, { _method: "DELETE" }),
};
