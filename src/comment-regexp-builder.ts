/*
 Simple regExp-wrapper utility, suitable for all kinds of comments

 - opening, closing and section marks
 - leading and trailing space tolerant
 - can extract description from the line
 */

// from: https://stackoverflow.com/questions/4371565/create-regexps-on-the-fly-using-string-variables
const escapeRegExp = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

const tagData = (regex: RegExp, str: string | null): string | null => {
  const matches = str === null ? null : regex.exec(str);
  return matches === null ? null : matches[1];
};

export type TTagWrapper = {
  regexp: () => RegExp;
  test: (s: string) => boolean;
  innerText: (line: string | null) => string | null;
};

const tagWrapperObj = (tagStr: string, tagStrRegexp: RegExp): TTagWrapper => {
  const regx = tagStr === '' ? new RegExp('^\\s*$') : tagStrRegexp;
  return {
    /**
     *
     *
     * @returns Wrapper's internal RegExp object
     */
    regexp: () => regx,
    /**
     * Shorthand to internal RegExp.test method
     *
     * @param {string} str
     * @returns true if tag is present at the string. False otherwise.
     */
    test: str => regx.test(str),
    /**
     *
     *
     * @param {string} line
     * @returns If tag is found at the line, returns the text that belongs to it. Otherwise returns null.
     */
    innerText: line => tagData(regx, line),
  };
};

/**
 * Creates a start tag from string
 *
 * @param {string} tagStr tag string
 * @returns start tag wrapper object
 */
export const createStartTag = (tagStr: string) =>
  //tagWrapperObj(tagStr, new RegExp("^\\s*" + escapeRegExp(tagStr) + "(.*)$"));
  createSectionTag(tagStr, '');

/**
 * Creates an end tag from string
 *
 * @param {string} tagStr
 * @returns end tag wrapper object
 */
export const createEndTag = (tagStr: string) =>
  tagWrapperObj(tagStr, new RegExp('^(.*)' + escapeRegExp(tagStr) + '\\s*$'));

/**
 * Creates a section tag from string
 *
 * @param {string} leftPartStr left part of a section
 * @param {string} rightPartStr right part of a section
 * @returns section tag wrapper object
 */
export const createSectionTag = (leftPartStr: string, rightPartStr: string) =>
  tagWrapperObj(
    leftPartStr + rightPartStr,
    new RegExp(
      '^\\s*' +
        escapeRegExp(leftPartStr) +
        '(.*)' +
        escapeRegExp(rightPartStr) +
        '\\s*$'
    )
  );

export const matchAllTag = tagWrapperObj('something', /^(.*)$/);
