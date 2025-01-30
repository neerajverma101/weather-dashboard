import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with input value when form is submitted', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.submit(input);
    
    expect(onSearch).toHaveBeenCalledWith('London');
  });

  it('does not call onSearch when input is empty', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a city...');
    fireEvent.submit(input);
    
    expect(onSearch).not.toHaveBeenCalled();
  });
});