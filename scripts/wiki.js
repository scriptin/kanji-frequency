// https://www.mediawiki.org/wiki/API:Etiquette
// https://meta.wikimedia.org/wiki/User-Agent_policy
const USER_AGENT =
  'KanjiFrequencyBot/2.0 (https://github.com/scriptin/kanji-frequency)';

function getQuery(continueParams) {
  // https://www.mediawiki.org/wiki/API:Query
  const queryParams = new URLSearchParams();
  queryParams.set('action', 'query');
  queryParams.set('maxlag', '5'); // https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
  queryParams.set('format', 'json');
  queryParams.set('generator', 'random');
  queryParams.set('grnnamespace', '0'); // articles only
  queryParams.set('grnlimit', '1'); // only 1 because TextExtracts only supports 1 at a time
  queryParams.set('prop', 'extracts'); // https://www.mediawiki.org/wiki/Extension:TextExtracts
  queryParams.set('explaintext', 'true');
  if (continueParams && typeof continueParams === 'object') {
    for (const param of Object.keys(continueParams)) {
      queryParams.set(param, continueParams[param]);
    }
  }

  return queryParams;
}

async function fetchWithContinue(apiUrl, continueParams) {
  const response = await fetch(
    apiUrl + '?' + getQuery(continueParams).toString(),
    {
      method: 'GET',
      headers: new Headers({
        'User-Agent': USER_AGENT,
      }),
    },
  );
  const json = await response.json();
  if (json.error) {
    console.error('API request failed:');
    console.error(JSON.stringify(json.error, null, '  '));
    process.exit(1);
  }
  return json;
}

function getContinueParams(responseJson) {
  return responseJson.continue ?? {};
}

function getPagesOrStop(responseJson) {
  const pages = responseJson.query?.pages;
  if (!pages) {
    console.error('Response has no "query.pages" field');
    console.error(JSON.stringify(responseJson, null, '  '));
    process.exit(1);
  }
  return pages;
}

function getTitleAndText(page) {
  const title = page.title;
  if (!title) {
    console.error('Page has missing or empty "title" field:');
    console.error(JSON.stringify(page, null, '  '));
  }

  const text = page.extract;
  if (!text) {
    console.error('Page has missing or empty "extract" field:');
    console.error(JSON.stringify(page, null, '  '));
  }

  return { title, text };
}

module.exports = {
  fetchWithContinue,
  getContinueParams,
  getPagesOrStop,
  getTitleAndText,
};
