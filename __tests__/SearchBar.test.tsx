import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom'; // Import screen object
import '@testing-library/jest-dom/extend-expect'; // Import matchers

import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('performs a search and displays the results', async () => {
    // Mock fetch response
    const mockResponse = {
      totalItems: 2,
      items: [
        {
          volumeInfo: {
            authors: ['Author 1'],
            title: 'Book 1',
            publishedDate: '2023-01-01',
            description: 'Sample description',
          },
        },
        {
          volumeInfo: {
            authors: ['Author 2'],
            title: 'Book 2',
            publishedDate: '2021-01-01',
            description: '2nd Sample description',
          },
        },
      ],
    };
    const mockFetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    Object.defineProperty(window, 'fetch', {
      writable: true,
      value: mockFetch,
    });

    // Render the SearchBar component
    const { getByPlaceholderText, getByTestId, getAllByTestId } = render(<SearchBar />);

    // Enter a search query and trigger the search
    const searchInput = getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'query' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    // Wait for the results to be displayed
    await waitFor(() => getAllByTestId('book-item'));
    expect(screen.getByText(/Book 1/i)).toBeInTheDocument();

    const dropdown = await getByTestId('display-filter-dropdown') as HTMLSelectElement;
    // Simulate changing the dropdown selection
    fireEvent.change(dropdown, { target: { value: '20' } });

    // Verify if the currentPage state is updated
    expect(dropdown.value).toBe('20');
    //btns
    const nextBtn = await getByTestId('next');
    await fireEvent.click(nextBtn)
    const prevBtn = await getByTestId('prev');
    fireEvent.click(prevBtn)

    //changing inputs
    const currentPageInput = await getByTestId('currentPage');
    fireEvent.change(currentPageInput, { target: { value: '3' } });
    fireEvent.change(currentPageInput, { target: { value: '1' } });

    //item click
    const bookItemClick = await getAllByTestId('book-item');
    fireEvent.click(bookItemClick[0])
    fireEvent.click(bookItemClick[0]) //for toggle

  });

});