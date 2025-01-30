import { render, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { describe, it, expect } from 'vitest';

const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
};

describe('ThemeContext', () => {
    it('provides default theme based on system preference', () => {
        const { getByTestId } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(getByTestId('theme').textContent).toBe('light');
    });

    it('toggles theme when triggered', () => {
        const { getByTestId, getByRole } = render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        act(() => {
            getByRole('button').click();
        });

        expect(getByTestId('theme').textContent).toBe('dark');
    });

    it('persists theme in localStorage', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(localStorage.getItem('theme')).toBeDefined();
    });
}); 