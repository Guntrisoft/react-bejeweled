import React, { Component } from 'react'
import Board from './Board'
import Cell from './Cell'
import Item from './Item'

const items = ['💎', '🔶', '🎅🏻', '🎄', '💜', '⚪️', '🔺']

export interface IItem {
  name: string
  position: number
  itemsAbove: number[]
  selected: boolean
}

interface IAppState {
  board: IItem[]
  itemSelected: number | null
}

class App extends Component<{}, IAppState> {
  constructor(props) {
    super(props)

    this.state = {
      board: [...Array(64)].map((_, index) => ({
        name: this.getRandomItem(),
        position: index,
        itemsAbove: this.getItemsAbove(index),
        selected: false
      })),
      itemSelected: null
    }

    this.handleClick = this.handleClick.bind(this)
  }

  getItemsAbove(index: number): number[] {
    let i = index - 8
    const itemsAbove: number[] = []

    while (i >= 0) {
      itemsAbove.push(i)
      i = i - 8
    }

    return itemsAbove
  }

  adjustBoard() {
    let board: IItem[] = [...this.state.board]

    for (let i = 63; i >= 0; i--) {
      if (board[i].name === '') {
        console.log('empty item at', i)

        if (board[i].itemsAbove.length > 0) {
          console.log('has items above')
          const aboveItem = board[i].itemsAbove.pop()
          board[i] = {
            ...this.state.board[aboveItem]
          }
          board[aboveItem] = {
            ...board[aboveItem],
            name: ''
          }
        } else {
          console.log('no item above, creating a new one')
          board[i] = {
            name: this.getRandomItem(),
            position: i,
            itemsAbove: this.getItemsAbove(i),
            selected: false
          }
        }
      } else {
        board[i] = { ...this.state.board[i] }
      }
    }

    this.setState({
      board
    }, () => {
      this.checkForLines()
    })
  }

  removeItemsAtCells(cells) {
    this.setState(
      prevState => {
        return {
          board: prevState.board.map((item, index) => {
            if (cells.includes(index)) {
              return {
                ...item,
                name: ''
              }
            } else {
              return item
            }
          })
        }
      },
      () => {
        setTimeout(() => {
          this.adjustBoard()
        }, 2000)
      }
    )
  }

  checkForLines() {
    const { board } = this.state

    let currentRow = 1
    let cellOnRow = 1

    for (let i = 0; i < 64; i++) {
      // column 4
      if (
        board[i + 8] &&
        board[i + 16] &&
        board[i + 24] &&
        board[i].name === board[i + 8].name &&
        board[i].name === board[i + 16].name &&
        board[i].name === board[i + 24].name
      ) {
        console.log(
          'column 4 match',
          board[i].name,
          board[i + 8].name,
          board[i + 16].name,
          board[i + 24].name
        )
        this.removeItemsAtCells([i, i + 8, i + 16, i + 24])
        break
      }

      // column 3
      if (
        board[i + 8] &&
        board[i + 16] &&
        board[i].name === board[i + 8].name &&
        board[i].name === board[i + 16].name
      ) {
        console.log(
          'column 3 match',
          board[i].name,
          board[i + 8].name,
          board[i + 16].name
        )
        this.removeItemsAtCells([i, i + 8, i + 16])
        break
      }

      // row 4
      if (
        cellOnRow <= 5 &&
        board[i].name === board[i + 1].name &&
        board[i].name === board[i + 2].name &&
        board[i].name === board[i + 3].name
      ) {
        console.log(
          'row 4 match',
          board[i].name,
          board[i + 1].name,
          board[i + 2].name,
          board[i + 3].name
        )
        this.removeItemsAtCells([i, i + 1, i + 2, i + 3])
        break
      }

      // row 3
      if (
        cellOnRow <= 6 &&
        board[i].name === board[i + 1].name &&
        board[i].name === board[i + 2].name
      ) {
        console.log(
          'row 3 match',
          new Date(),
          board[i].name,
          board[i + 1].name,
          board[i + 2].name
        )
        this.removeItemsAtCells([i, i + 1, i + 2])
        break
      }

      cellOnRow++

      if (cellOnRow > 8) {
        cellOnRow = 1
        currentRow++
      }
    }
  }

  handleClick(index) {
    return () => {
      this.setState(
        prevProps => {
          let board = [...prevProps.board]
          let itemSelected = prevProps.itemSelected !== null ? null : index

          // second item selected
          if (prevProps.itemSelected !== null) {
            const selectedItem = board[prevProps.itemSelected]

            if (selectedItem.name !== board[index].name) {
              board[prevProps.itemSelected] = board[index]
              board[index] = selectedItem
              board = board.map(item => ({ ...item, selected: false }))
            } else {
              itemSelected = prevProps.itemSelected
            }
          } else {
            board[index].selected = true // first item
          }

          return {
            board,
            itemSelected
          }
        },
        () => {
          this.checkForLines()
        }
      )
    }
  }

  getRandomItem() {
    return items[Math.floor(Math.random() * Math.floor(items.length))]
  }

  componentDidMount() {
    this.checkForLines()
  }

  render() {
    const { board } = this.state

    return (
      <main>
        <img src="logo.png" style={{zIndex: 1, position: 'relative'}} />
        <Board>
          {board.map((item, index) => (
            <Cell key={index}>
              <Item item={item} handleClick={this.handleClick(index)} />
            </Cell>
          ))}
        </Board>
      </main>
    )
  }
}

export default App
