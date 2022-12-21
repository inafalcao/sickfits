import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination/>', () => {
  it('displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    expect(container).toHaveTextContent('Loading...');
  });

  it('renders pagination for 18 items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    await screen.findByTestId('pagination');
    // Todo: calculate this '9' using config.
    expect(container).toHaveTextContent('Page 1 of 9');
    // or check with that: const pageCountSpan = screen.getByTestId('page-count');
    expect(container).toMatchSnapshot();
  });

  it('Disables the prev on first page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(10)}>
        <Pagination page={1} />
      </MockedProvider>
    );

    const prevLink = await screen.findByText('Prev');
    expect(prevLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('Disables the next last page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={6} />
      </MockedProvider>
    );

    const nextLink = await screen.findByText('Next');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('Disables the next and prev on middle  page', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );

    const nextLink = await screen.findByText('Next');
    expect(nextLink).toHaveAttribute('aria-disabled', 'false');
    const prevLink = await screen.findByText('Prev');
    expect(prevLink).toHaveAttribute('aria-disabled', 'false');
  });
});
