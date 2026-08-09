import type { IntegrityAuditRecord } from '../../types/integritySession';

export type ApiIntegritySeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ApiIntegrityAuditRecord = Omit<IntegrityAuditRecord, 'severity'> & {
  severity: ApiIntegritySeverity;
};

export function toApiSeverity(severity: IntegrityAuditRecord['severity']): ApiIntegritySeverity {
  switch (severity) {
    case 'info':
      return 'INFO';
    case 'low':
      return 'LOW';
    case 'medium':
      return 'MEDIUM';
    case 'high':
      return 'HIGH';
    case 'critical':
      return 'CRITICAL';
    default:
      return 'INFO';
  }
}

export function toApiAuditRecord(record: IntegrityAuditRecord): ApiIntegrityAuditRecord {
  return {
    ...record,
    severity: toApiSeverity(record.severity),
    metadata: {
      ...record.metadata,
      sessionId: record.metadata?.sessionId ?? undefined,
    },
  };
}

export function toApiAuditRecords(records: IntegrityAuditRecord[]): ApiIntegrityAuditRecord[] {
  return records.map(toApiAuditRecord);
}
