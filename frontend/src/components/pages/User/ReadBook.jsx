import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookForUser } from '../../../axios/userApi';

const ReadBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);


  useEffect(() => {
    const fetchBook = async () => {
      try {
    
        const { data } = await getBookForUser(id);
        setBook(data.book);
      
      } catch (err) {
        console.error(err);
        setError('Failed to load book');
      } 
    };
    fetchBook();
  }, [id]);

  
  return (
    <div>{console.log(book)}</div>
  );
};

export default ReadBook;