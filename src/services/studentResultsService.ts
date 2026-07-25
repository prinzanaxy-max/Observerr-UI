import apiClient from '../lib/axios';
import { mapSortKeyToApi } from '../lib/studentResultsUtils';
import type {
  ResultSortKey,
  StudentResultsPageResponse,
  StudentResultsSummary,
} from '../types/studentResults';
import { RESULTS_PAGE_SIZE } from '../types/studentResults';

export type FetchResultsParams = {
  page: number;
  size?: number;
  sort: ResultSortKey;
};

export async function fetchResultsSummary(): Promise<StudentResultsSummary> {
  const { data } = await apiClient.get<StudentResultsSummary>('/api/student/results/summary');
  return data;
}

export async function fetchResultsList({
  page,
  size = RESULTS_PAGE_SIZE,
  sort,
}: FetchResultsParams): Promise<StudentResultsPageResponse> {
  const { data } = await apiClient.get<StudentResultsPageResponse>('/api/student/results', {
    params: { page, size, sort: mapSortKeyToApi(sort) },
  });
  return data;
}
