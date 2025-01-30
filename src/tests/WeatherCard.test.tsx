import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../components/WeatherCard';
import { describe, it, expect } from 'vitest';

describe('WeatherCard', () => {
    const mockData = {
        weather: [{ main: 'Clear', description: 'clear sky' }],
        main: {
            temp: 293.15,
            temp_max: 295.15,
            temp_min: 291.15,
            humidity: 65,
        },
        wind: { speed: 5.5 },
        name: 'London',
        hourly: [],
    };

    it('displays correct temperature conversion', () => {
        render(<WeatherCard data={mockData} setCity={() => { }} />);
        expect(screen.getByText('20°')).toBeInTheDocument();
    });

    it('shows weather icon based on condition', () => {
        render(<WeatherCard data={mockData} setCity={() => { }} />);
        const icon = screen.getByTestId('weather-icon');
        expect(icon).toBeInTheDocument();
    });

    it('displays weather details in correct format', () => {
        render(<WeatherCard data={mockData} setCity={() => { }} />);
        expect(screen.getByText('22°')).toBeInTheDocument(); // max temp
        expect(screen.getByText('18°')).toBeInTheDocument(); // min temp
        expect(screen.getByText('65%')).toBeInTheDocument(); // humidity
        expect(screen.getByText('5.5km/h')).toBeInTheDocument(); // wind speed
    });
}); 