import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useRedirectIfAuthenticated = (link) => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(link);
    }
  }, [token, navigate, link]);
};

export default useRedirectIfAuthenticated;

