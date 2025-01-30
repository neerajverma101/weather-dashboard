import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../components/WeatherCard';

const mockWeatherData = {
  weather: [{ main: 'Clear', description: 'clear sky' }],
  main: {
    temp: 293.15, // 20°C
    temp_max: 295.15, // 22°C
    temp_min: 291.15, // 18°C
    humidity: 65,
  },
  wind: { speed: 5.5 },
  name: 'London',
  sys: { country: 'GB' },
};

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard data={mockWeatherData} />);
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('CLEAR SKY')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('5.5km/h')).toBeInTheDocument();
  });
});