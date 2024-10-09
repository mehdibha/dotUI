import { allDocs } from 'content-collections';
import { createSearchAPI } from 'fumadocs-core/search/server';
 
export const { GET } = createSearchAPI('simple', {
  indexes: allDocs.map((docs) => ({
    title: docs.title,
    content: docs.content // Raw Content
    url: docs.url,
  })),
});