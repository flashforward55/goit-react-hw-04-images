import React, { useState, useEffect } from 'react';
import { AppContainer, Message } from './App.styled';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import { fetchImagesFromServer, IMAGES_PER_PAGE } from '../services/api';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [searchQueryError, setSearchQueryError] = useState(false);
  const [repeatSearchQuery, setRepeatSearchQuery] = useState(false);
  const [noResultsError, setNoResultsError] = useState(false);
  const [errorFetchingImages, setErrorFetchingImages] = useState(false);
  const [loaderHeight, setLoaderHeight] = useState('100vh');

  useEffect(() => {
    const fetchImages = async () => {
      if (searchQuery === '') {
        setImages([]);
        setCurrentPage(1);
        setTotalHits(0);
        setSearchQueryError(true);
        setNoResultsError(false);
        setRepeatSearchQuery(false);
      } else {
        try {
          setIsLoading(true);
          const response = await fetchImagesFromServer(
            searchQuery,
            currentPage
          );
          if (response.hits.length === 0) {
            setNoResultsError(true);
          } else {
            setImages(prevImages => [...prevImages, ...response.hits]);
            setTotalHits(response.totalHits);
          }
        } catch (error) {
          setErrorFetchingImages(true);
          console.log('Error fetching images:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchImages();
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = e => {
    e.preventDefault();
    const searchQueryValue = e.target.elements.searchQuery.value.trim();
    if (searchQueryValue === searchQuery) {
      setRepeatSearchQuery(true);
      setSearchQueryError(false);
      if (searchQueryValue === '') {
        setImages([]);
        setCurrentPage(1);
        setTotalHits(0);
        setSearchQueryError(true);
        setNoResultsError(false);
        setRepeatSearchQuery(false);
        setLoaderHeight('100vh');
      }
    } else {
      setImages([]);
      setCurrentPage(1);
      setTotalHits(0);
      setSearchQuery(searchQueryValue);
      setSearchQueryError(false);
      setNoResultsError(false);
      setLoaderHeight('100vh');
      setRepeatSearchQuery(false);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
    setIsLoading(true);
    setLoaderHeight('5vh');
  };

  const handleImageClick = (imageUrl, imageTags) => {
    setSelectedImage(imageUrl);
    setSelectedTags(imageTags);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
    setSelectedTags('');
  };

  const showLoadMoreButton =
    currentPage < Math.ceil(totalHits / IMAGES_PER_PAGE);
  const isLastPage = !showLoadMoreButton && currentPage !== 1;

  return (
    <AppContainer>
      <Searchbar onSubmit={handleSearchSubmit} isLoading={isLoading} />
      {searchQueryError && <Message>Please enter a search term</Message>}
      {noResultsError && <Message>No results found</Message>}
      {errorFetchingImages && <Message>Error fetching images</Message>}
      {repeatSearchQuery && <Message>The same request was detected</Message>}
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={handleImageClick} />
      )}
      {isLoading && <Loader height={loaderHeight} />}
      {showLoadMoreButton && !isLoading && (
        <Button onLoadMore={handleLoadMore} />
      )}
      {isLastPage && <Message>Reached the last page of images</Message>}
      {showModal && (
        <Modal
          imageUrl={selectedImage}
          imageTags={selectedTags}
          onCloseModal={handleCloseModal}
        />
      )}
    </AppContainer>
  );
};

export default App;
