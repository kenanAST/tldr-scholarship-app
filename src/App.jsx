import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [summarizedData, setSummarizedData] = useState([]);
  const [loadingSerper, setLoadingSerper] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Track the index of the hovered item

  let serperHeaders = {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_SERPER_API_KEY,
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSerper(true);

    const query = JSON.stringify({
      q: e.target[0].value,
    });

    try {
      const response = await axios.post(
        'https://google.serper.dev/scholar',
        query,
        {
          headers: serperHeaders,
        }
      );
      setData(response.data.organic);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoadingSerper(false);
    }
  };

  const handleSummarization = async (article_title) => {
    setLoadingSummary(true);
    try {
      const response = await axios.get(
        `http://0.0.0.0:8000/summarize?article_title=${article_title}`
      );
      setSummarizedData(response.data.summary);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <>
      <h1>Summarize Scholarly Article AI</h1>

      <form onSubmit={handleSearch}>
        <input type='text' />
        <button type='submit'>Search</button>
      </form>

      {loadingSerper ? <p>loading...</p> : null}

      <ol>
        {data.map((article, index) => (
          <a
            key={article.id}
            href='#'
            onClick={() => handleSummarization(article.title)}
            style={{
              color: 'black',
              textDecoration: hoveredIndex === index ? 'underline' : 'none', // Apply underline based on hoveredIndex
            }}
            onMouseEnter={() => {
              setHoveredIndex(index); // Set the hoveredIndex to the current index
            }}
            onMouseLeave={() => {
              setHoveredIndex(null); // Reset hoveredIndex when leaving
            }}
          >
            <li>{article.title}</li>
          </a>
        ))}
      </ol>

      {loadingSummary ? <p>loading...</p> : null}

      {summarizedData.length > 0 ? (
        <div>
          <h2>Article Summary</h2>
          <p>{summarizedData}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
