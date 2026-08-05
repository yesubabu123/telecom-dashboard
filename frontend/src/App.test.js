import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('shows an empty state when no SIM data is available', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  expect(await screen.findByText(/no sim records available/i)).toBeInTheDocument();
});
