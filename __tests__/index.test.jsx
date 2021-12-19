/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import renderer from 'react-test-renderer'
// import Home from '../pages/index'
import Index from '../pages/index'

describe('Home', () => {
  // it('renders a heading', () => {
  //   render(<Home />)

  //   const heading = screen.getByRole('heading', {
  //     name: /welcome to next\.js!/i,
  //   })

  //   expect(heading).toBeInTheDocument()
  // })

  it('renders homepage unchanged', () => {
    const tree = renderer.create(<Index />).toJSON()
    expect(tree).toMatchSnapshot()
  })

})