export const getInitialsFromId = (institutionalId: string) => {
  const compact = institutionalId.replace(/[^A-Za-z0-9]/g, '');
  return (compact.slice(0, 2) || institutionalId.slice(0, 2)).toUpperCase();
};

export const getInitialsFromName = (
  firstName?: string | null,
  lastName?: string | null,
  fallbackId?: string,
) => {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }
  return getInitialsFromId(fallbackId ?? '');
};
