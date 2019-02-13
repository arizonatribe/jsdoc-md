/**
 * Replaces inline JSDoc member links with markdown links and removes newlines.
 * @param {string} md Markdown.
 * @param {Object[]} [members] Outline members.
 * @param {boolean} [removeNewline=true] Whether or not to remove newline characters (not ideal for the JSDoc "description" tags, but definitely wanted for everything else).
 * @returns {string} Markdown.
 */
const replaceJsdocLinks = (md, members, removeNewline = true) => {
  const regex = /{@link (.+?)}/g
  let match
  while ((match = regex.exec(md))) {
    const [jsdocLink, namepath] = match
    const linkedMember =
      members && members.find(member => member.namepath === namepath)
    if (linkedMember) md = md.replace(jsdocLink, `(#${linkedMember.slug})`)
    else
      throw new Error(`Missing JSDoc member for link namepath “${namepath}”.`)
  }
  return removeNewline ? (md || '').replace(/\r?\n/g, ' ') : md
}

module.exports = replaceJsdocLinks
