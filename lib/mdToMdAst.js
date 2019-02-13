const parse = require('remark-parse')
const unified = require('unified')
const replaceJsdocLinks = require('./replaceJsdocLinks')

/**
 * Converts markdown text to AST.
 * @kind function
 * @name mdToMdAst
 * @param {string} md Markdown.
 * @param {Object[]} [members] Outline members.
 * @param {boolean} [removeNewline] Whether or not to remove newline characters
 * @returns {Object} Markdown AST.
 * @ignore
 */
const mdToMdAst = (md, members, removeNewline) =>
  unified()
    .use(parse)
    .parse(replaceJsdocLinks(md, members, removeNewline)).children

module.exports = mdToMdAst
