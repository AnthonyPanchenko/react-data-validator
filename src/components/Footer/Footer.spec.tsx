import { render, screen } from '@testing-library/react';

import Footer from './index';

describe('Footer', () => {
  it('should renders a msg', () => {
    // arrange
    render(<Footer msg="Hello React!" />);

    // act
    const title = screen.getByTestId('title');

    // assert
    expect(title).toHaveTextContent(/Hello React!/i);
  });
});
