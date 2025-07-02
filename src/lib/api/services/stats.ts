import { apiGet } from "../client";
import { StatsResponse } from "../types";

export const statsApi = {
  getAll: () => apiGet<StatsResponse>("/stats"),
};
