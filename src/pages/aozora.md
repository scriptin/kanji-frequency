---
layout: '@layouts/DatasetPageLayout.astro'
title: Aozora
subtitle: Books from Aozora Bunko
datasetKey: aozora
---

## Data source

[Aozora Bunko](https://www.aozora.gr.jp/) (青空文庫) is a Japanese digital library.

It contains several 17,000+ of literary works of fiction and non-fiction in Japanese language. These include out-of-copyright (usually public domain) works that the authors made freely available.

## How the data was collected

Using a web crawler/scraper. See the [scripts](https://github.com/scriptin/kanji-frequency/tree/master/scripts/aozora).

Some kanji in the texts on the Aozora website are not included in the Shift-JIS encoding which is used on the website, are such kanji represented with pictures. In all such cases, the pictures were replaced with a corresponing kanji, and the texts were converted into UTF-8 encoding.

## What is included

For each work, there parts of data were included:

- Title of work
- Author's name
- Main text

Not included:

- 'alt' texts for images, as they are not normally displayed in the texts, it's an accessibility feature for screen readers
- Footnotes, unless embedded in the main text
- Publishing and technical information
- Potentially, any HTML comments and other attributes embedded in the pages which are not normally visible
