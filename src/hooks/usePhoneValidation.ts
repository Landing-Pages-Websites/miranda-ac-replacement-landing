"use client";

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const N11_CODES = ["211", "311", "411", "511", "611", "711", "811", "911"];
const TOLL_FREE = ["800", "888", "877", "866", "855", "844", "833", "822", "900"];
const FAKE_PATTERNS = ["1234567890", "9876543210", "0000000000"];

export function validatePhone(value: string): { valid: boolean; error: string } {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 10) {
    return { valid: false, error: "Please enter a 10-digit phone number." };
  }

  const areaCode = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);

  if (areaCode[0] === "0" || areaCode[0] === "1") {
    return { valid: false, error: "Area code cannot start with 0 or 1." };
  }
  if (exchange[0] === "0" || exchange[0] === "1") {
    return { valid: false, error: "Invalid phone number format." };
  }
  if (N11_CODES.includes(areaCode)) {
    return { valid: false, error: "Please enter a valid phone number, not a service code." };
  }
  if (exchange === "555") {
    return { valid: false, error: "Please enter a real phone number." };
  }
  if (TOLL_FREE.includes(areaCode)) {
    return { valid: false, error: "Please enter a local phone number, not a toll-free number." };
  }
  if (new Set(digits.split("")).size === 1) {
    return { valid: false, error: "Please enter a valid phone number." };
  }
  if (FAKE_PATTERNS.includes(digits)) {
    return { valid: false, error: "Please enter a real phone number." };
  }

  return { valid: true, error: "" };
}

export function isValidPhone(value: string): boolean {
  return validatePhone(value).valid;
}
