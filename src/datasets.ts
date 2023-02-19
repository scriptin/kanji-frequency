import aozoraCharacters from '@data/aozora_characters.csv';
import aozoraDocuments from '@data/aozora_documents.csv';
import wikipediaCharacters from '@data/wikipedia_characters.csv';
import wikipediaDocuments from '@data/wikipedia_documents.csv';
import newsCharacters from '@data/news_characters.csv';
import newsDocuments from '@data/news_documents.csv';

export type DatasetKey = 'aozora' | 'wikipedia' | 'news';

export interface CharactersTableRow {
  rank: string;
  code_point_hex: string;
  char: string;
  char_count: string;
}

export interface DocumentsTableRow {
  rank: string;
  code_point_hex: string;
  char: string;
  doc_count: string;
}

export interface Dataset {
  characters: CharactersTableRow[];
  documents: DocumentsTableRow[];
}

export const datasets: Record<DatasetKey, Dataset> = {
  aozora: {
    characters: aozoraCharacters,
    documents: aozoraDocuments,
  },
  wikipedia: {
    characters: wikipediaCharacters,
    documents: wikipediaDocuments,
  },
  news: {
    characters: newsCharacters,
    documents: newsDocuments,
  },
};
