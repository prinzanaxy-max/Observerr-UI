export const getInitialsFromId = (institutionalId: string) => {
  const compact = institutionalId.replace(/[^A-Za-z0-9]/g, '');
  return (compact.slice(0, 2) || institutionalId.slice(0, 2)).toUpperCase();
};
