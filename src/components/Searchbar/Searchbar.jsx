import PropTypes from 'prop-types';
import {
  SearchbarContainer,
  SearchForm,
  SearchButton,
  SearchButtonLabel,
  SearchInput,
} from './Searchbar.styled';

const Searchbar = ({ onSubmit, isLoading }) => {
  return (
    <SearchbarContainer>
      <SearchForm onSubmit={onSubmit}>
        <SearchButton type="submit" disabled={isLoading}>
          <SearchButtonLabel>Search</SearchButtonLabel>
        </SearchButton>
        <SearchInput
          type="text"
          name="searchQuery"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarContainer>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Searchbar;
