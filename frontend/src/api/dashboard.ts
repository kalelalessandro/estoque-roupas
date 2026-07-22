import { DashboardSummary } from '../types';
import { api } from './client';

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
};
