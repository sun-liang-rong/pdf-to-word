export function isValidPageExpression(value: unknown): value is string {
  if (typeof value !== 'string' || !/^[1-9]\d*(?:-[1-9]\d*)?(?:,[1-9]\d*(?:-[1-9]\d*)?)*$/.test(value)) {
    return false;
  }

  return value.split(',').every((part) => {
    if (!part.includes('-')) return true;
    const [start, end] = part.split('-').map(Number);
    return start <= end;
  });
}
