import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBooksByKeyword } from "../../../axios/storeApi";
import Store from "./Store";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getBooksByKeyword(keyword, page);
        setBooks(res.data.books || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, [keyword, page]);

  return (
    <div>
      <h3>Search Results for "{keyword || "All Books"}"</h3>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <Store books={books} totalPages={totalPages} page={page} setPage={setPage} />
      )}
    </div>
  );
};

export default SearchResults;
