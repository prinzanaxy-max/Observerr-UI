import { fetchStudentStats } from '../services/studentStatsService';
import type { StudentStats } from '../types/studentStats';

const CACHE_MS = 5 * 60 * 1000;

const cache = new Map<string, { data: StudentStats; fetchedAt: number }>();
let inflight: { userId: string; promise: Promise<StudentStats> } | null = null;

export function invalidateStudentStatsCache(userId?: string) {
  if (userId) {
    cache.delete(userId);
    return;
  }
  cache.clear();
}

export async function fetchStudentStatsCached(userId: string): Promise<StudentStats> {
  const hit = cache.get(userId);
  if (hit && Date.now() - hit.fetchedAt < CACHE_MS) {
    return hit.data;
  }

  if (inflight?.userId === userId) {
    return inflight.promise;
  }

  const promise = fetchStudentStats()
    .then((data) => {
      cache.set(userId, { data, fetchedAt: Date.now() });
      inflight = null;
      return data;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });

  inflight = { userId, promise };
  return promise;
}
