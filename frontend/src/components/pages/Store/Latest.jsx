import React, { useEffect, useState } from "react";
import Store from "./Store";
import { getLatestBooks } from "../../../axios/storeApi";

const Latest = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await getLatestBooks({ page, limit: 16 });
        setBooks(data.books || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooks();
  }, [page]);

  return(
    <Store books={books} totalPages={totalPages} page={page} setPage={setPage} />
  )
};

export default Latest;
