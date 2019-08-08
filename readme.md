# jsdoc-md-standard

[![npm version](https://badgen.net/npm/v/jsdoc-md-standard)](https://www.npmjs.com/package/jsdoc-md-standard) [![Build status](https://travis-ci.org/arizonatribe/jsdoc-md-standard.svg?branch=master)](https://travis-ci.org/arizonatribe/jsdoc-md-standard)

A Node.js CLI to analyze source JSDoc and generate documentation under a given heading in a markdown file (such as `readme.md`).

## Setup

To try it out with [npx](https://npm.im/npx) run:

```sh
npx jsdoc-md-standard --help
```

To install [`jsdoc-md-standard`](https://www.npmjs.com/package/jsdoc-md-standard) from [npm](https://npmjs.com) as a dev dependency run:

```sh
npm install jsdoc-md-standard --save-dev
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "build:docs": "jsdoc-md-standard"
  }
}
```

Then run the script to update docs:

```sh
npm run build:docs
```

## CLI

For detailed CLI usage instructions, run `npx jsdoc-md-standard --help`.

| Option | Alias | Default | Description |
| :-- | :-- | :-- | :-- |
| `--source-glob` | `-s` | `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `--markdown-path` | `-m` | `readme.md` | Path to the markdown file for docs insertion. |
| `--target-heading` | `-t` | `API` | Markdown file heading to insert docs under. |

## API

### Table of contents

- [function jsdocMd](#function-jsdocmd)
  - [Examples](#examples)

### function jsdocMd

Scrapes JSDoc from files to populate a markdown file documentation section.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `options` | Object? | Options. |
| `options.sourceGlob` | string? = `**/*.{mjs,js}` | JSDoc source file glob pattern. |
| `options.markdownPath` | string? = `readme.md` | Path to the markdown file for docs insertion. |
| `options.targetHeading` | string? = `API` | Markdown file heading to insert docs under. |

#### Examples

_Customizing all options._

```js
const { jsdocMd } = require('jsdoc-md')

jsdocMd({
  sourceGlob: 'index.mjs',
  markdownPath: 'README.md',
  targetHeading: 'Docs'
})
```

## Caveats

### No code inference

Missing JSDoc tags are not inferred by inspecting the code, so be sure to use all the necessary tags.

```js
/**
 * The number 1.
 * @kind constant
 * @name ONE
 * @type {number}
 */
const ONE = 1
```

### Tag subset

A JSDoc tag subset is supported:

- [`@kind`](http://usejsdoc.org/tags-kind)
- [`@name`](http://usejsdoc.org/tags-name)
- [`@type`](http://usejsdoc.org/tags-type)
- [`@prop`](http://usejsdoc.org/tags-property)
- [`@param`](http://usejsdoc.org/tags-param)
- [`@returns`](http://usejsdoc.org/tags-returns)
- [`@see`](http://usejsdoc.org/tags-see)
- [`@example`](http://usejsdoc.org/tags-example)
- [`@ignore`](http://usejsdoc.org/tags-ignore)

With the full set of JSDoc tags there is a confusing number of ways to document the same thing. Examples `TWO` and `THREE` use unsupported syntax:

```js
/**
 * My namespace.
 * @kind namespace
 * @name MyNamespace
 */
const MyNamespace = {
  /**
   * The number 1.
   * @kind constant
   * @name MyNamespace.ONE
   * @type {number}
   */
  ONE: 1,

  /**
   * The number 2 (unsupported).
   * @constant {number} TWO
   * @memberof MyNamespace
   */
  TWO: 2,

  /**
   * The number 3 (unsupported).
   * @const MyNamespace.THREE
   * @type {number}
   */
  THREE: 3
}
```

### Namepath prefixes

[JSDoc namepath prefixes](http://usejsdoc.org/about-namepaths) are not supported:

- [`module:`](http://usejsdoc.org/tags-module)
- [`external:`](http://usejsdoc.org/tags-external)
- [`event:`](http://usejsdoc.org/tags-event)

### Namepath special characters

[JSDoc namepath special characters](http://usejsdoc.org/about-namepaths) with surrounding quotes and backslash escapes (e.g. `@name a."#b"."\"c"`) are not supported.

### Inline tags

One [JSDoc inline tag link](http://usejsdoc.org/tags-inline-link) syntax is supported for namepath links in JSDoc descriptions and tags with markdown content: `` [`b` method]{@link A#b} ``. Use normal markdown syntax for non-namepath links.

Other inline tags such as [`{@tutorial}`](http://usejsdoc.org/tags-inline-tutorial) are unsupported.

### Example content

This is where `jsdoc-md-standard` deviates from the upstream `jsdoc-md` package. That package went in a non-standard direction in how `@example` tags are treated, which you no doubt found out if you tried to generate documentation via JSDoc via [its default template](http://usejsdoc.org/about-configuring-default-template.html) or [one of the 100+ community templates](https://www.npmjs.com/search?q=jsdoc+template).

If you need to generate multiple examples, you add multiple `@example` tags, plain and simple. That's how we've been writing JSDoc annotations for years and it doesn't make sense to force you to refactor your code comments to turn `@example` tags into mini blog posts.

Stuffing markdown or paragraphs of text into an `@example` block sounds like a nice enough idea but breaks every template's attempt to syntax highlight your example code. It also prevents you from using some of the JSDoc plugins that are meant to run doctests off of the raw JavaScript it parses from your examples.

As is standard with JSDoc you can still set captions, wrapped inside of a `<caption />` tag \[[1](http://usejsdoc.org/tags-example)].
