const { readFileSync, writeFileSync } = require('fs')
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const unified = require('unified')
const remarkPluginReplaceSection = require('./remarkPluginReplaceSection')
const remarkStringifyOptions = require('./remarkStringifyOptions')

/**
 * Replaces the content of a section in a markdown file.
 * @kind function
 * @name mdFileReplaceSection
 * @param {Object} options Options.
 * @param {string} options.markdownPath Markdown file path.
 * @param {string} options.targetHeading Heading text of the section to replace.
 * @param {Object} options.replacementAst Replacement markdown AST (with a [`root`](https://github.com/syntax-tree/mdast#root) top level type), defaulting to empty.
 * @ignore
 */
function mdFileReplaceSection({ markdownPath, targetHeading, replacementAst }) {
  const fileContent = readFileSync(markdownPath, { encoding: 'utf8' })
  const newFileContent = unified()
    .use(parse)
    .use(stringify, remarkStringifyOptions)
    .use(remarkPluginReplaceSection, { targetHeading, replacementAst })
    .processSync(fileContent)

  writeFileSync(markdownPath, newFileContent)
}

module.exports = mdFileReplaceSection
