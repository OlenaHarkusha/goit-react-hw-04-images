import { useEffect, useState } from 'react';
import { GlobalStyle } from '../GlobalStyles';
import { Searchbar } from 'components/Searchbar';
import { getPictures } from 'components/Services/api';
import { ImageGallery } from 'components/ImageGallery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'components/Button';
import { Container } from './App.styled';
import { SyncLoader } from 'react-spinners';

export const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) getImages(query, page);
  }, [query, page]);

  const getImages = async (query, page) => {
    try {
      setIsLoading(true);
      const picturesResponse = await getPictures(query, page);
      if (picturesResponse.hits.length === 0) {
        toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      const pictures = picturesResponse.hits.map(item => ({
        id: item.id,
        webformatURL: item.webformatURL,
        largeImageURL: item.largeImageURL,
        tags: item.tags,
      }));
      setImages(prevState => [...prevState, ...pictures]);
      setTotalPages(Math.ceil(picturesResponse.totalHits / 12));
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const query = e.currentTarget.query.value;
    if (query) {
      setImages([]);
      setPage(1);
      setTotalPages(0);
      setQuery(query);
      setIsLoading(false);
      setError(null);
    } else {
      toast.warn('Please enter a search query');
      e.currentTarget.reset();
    }
  };

  const handleClick = () => {
    setPage(prevState => prevState + 1);
  };

  const showGallery = images.length !== 0;
  const override = {
    display: 'block',
    margin: '0 auto',
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} />
      {error && (
        <h2 style={{ textAlign: 'center' }}>Oops, it's an error: ({error})!</h2>
      )}
      {isLoading && <SyncLoader color="#3f51b5" cssOverride={override} />}
      {showGallery && <ImageGallery pictures={images} />}
      {page < totalPages && <Button onClick={handleClick} />}
      <ToastContainer />
      <GlobalStyle />
    </Container>
  );
};
