import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import axios from 'axios';
import Book from '../models/bookModel.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();
await connectDB();

const catalogPath = 'pg_catalog.csv';

const searchOpenLibrary = async (title, author) => {
  try {
    const searchRes = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`);
    const doc = searchRes.data.docs[0];
    if (!doc || !doc.key) return null;

    const workKey = doc.key; // e.g., /works/OL12345W
    const workRes = await axios.get(`https://openlibrary.org${workKey}.json`);
    const work = workRes.data;

    return {
      genres: work.subjects?.slice(0, 5) || [],
      description: typeof work.description === 'object' ? work.description.value : work.description || null,
      published_year: doc.first_publish_year || null,
      cover_id: doc.cover_i || null
    };
  } catch (err) {
    console.error(`❌ Open Library enrichment failed for "${title}"`, err.message);
    return null;
  }
};

const seedBooks = async () => {
  const stream = fs.createReadStream(catalogPath).pipe(csv());

  for await (const row of stream) {
    try {
      const id = parseInt(row['Text#']);
      const title = row.Title?.trim();
      const author = row.Authors?.trim();

      if (!id || !title || !author ) continue;

      const pdf_url = `https://www.gutenberg.org/files/${id}/${id}-0.txt`;

      const enrichment = await searchOpenLibrary(title, author);

      if(!enrichment || !enrichment.description || !enrichment.genres || !enrichment.cover_id) continue;

      const cover_url = enrichment?.cover_id
        ? `https://covers.openlibrary.org/b/id/${enrichment.cover_id}-L.jpg`
        : `https://covers.openlibrary.org/b/isbn/${row.ISBN || '0451526538'}-L.jpg`;

      const newBook = {
        id,
        title,
        author,
        language: row.Language?.trim() || 'en',
        pdf_url,
        cover_url,
        genres: enrichment?.genres || [],
        published_year: enrichment?.published_year || null,
        description: enrichment?.description || '',
      };

      await Book.updateOne({ id }, newBook, { upsert: true });
      console.log(`✔ Book saved: ${title}`);
    } catch (err) {
      console.error(`❌ Error for row: ${row.Title}`, err.message);
    }
  }

  console.log('\n✅ Finished importing books');
  mongoose.disconnect();
};

seedBooks();
