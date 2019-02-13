/* eslint-disable no-console, curly */
const fs = require('fs')
const globby = require('globby')
const DEFAULTS = require('./defaults')
const jsdocCommentsFromCode = require('./jsdocCommentsFromCode')
const jsdocToMember = require('./jsdocToMember')
const mdFileReplaceSection = require('./mdFileReplaceSection')
const membersToMdAst = require('./membersToMdAst')

/**
 * Scrapes JSDoc from files to populate a markdown file documentation section.
 * @kind function
 * @name jsdocMd
 * @param {Object} [options] Options.
 * @param {string} [options.sourceGlob=**\/*.{mjs,js}] JSDoc source file glob pattern.
 * @param {string} [options.markdownPath=readme.md] Path to the markdown file for docs insertion.
 * @param {string} [options.targetHeading=API] Markdown file heading to insert docs under.
 * @example <caption>Customizing all options.</caption>
 * ```js
 * const { jsdocMd } = require('jsdoc-md')
 *
 * jsdocMd({
 *   sourceGlob: 'index.mjs',
 *   markdownPath: 'README.md',
 *   targetHeading: 'Docs'
 * })
 * ```
 */
function jsdocMd({
  sourceGlob = DEFAULTS.sourceGlob,
  markdownPath = DEFAULTS.markdownPath,
  targetHeading = DEFAULTS.targetHeading
} = {}) {
  const members = []

  globby.sync(sourceGlob, { gitignore: true }).forEach(path => {
    jsdocCommentsFromCode(
      fs.readFileSync(path, { encoding: 'utf8' }),
      path
    ).forEach(jsdoc => {
      const member = jsdocToMember(jsdoc)
      if (member) members.push(member)
    })
  })

  /* This is to smooth out a rough spot in the upstream package:
   * it would fail if the file and/or the section in the file didn't exist.
   * Also, it would jump into that logic even if nothing had been parsed from the code
   **/
  if (members.length) {
    console.log(
      `Parsed ${members.length} files matching the pattern: "${sourceGlob}"`
    )
    const replacementAst = membersToMdAst(members)

    const API_HEADING = new RegExp(`\n?#+ +${targetHeading}:?\n`, 'i')
    const mdown = fs.existsSync(markdownPath)
      ? String(fs.readFileSync(markdownPath, { encoding: 'utf8' }))
      : ''
    if (!API_HEADING.test(mdown))
      fs.writeFileSync(markdownPath, `${mdown}\n## ${targetHeading}\n`, {
        encoding: 'utf8'
      })

    mdFileReplaceSection({ markdownPath, targetHeading, replacementAst })
    console.log(`Added documentation to:\n${markdownPath}`)
  } else {
    console.log('Nothing was parsed.')
  }
}

module.exports = jsdocMd
