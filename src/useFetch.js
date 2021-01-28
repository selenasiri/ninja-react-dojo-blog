import { useState, useEffect } from 'react';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: abortCont.signal });

        if (!response.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 

        const data = await response.json()

        setIsPending(false);
        setData(data);
        setError(null);

      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('fetch aborted')
        } else {
          // auto catches network / connection error
          setIsPending(false);
          setError(err.message);
        }
      }
    }

    fetchData()

    // abort the fetch
    return () => abortCont.abort();
  }, [url])

  return { data, isPending, error };
}
 
export default useFetch;