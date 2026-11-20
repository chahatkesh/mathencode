import assert from "node:assert/strict";
import test from "node:test";
import {
  LAUNCH_DISMISS_SCRIPT,
  LAUNCH_DISMISS_STORAGE,
  launchStorageKey,
  nextCourseLaunch,
  type LaunchCandidate,
} from "./course-launch";

const today = "2026-11-20";

function course(
  overrides: Partial<LaunchCandidate> &
    Pick<LaunchCandidate, "publicId" | "title" | "startDate">,
): LaunchCandidate {
  return {
    slug: overrides.slug ?? "ap-calculus-bc",
    publicId: overrides.publicId,
    title: overrides.title,
    startDate: overrides.startDate,
  };
}

test("every upcoming course is listed from soonest to latest", () => {
  const launch = nextCourseLaunch(
    [
      course({
        publicId: 1,
        slug: "algebra",
        title: "Algebra",
        startDate: null,
      }),
      course({
        publicId: 2,
        slug: "ap-calculus-ab",
        title: "AP Calculus AB",
        startDate: "2026-11-19",
      }),
      course({
        publicId: 9,
        slug: "ap-calculus-bc",
        title: "AP Calculus BC",
        startDate: "2026-12-01",
      }),
      course({
        publicId: 3,
        slug: "ap-precalculus",
        title: "AP Precalculus",
        startDate: "2027-01-05",
      }),
      course({
        publicId: 4,
        title: "  ",
        startDate: "2026-11-20",
      }),
      course({
        publicId: 5,
        slug: "broken",
        title: "Broken",
        startDate: "2026-02-31",
      }),
    ],
    today,
  );

  assert.ok(launch);
  assert.deepEqual(
    launch.items.map((item) => item.sentence),
    [
      "AP Calculus BC starts December 1",
      "AP Precalculus starts January 5, 2027",
    ],
  );
  assert.deepEqual(
    launch.items.map((item) => item.when),
    ["Dec 1", "Jan 5, 2027"],
  );
  assert.equal(
    launch.key,
    "ap-calculus-bc:2026-12-01|ap-precalculus:2027-01-05",
  );
  assert.equal(launch.items[0]?.href, "/course/ap-calculus-bc");
});

test("a course that starts today stays first", () => {
  const launch = nextCourseLaunch(
    [
      course({
        publicId: 2,
        slug: "algebra",
        title: "Algebra",
        startDate: "2026-11-20",
      }),
      course({
        publicId: 1,
        slug: "ap-calculus-bc",
        title: "AP Calculus BC",
        startDate: "2026-12-01",
      }),
    ],
    today,
  );

  assert.equal(launch?.items[0]?.sentence, "Algebra starts November 20");
  assert.equal(launch?.items[0]?.when, "Nov 20");
  assert.equal(launch?.items[1]?.title, "AP Calculus BC");
});

test("the same start date uses the lower public id", () => {
  const launch = nextCourseLaunch(
    [
      course({
        publicId: 8,
        slug: "ap-calculus-bc",
        title: "AP Calculus BC",
        startDate: "2026-12-01",
      }),
      course({
        publicId: 2,
        slug: "ap-precalculus",
        title: "AP Precalculus",
        startDate: "2026-12-01",
      }),
    ],
    today,
  );

  assert.deepEqual(
    launch?.items.map((item) => item.href),
    ["/course/ap-precalculus", "/course/ap-calculus-bc"],
  );
});

test("a start date in another year keeps the year", () => {
  const launch = nextCourseLaunch(
    [
      course({
        publicId: 3,
        slug: "ap-calculus-bc",
        title: "AP Calculus BC",
        startDate: "2027-03-02",
      }),
    ],
    today,
  );

  assert.equal(
    launch?.items[0]?.sentence,
    "AP Calculus BC starts March 2, 2027",
  );
  assert.equal(launch?.items[0]?.when, "Mar 2, 2027");
  assert.equal(
    launch?.key,
    launchStorageKey({
      slug: "ap-calculus-bc",
      publicId: 3,
      startDate: "2027-03-02",
    }),
  );
});

test("a missing slug uses the public id in the key and link", () => {
  const launch = nextCourseLaunch(
    [
      course({
        publicId: 6,
        slug: " ",
        title: "Algebra",
        startDate: "2026-12-01",
      }),
    ],
    today,
  );

  assert.equal(launch?.items[0]?.href, "/course/6");
  assert.equal(launch?.key, "6:2026-12-01");
});

test("no upcoming course leaves the strip empty", () => {
  assert.equal(nextCourseLaunch([], today), null);
  assert.equal(
    nextCourseLaunch(
      [
        course({
          publicId: 1,
          title: "Algebra",
          startDate: "2026-01-01",
        }),
      ],
      today,
    ),
    null,
  );
  assert.equal(
    nextCourseLaunch(
      [course({ publicId: 1, title: "Algebra", startDate: "2026-12-01" })],
      "2026-02-31",
    ),
    null,
  );
});

test("the dismiss script compares the stored launch key", () => {
  assert.match(LAUNCH_DISMISS_SCRIPT, new RegExp(LAUNCH_DISMISS_STORAGE));
  assert.match(LAUNCH_DISMISS_SCRIPT, /data-launch-dismissed/);
  assert.doesNotMatch(LAUNCH_DISMISS_SCRIPT, /starts/);
});
