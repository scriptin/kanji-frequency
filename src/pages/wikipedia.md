---
layout: '@layouts/DatasetPageLayout.astro'
title: Wikipedia
subtitle: Articles from Japanese Wikipedia
datasetKey: wikipedia
---

## Data source

[Japanese Wikipedia](https://ja.wikipedia.org/) is a free and open online Japanese encyclopedia.

It contains several millions of articles on various topics, published under permissive licenes.

## How the data was collected

Using the [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page). See the [scripts](https://github.com/scriptin/kanji-frequency/tree/master/scripts/wikipedia).

The API was used for both randomly sampling the articles to achive a desired dataset size without introducing a selection bias, and parsing the contents of articles into plain text format. Alternative option was to parse the wikipedia [dumps](https://dumps.wikimedia.org/), but this entails parsing both XML and wiki markdown, and after multiple experiments it turned out to be impractical.

## What is included

For each article, there parts of data were included:

- Article title
- The text, as rendered by the MediaWiki API. Note that some articles can contain broken wiki markup, which would result into malformed plain text. However, the number of such cases is expected to be negligible, so no additional actions were made to prevent that

Not included:

- Any HTML or wiki markdown, as the texts were converted to plain text format by the API, unless there are problems with malformed markup in the articles
