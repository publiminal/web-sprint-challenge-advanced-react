import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from '../components/AppFunctional'

// Write your tests here
test('sanity', () => {
  //expect(true).toBe(false)
  render(<AppFunctional />)
})
