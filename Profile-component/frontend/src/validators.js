// Shared form validation for the Profile component.
//
// Single source of truth for the "empty field" rule used by Login and Register.
// Keeping it here means both forms behave identically and the message only
// has to be changed in one place.
//
// The rule: a field is empty when it is missing, null, or only whitespace
// (so "   " is rejected exactly like "").

export const EMPTY_FIELDS_MESSAGE = "Fields can't be empty";

/**
 * True when a value is missing or contains only whitespace.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isBlank(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

/**
 * Returns the name of the first empty field, or null when all are filled.
 * @param {Record<string, unknown>} values
 * @param {string[]} fields
 * @returns {string | null}
 */
export function findEmptyField(values, fields) {
  return fields.find((field) => isBlank(values[field])) ?? null;
}

/**
 * True when at least one of the given fields is empty.
 * @param {Record<string, unknown>} values
 * @param {string[]} fields
 * @returns {boolean}
 */
export function hasEmptyFields(values, fields) {
  return findEmptyField(values, fields) !== null;
}

/**
 * Form-level validator: returns the message to show, or "" when the form is valid.
 * @param {Record<string, unknown>} values
 * @param {string[]} fields
 * @returns {string}
 */
export function validateRequired(values, fields) {
  return hasEmptyFields(values, fields) ? EMPTY_FIELDS_MESSAGE : "";
}
