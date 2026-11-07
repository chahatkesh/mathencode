import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ContactActions,
  exportInbox,
  inboxDate,
  matchesInboxReadStatus,
  matchesInboxSearch,
  sortInbox,
} from "./inbox-controls";

test("sorting supports each order without mutating records, including empty and tied input", () => {
  const records = [
    { _id: "1", name: "Zoe", createdAt: "2026-01-01", isRead: false },
    { _id: "2", name: "Amy", createdAt: "2026-02-01", isRead: true },
    { _id: "3", name: "Amy", createdAt: "2026-02-01", isRead: false },
  ];
  const snapshot = structuredClone(records);
  for (const [order, expected] of [
    ["newest", ["2", "3", "1"]],
    ["oldest", ["1", "2", "3"]],
    ["name", ["2", "3", "1"]],
  ] as const) {
    assert.deepEqual(
      sortInbox(records, order).map((item) => item._id),
      expected,
    );
  }
  assert.deepEqual(records, snapshot);
  assert.deepEqual(sortInbox([], "newest"), []);
  assert.notEqual(sortInbox(records, "name"), records);
});

test("dates use local Intl formatting and reject invalid or missing dates", () => {
  const value = "2026-11-06T18:15:00Z";
  for (const withTime of [false, true]) {
    assert.equal(
      inboxDate(value, withTime),
      new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        ...(withTime ? { timeStyle: "short" as const } : {}),
      }).format(new Date(value)),
    );
    assert.equal(inboxDate("invalid", withTime), "Date unavailable");
    assert.equal(inboxDate("", withTime), "Date unavailable");
  }
});

test("search trims queries, ignores case, matches literal text and tolerates absent fields", () => {
  const fields = [
    "Zoë Doe",
    "parent@example.com",
    "+91 1234567890",
    "[math]",
    undefined,
  ];
  for (const query of [" zoË ", "EXAMPLE.COM", "+91", "[math]", "", " \n "]) {
    assert.equal(matchesInboxSearch(fields, query), true, query);
  }
  assert.equal(matchesInboxSearch(fields, ".*"), false);
  assert.equal(matchesInboxSearch([undefined, ""], "math"), false);
  assert.equal(matchesInboxSearch([], ""), true);
  assert.equal(matchesInboxSearch([], "math"), false);
});

test("read filters distinguish unread from read and safely default unknown filters", () => {
  for (const isRead of [false, true]) {
    assert.equal(matchesInboxReadStatus(isRead, "read"), isRead);
    assert.equal(matchesInboxReadStatus(isRead, "unread"), !isRead);
    assert.equal(matchesInboxReadStatus(isRead, "all"), true);
    assert.equal(matchesInboxReadStatus(isRead, "invalid"), true);
  }
  const records = [
    { name: "Ada", isRead: true },
    { name: "Ada", isRead: false },
  ];
  assert.deepEqual(
    records.filter(
      (item) =>
        matchesInboxReadStatus(item.isRead, "unread") &&
        matchesInboxSearch([item.name], " ADA "),
    ),
    [records[1]],
  );
});

function contactMarkup(phone: string, countryCode?: string) {
  return renderToStaticMarkup(
    createElement(ContactActions, {
      email: "parent@example.com",
      phone,
      countryCode,
    }),
  );
}

test("contact links normalize explicit international numbers without duplicating country codes", () => {
  for (const [phone, code, expected] of [
    ["+91 (987) 654-3210", "+91", "+919876543210"],
    ["0044 7700 900123", undefined, "+447700900123"],
    ["07700 900123", "+44", "+447700900123"],
  ]) {
    const html = contactMarkup(phone!, code);
    assert.ok(html.includes(`href="tel:${expected}"`));
    assert.ok(html.includes(`href="https://wa.me/${expected!.slice(1)}"`));
    assert.ok(html.includes('rel="noopener noreferrer"'));
    assert.ok(html.includes('href="mailto:parent@example.com"'));
    assert.ok(html.includes('aria-label="Copy email"'));
    assert.ok(html.includes('aria-label="Copy phone number"'));
  }
});

test("contact links do not guess a country for local numbers or create links for invalid phones", () => {
  const local = contactMarkup("9876543210");
  assert.ok(local.includes('href="tel:9876543210"'));
  assert.ok(!local.includes("https://wa.me/"));
  for (const phone of ["", "123", "call me", "+1234567890123456", "123#4567"]) {
    const html = contactMarkup(phone);
    assert.ok(!html.includes('href="tel:'), phone);
    assert.ok(!html.includes("https://wa.me/"), phone);
  }
});

test("CSV exports quote cells, neutralize formula prefixes, include a BOM and release the download URL", async (t) => {
  const blobs: Blob[] = [];
  const callbacks: (() => void)[] = [];
  const revoked: string[] = [];
  let clicks = 0;
  let removals = 0;
  let appended = 0;
  const link = {
    href: "",
    download: "",
    click() {
      clicks++;
    },
    remove() {
      removals++;
    },
  };
  for (const [key, value] of Object.entries({
    document: {
      createElement: (tag: string) => {
        assert.equal(tag, "a");
        return link;
      },
      body: {
        appendChild: () => {
          appended++;
        },
      },
    },
    window: {
      setTimeout: (callback: () => void, delay: number) => {
        assert.equal(delay, 1000);
        callbacks.push(callback);
      },
    },
  })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  t.mock.method(URL, "createObjectURL", (blob: Blob) => {
    blobs.push(blob);
    return `blob:test-${blobs.length}`;
  });
  t.mock.method(URL, "revokeObjectURL", (url: string) => {
    revoked.push(url);
  });
  const formulas = [
    "=1+1",
    "+1",
    "-1",
    "@SUM(A1)",
    "  =1",
    "\tplain",
    "\rplain",
    "\n=1",
  ];
  exportInbox(
    "requests.csv",
    ["Name", "Message"],
    [
      ["Zoë", 'Comma, "quote"\nand newline'],
      ["", "ordinary text"],
      ...formulas.map((value) => [value, "safe"]),
    ],
  );
  const blob = blobs[0]!;
  assert.equal(blob.type, "text/csv;charset=utf-8;");
  assert.deepEqual(
    [...new Uint8Array(await blob.arrayBuffer()).slice(0, 3)],
    [239, 187, 191],
  );
  const csv = await blob.text();
  assert.ok(
    csv.startsWith('"Name","Message"\r\n"Zoë","Comma, ""quote""\nand newline"'),
  );
  assert.ok(csv.includes('\r\n"","ordinary text"'));
  for (const formula of formulas)
    assert.ok(csv.includes(`"'${formula}","safe"`), formula);
  assert.equal(link.download, "requests.csv");
  assert.equal(link.href, "blob:test-1");
  assert.equal(clicks, 1);
  assert.equal(appended, 1);
  assert.equal(removals, 1);
  assert.deepEqual(revoked, []);
  callbacks[0]!();
  assert.deepEqual(revoked, ["blob:test-1"]);

  exportInbox("empty.csv", ["Name"], []);
  assert.equal(await blobs[1]!.text(), '"Name"');
  callbacks[1]!();
  assert.deepEqual(revoked, ["blob:test-1", "blob:test-2"]);
});
