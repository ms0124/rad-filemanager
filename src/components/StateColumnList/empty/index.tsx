import './style.scss'
import { RightClick } from '../../../utils'

import React, { FunctionComponent } from 'react'

const Empty: FunctionComponent = () => {
  return (
    <React.Fragment>
      <RightClick query='.empty' />
      <div className='empty'>این پوشه خالیست!</div>
    </React.Fragment>
  )
}

export default Empty
