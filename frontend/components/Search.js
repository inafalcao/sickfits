import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerms: String!) {
    searchTerms: allProducts(where: 
    OR: [
      { name_contains_i: $searchTerms },
      { description_contains_i: $searchTerms }
    ] 
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const [findItems, { loading, data, query }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const debouncedFindItems = () => {
    console.log('debounced');
    debounce(findItems, 350);
  };
  resetIdCounter();

  const { getMenuProps, getInputProps, getComboboxProps } = useCombobox({
    items: [],
    onInputValueChange() {
      console.log('Input change');
      debouncedFindItems();
    },
    onSelectedItemChange() {
      console.log('Selected Item change');
    },
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an Item',
            id: 'search',
            className: 'loading',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        <DropDownItem>Hei</DropDownItem>
      </DropDown>
    </SearchStyles>
  );
}
