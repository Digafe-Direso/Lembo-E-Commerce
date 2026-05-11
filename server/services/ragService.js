// server/services/ragService.js
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';
import { OllamaEmbeddings } from '@langchain/ollama';

// Setup vector search for products
const embeddings = new OllamaEmbeddings({
  model: "all-MiniLM-L6-v2",
  baseUrl: "http://localhost:11434"
});

const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: productsCollection,
  indexName: "vector_index",
  textKey: "description",
  embeddingKey: "embedding"
});

// Search for relevant products
const searchResults = await vectorStore.similaritySearch(userQuery, 5);