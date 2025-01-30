import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('SearchBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('handles suggestions correctly', async () => {
        const mockResponse = [
            { name: 'London', country: 'GB' },
            { name: 'Paris', country: 'FR' }
        ];

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponse),
            })
        ) as any;

        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Search for a city...');
        fireEvent.change(input, { target: { value: 'Lon' } });

        await waitFor(() => {
            expect(screen.getByText('London, GB')).toBeInTheDocument();
        });
    });

    it('manages recent searches in localStorage', () => {
        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Search for a city...');
        fireEvent.change(input, { target: { value: 'Tokyo' } });
        fireEvent.submit(input.closest('form')!);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'recentSearches',
            expect.stringContaining('Tokyo')
        );
    });

    it('clears recent searches when clear button is clicked', async () => {
        localStorage.setItem('recentSearches', JSON.stringify(['Tokyo', 'London']));

        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        const input = screen.getByPlaceholderText('Search for a city...');
        fireEvent.focus(input);

        await waitFor(() => {
            const clearButton = screen.getByText('Clear');
            fireEvent.click(clearButton);
        });

        expect(localStorage.removeItem).toHaveBeenCalledWith('recentSearches');
    });
}); 