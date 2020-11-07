# Kanji frequency

Statistical data of kanji usage frequencies was collected by processing textual data from various sources. You can find these files in the [`data`](data) directory:

| File                                  | Total # of kanji | Description                                               | Date      |
| ------------------------------------- | ---------------: | --------------------------------------------------------- | --------- |
| [aozora.json](data/aozora.json)       |           ~51.5M | Fiction and non-fiction books from [Aozora Bunko][aozora] | May 2015  |
| [news.json](data/news.json)           |           ~10.3M | Online news articles from various sources                 | June 2015 |
| [twitter.json](data/twitter.json)     |           ~10.0M | Twitter messages collected by a [bot][twitter-bot]        | June 2015 |
| [wikipedia.json](data/wikipedia.json) |          ~784.6M | Japanese [Wikipedia dump][wiki-dumps]                     | May 2015  |

See detailed descriptions below.

## Format

Each file contain an array of arrays (rows). Each row contains three fields:

1. (string) Kanji itself. `"all"` is a special case in the first row.
2. (integer) How many times it was found in the analyzed data set. For `"all"` it is a total number of kanji, including repetitions.
3. (float) Fraction of total amount of data this character represents. For `"all"` it is `1` (i.e. 100%).

## Aozora

- Sources: [Aozora Bunko][aozora]
- Result: [aozora.json](data/aozora.json)
- Total # of kanji collected: ~51.5M
- Date collected: May 2015
- Processing method: Pages were scanned as plain text, ignoring HTML structure, since they contain very little extra content.

### Known issues

<http://vtrm.net/japanese/kanji-frequency/en> points out:

> Some kanji radicals or elements which are usually not used on their own gathered relatively high rankings. One would expect such elements not to occur at all, or nearly so. For example, in Shpika’s list, 廴, a radical not used on its own, is stated to occur 1595 times and is ranked 2294th most common kanji.
The explanation is simple: when a kanji outside the JIS X 0208 set appears in a text, the Aozora Bunko policy is to break it out into simpler parts. By instance, 𢌞 (it may not be displayed correctly if you don’t have a suitable font installed) is written ※［＃「廴＋囘」、第4水準2-12-11］, where 廴＋囘 is the kanji decomposition and 第4水準2-12-11 is the JIS X 0213 code point.

## News

- Sources (may be outdated):
  - http://www.asahi.com/
  - http://mainichi.jp/
  - http://www.saga-s.co.jp/
  - http://www.yomiuri.co.jp/
- Result: [news.json](data/news.json)
- Total # of kanji collected: ~10.3M
- Date collected: June 2015
- Processing method: Samples include articles published between June 2014 and June 2015, more samples from 2015. Only article titles, subtitles, main text body and image captions were scanned. Everything else was ignored: menus, publication dates, comments, ads, links to related articles, etc. Weather forecasts and area-specific news were not included.

## Twitter

- Sources: [Twitter][https://twitter.com/] via [Streaming API][twitter-stream]
- Result: [twitter.json](data/twitter.json)
- Total # of kanji collected: ~10.0M
- Date collected: June 2015
- Processing method: Messages were collected within about 1 week from [Twitter's Streaming API v1][twitter-stream] using a [bot][twitter-bot]. Only message text bodies were scanned, authors' names and other data ignored. You can find specific details in the bot's source code, at commit [e82cf7c
](https://github.com/scriptin/twitter-kanji-frequency/tree/e82cf7c6093b7b789c52f238a4eb41a3ced1fdc9) (the exact version used to collect the data).

### Known issues

Twitter dataset contains a lot of kanji used primarily in emoji:

- `( ^ω^)个` (umbrella/flower?)
- `Ｕ^皿^Ｕ` (grin/teeth, mustache?)
- `(　’ω’)旦~~` (cup)
- `(╯°益°)╯` (rage face)
- `(oT-T)尸` (flag)
- and probably many more

Also, the "笑" character is #1 simply bause it is used as a generic "smiley face". Yet technically, it's not an emoji because it's used for its meaning, as opposed to the examples above that are used only for their shapes.

## Wikipedia

- Sources: [Japanese Wikipedia](https://ja.wikipedia.org/) via [Wikipedia dump][wiki-dumps] (see [`jawiki` bot][jawiki])
- Result: [wikipedia.json](data/wikipedia.json)
- Total # of kanji collected: ~784.6M
- Date collected: May 2015
- Processing method: Dump included only current versions of pages and articles, without previous revisions or any other history of editing. Dump was scanned as plain text, ignoring XML and wiki markup structure.

### Known issues

Since XML structure and wiki markup was ignored, thus this dataset is *potentially* noisy. This needs further investigation. Proper parsing was not implemented simply because it is too difficult (need to parse both XML and wiki markup).

## License

This is a multi-license project. Choose any license from this list:

- [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0) or any later version
- [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/) or any later version
- [EPL-1.0](https://www.eclipse.org/legal/epl-v10.html) or any later version
- [LGPL-3.0](http://www.gnu.org/licenses/lgpl-3.0.html) or any later version
- [MIT](http://opensource.org/licenses/MIT)

[aozora]: http://www.aozora.gr.jp/
[jawiki]: https://dumps.wikimedia.org/jawiki/
[jouyou]: https://en.wikipedia.org/wiki/J%C5%8Dy%C5%8D_kanji
[twitter-bot]: https://github.com/scriptin/twitter-kanji-frequency
[twitter-stream]: https://developer.twitter.com/en/docs/twitter-api/v1/tweets/filter-realtime/api-reference/post-statuses-filter
[wiki-dumps]: https://dumps.wikimedia.org/
