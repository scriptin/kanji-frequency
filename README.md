# Kanji frequency

Statistical data of kanji usage frequencies was collected by processing textual data from various sources. You can find these files in the `data` directory:

| File             | # of kanji | Description                                               | Date      |
| ---------------- | ---------: | --------------------------------------------------------- | --------- |
| `aozora.json`    |     ~51.5M | Fiction and non-fiction books from [Aozora Bunko][aozora] | May 2015  |
| `news.json`      |     ~10.3M | Online news articles from various sources                 | June 2015 |
| `twitter.json`   |     ~10.0M | Twitter messages collected by a [bot][twitter-bot]        | June 2015 |
| `wikipedia.json` |    ~784.6M | [Wikipedia dump][wiki-dumps] (see [`jawiki` bot][jawiki]) | May 2015  |

Notes:

- `aozora.json`: Pages were scanned as plain text, ignoring HTML structure, since they contain very little extra content.
- `news.json`: Samples include articles published in the last year (June 2014 - June 2015, more samples from 2015), from 4 different sources. Only article titles, subtitles, main text body and image captions were scanned. Everything else was ignored: menus, publication dates, comments, ads, links to related articles, etc. Weather forecasts and area-specific news were not included.
- `twitter.json`: Messages were collected within about 1 week from [Twitter's Streaming API][twitter-stream]. Only message text bodies were scanned, authors' names and other data ignored.
- `wikipedia.json`: Dump included only current versions of pages and articles, without previous revisions or any other history of editing. Dump was scanned as plain text, ignoring XML and wiki markup structure.

## Format

Each file contain an array of arrays (rows). Each row contains three fields:

1. (string) Kanji itself. `"all"` is a special case in the first row.
2. (integer) How many times it was found in the analyzed data set. For `"all"` it is a total number of kanji, including repetitions.
3. (float) Fraction of total amount of data this character represents. For `"all"` it is `1` (i.e. 100%).

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
[twitter-stream]: https://dev.twitter.com/streaming/overview
[wiki-dumps]: https://dumps.wikimedia.org/
