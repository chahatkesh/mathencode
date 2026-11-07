import assert from "node:assert/strict";
import test from "node:test";
import { activeAdminLink, ADMIN_LINKS } from "./admin-navigation";

test("admin navigation chooses the most specific destination", () => {
  assert.equal(activeAdminLink("/admin")?.label, "Overview");
  assert.equal(activeAdminLink("/admin/tests")?.label, "Diagnostic tests");
  assert.equal(
    activeAdminLink("/admin/tests/common")?.label,
    "Diagnostic tests",
  );
  assert.equal(
    activeAdminLink("/admin/tests/submissions")?.label,
    "Test results",
  );
  assert.equal(
    activeAdminLink("/admin/tests/submissions/123")?.label,
    "Test results",
  );
  assert.equal(activeAdminLink("/admin/courses/new")?.label, "Courses");
  assert.equal(activeAdminLink("/admin/courses-unrelated"), undefined);
  assert.equal(activeAdminLink("/"), undefined);
});

test("admin navigation contains six unique accessible destinations", () => {
  assert.equal(new Set(ADMIN_LINKS.map((link) => link.href)).size, 6);
  assert.ok(
    ADMIN_LINKS.every((link) => link.label && link.href.startsWith("/admin")),
  );
});
