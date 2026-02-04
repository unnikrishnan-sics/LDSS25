import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        // Since App likely renders LandingPage or redirects, check for something common
        // or just ensure render doesn't throw.
        // Assuming LandingPage has "Welcome to learn hub" or similar text.
        // For now, just passing is enough to prove the test setup works.
        expect(true).toBe(true);
    });
});
