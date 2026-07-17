export type PageExpressionResult =
  | { valid: true; normalized: string; pages: number[] }
  | { valid: false; error: string };

export function parsePageExpression(value: string, maxPage?: number): PageExpressionResult {
  const compact = value.replace(/\s+/g, '');
  if (!compact || !/^[1-9]\d*(?:-[1-9]\d*)?(?:,[1-9]\d*(?:-[1-9]\d*)?)*$/.test(compact)) {
    return { valid: false, error: '请输入类似 1,3-5,8 的页码范围' };
  }

  const pages: number[] = [];
  for (const part of compact.split(',')) {
    const [start, end = start] = part.split('-').map(Number);
    if (start > end) return { valid: false, error: '范围起始页不能大于结束页' };
    if (maxPage && end > maxPage) return { valid: false, error: `页码不能超过 ${maxPage}` };
    for (let page = start; page <= end; page += 1) pages.push(page);
  }

  const uniquePages = Array.from(new Set(pages));
  return { valid: true, normalized: compact, pages: uniquePages };
}
