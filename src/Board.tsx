import React from 'react'
import './Board.css'

const Board = ({ children }) => (
  <div className='board' style={{'position': 'relative', 'top': -27, 'zIndex': 0 }}>
    {children}
  </div>
)

export default Board