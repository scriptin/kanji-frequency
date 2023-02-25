# Kanji usage frequency

Datasets built from various Japanese language corpora

<https://scriptin.github.io/kanji-frequency/> - see this website for the dataset description. This readme describes only technical aspects.

You can download the datasets here: <https://github.com/scriptin/kanji-frequency/tree/master/data>

## Building the datasets

You'll need Node.js 18 or later.

See `scripts` section in [package.json](./package.json).

Aozora:

- `aozora:download` - use crawler/scraper to collect the data
- `aozora:gaiji:extract` - extract gaiji notations data from scraped pages. Gaiji refers to kanji charasters which are replaced with images in the documents, because Shift-JIS encoding cannot represent them
- `aozora:gaiji:replacements` - build gaiji replacements file - produces only partial results, which may need to be manually completed
- `aozora:clean` - clean the scraped pages (apply gaiji replacements)
- `aozora:count` - create the dataset

Wikipedia:

- `wikipedia:fetch` - fetch random pages using MediaWiki API
- `wikipedia:count` - create the dataset

News:

- `news:wikinews:fetch` - fetch random pages from Wikinews using MediaWiki API
- `news:count` - create the dataset
- `news:dates` - create additional file with dates of articles

## Building the website

See [Astro](https://astro.build/) [docs](https://docs.astro.build/en/getting-started/) and the `scripts` section in [package.json](./package.json).
