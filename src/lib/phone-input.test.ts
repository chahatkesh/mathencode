import assert from "node:assert/strict";
import test from "node:test";
import { isValidPhoneInput, normalizePhoneInput } from "./phone-input";

test("phone input removes letters while preserving readable formatting", () => {
  assert.equal(normalizePhoneInput("7wefef"), "7");
  assert.equal(normalizePhoneInput(" +1 (202) 555-0123"), "+1 (202) 555-0123");
  assert.equal(normalizePhoneInput("202++  555\n0123"), "202 555 0123");
});

test("phone validation checks digits, punctuation and international length", () => {
  assert.equal(isValidPhoneInput("(202) 555-0123", "+1"), true);
  assert.equal(isValidPhoneInput("+44 7700 900123"), true);
  assert.equal(isValidPhoneInput("1234567"), true);
  for (const value of ["", "123", "202letters5550123", "1234567890123456"]) {
    assert.equal(isValidPhoneInput(value), false, value);
  }
  assert.equal(isValidPhoneInput("123456789012345", "+44"), false);
  assert.equal(isValidPhoneInput("+1 202 555 0123", "+1"), false);
});
