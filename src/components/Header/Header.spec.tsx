import { render, screen } from '@testing-library/react';

import Header from './index';

describe('Header', () => {
  it('should renders a msg', () => {
    // arrange
    render(<Header />);

    // act
    const title = screen.getByTestId('title');

    // assert
    expect(title).toHaveTextContent(/Hello React!/i);
  });
});
