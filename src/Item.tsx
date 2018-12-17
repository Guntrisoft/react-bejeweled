import React from 'react'
import './Item.css'
import { IItem } from './App'

interface IItemProps {
  item: IItem
  handleClick(): void
}

const Item: React.FunctionComponent<IItemProps> = ({
  item: { name, selected },
  handleClick
}) => (
  <button
    type='button'
    className='item'
    disabled={selected}
    onClick={handleClick}
  >
    {name}
  </button>
)

export default Item
