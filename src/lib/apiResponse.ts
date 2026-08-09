export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function requireRecord(value: unknown, contract: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`Invalid ${contract} response.`);
  return value;
}

export function requireArray(value: unknown, contract: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Invalid ${contract} response.`);
  return value;
}

export function requireString(value: unknown, contract: string): string {
  if (typeof value !== 'string') throw new Error(`Invalid ${contract} response.`);
  return value;
}

export function requireNumber(value: unknown, contract: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid ${contract} response.`);
  }
  return value;
}

export function requireBoolean(value: unknown, contract: string): boolean {
  if (typeof value !== 'boolean') throw new Error(`Invalid ${contract} response.`);
  return value;
}
