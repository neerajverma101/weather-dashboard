import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import WeatherDashboard from '../App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/ThemeContext';
import { describe, it, expect, vi } from 'vitest';

describe('WeatherDashboard Integration', () => {
    const queryClient = new QueryClient();

    interface WrapperProps {
        children: React.ReactNode;
    }

    const wrapper = ({ children }: WrapperProps) => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
    );

    it('integrates search with weather display', async () => {
        global.fetch = vi.fn()
            .mockImplementationOnce(() => Promise.resolve({
                json: () => Promise.resolve({ cod: 200, name: 'London', main: {}, weather: [{}] })
            }))
            .mockImplementationOnce(() => Promise.resolve({
                json: () => Promise.resolve({ list: [] })
            }));

        render(<WeatherDashboard />, { wrapper });

        const input = screen.getByPlaceholderText('Search for a city...');
        fireEvent.change(input, { target: { value: 'London' } });
        fireEvent.submit(input);

        await waitFor(() => {
            expect(screen.getByText('London')).toBeInTheDocument();
        });
    });

    it('handles error states correctly', async () => {
        global.fetch = vi.fn().mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve({ cod: 404, message: 'City not found' })
        }));

        render(<WeatherDashboard />, { wrapper });

        const input = screen.getByPlaceholderText('Search for a city...');
        fireEvent.change(input, { target: { value: 'NonExistentCity' } });
        fireEvent.submit(input);

        await waitFor(() => {
            expect(screen.getByText('City not found')).toBeInTheDocument();
        });
    });
}); 