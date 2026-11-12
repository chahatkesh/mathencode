export const INBOX_PAGE_SIZE = 20;

export type InboxPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export function parseInboxPage(value: string | string[] | undefined | null) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || !/^\d+$/.test(raw)) return 1;
  const page = Number(raw);
  if (!Number.isSafeInteger(page) || page < 1) return 1;
  return Math.min(page, 10000);
}

export function inboxWindow(total: number, requestedPage: number) {
  const pageCount = Math.max(1, Math.ceil(total / INBOX_PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);
  return {
    page,
    pageSize: INBOX_PAGE_SIZE,
    total,
    pageCount,
    skip: (page - 1) * INBOX_PAGE_SIZE,
  };
}
