---
layout: '@layouts/DatasetPageLayout.astro'
title: News
subtitle: News articles from Japanese Wikinews
---

## Data source

[Japanese Wikinews](https://ja.wikinews.org/) is a free and open online Japanese news website.

It contains 3,700+ news articles on various political, social, cultural, sports, and other topics, spanning from 2005 to present.

**This dataset is small!** The reason for that is that Wikinews is pretty much the only free/open and convenient option for getting a significant amout of news texts which span over a wide time period.

Other options include:

- Writing a crawlers/scrapers for news websites. It was done in the [old version](/kanji-frequency/old-verion) of this dataset. However, most news websites are now partially behind paywalls and do not have historical archives readily available online
- Buying a newspaper or a website archive. Some popular media agencies in Japan are selling such archives. Unfortunately, I currently cannot afford to spend enough time, energy, and money to research, buy, and process such archives.

I am open to any suggestions on improving this dataset. Please consider opening an [issue](https://github.com/scriptin/kanji-frequency/issues) if you can offer any help.

## How the data was collected

Using the [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page). See the [scripts](https://github.com/scriptin/kanji-frequency/tree/master/scripts/news).

The API was used for parsing the contents of articles into plain text format. The API was also used to randomly sample the articles, but the resulting dataset includes almost every article available due to small number of articles.

## What is included

For each article, there parts of data were included:

- Article title
- The text, as rendered by the MediaWiki API

Not included:

- A date which is preceding the main article text. It's a common format of all articles. I decided to exlude it because normally a person would skip it
- All correction articles, which are published separately but are essentially addendums to the main articles and not standalone texts
- Any HTML or wiki markdown, as the texts were converted to plain text format by the API, unless there are problems with malformed markup in the articles
