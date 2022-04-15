import React from 'react'
import axios from 'axios'

// The coordinates of each square of the grid are as follows:
// (1, 1) (2, 1) (3, 1)
// (1, 2) (2, 2) (3, 2)
// (1, 3) (2, 3) (3, 3)

// 2D arrays or matrices are typical structures used to represent grids:
// [[null, null, null], [null, "B", null], [null, null, null]]
// [null, null, null, null, "B", null, null, null, null]


// Using a "getCoordinates" helper function you could build:
// const [x, y] = getCoordinates(grid)
// console.log(`(${x}, ${y})`) // (1, 2)


class Square extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div 
        info={this.props.info} 
        className={`square${this.props.selected ? ' active' : ''}`}
      >
        {this.props.selected}
      </div>
    )
  }
}




export default class AppClass extends React.Component {
  constructor(props){
    super(props)

    this.initState = {
      board:[
        [1,1,''],[2,1,''],[3,1,''],
        [1,2,''],[2,2,'B'],[3,2,''],
        [1,3,''],[2,3,''],[3,3,'']
      ],
      totalMoves:0, 
      currentSquare:[[2,2,'B'],4],
      message:'',
      email:''
    } 
  
    this.state = {
      board:[
        [1,1,''],[2,1,''],[3,1,''],
        [1,2,''],[2,2,'B'],[3,2,''],
        [1,3,''],[2,3,''],[3,3,'']
      ],
      totalMoves:0, 
      currentSquare:[[2,2,'B'],4],
      message:'',
      email:''
    }

  }

   skipSquare = (msg, totalMoves) => {
    const newBoard =  JSON.parse(JSON.stringify(this.state.board));
    const newSquare = JSON.parse(JSON.stringify(this.state.currentSquare));
    this.setState({
      board:newBoard,
      totalMoves:totalMoves, 
      currentSquare:newSquare,
      message:msg
    })
  } 

  /* return the current slice and its idx looking up for the letter B */
  getCurrentSquare = () => {
    let coord=[]
    this.state.board.map((square, idx) => {
       if(square[2] === 'B') {coord = [square, idx]}
    })
    return coord
  }

  getSquareById = (searchSquare) => {
    let coord=[]
    this.state.board.map((square, idx) => {
       if(square[0] === searchSquare[0] && square[1] === searchSquare[1] && square[2] === searchSquare[2] ) {coord = [square, idx]}
    })
    return coord
  }


  setCurrentSquare = (square, msg, totalMoves) => {
      const newBoard =  JSON.parse(JSON.stringify(this.state.board));
      // console.log(newBoard)
      const [ newSquare, newIdx ] = square
      const [ oldSquare, oldIdx ] = this.getCurrentSquare() 
      newSquare[2]='B' // update letter at new square
      newBoard[newIdx] = newSquare
      newBoard[oldIdx][2] = '' // remove letter at old square
      // console.log(newBoard)
      this.setState({
        board:newBoard,
        totalMoves:totalMoves, 
        currentSquare:square,
        message:msg
      })
  }
  
  // )

  squareHandler = (direction) => {
    // console.log('////////////////////////////////////////')
    // console.log('target',direction)
    const [ square, idx ] = this.getCurrentSquare()
    // console.log('square' , square)

    const currentColumn = square[0]
    // console.log('currentColumn' , currentColumn)

    const currentRow = square[1]
    // console.log('currentRow' , currentRow)

    let newSquare = this.getCurrentSquare() // [[column,row, 'letter'],idx]
    let msg = ''
    let isMovable = false
    if(direction === 'left'){
        isMovable = currentColumn-1 > 0
        if(isMovable){
            newSquare = this.getSquareById([currentColumn-1,currentRow, ''])
            // this.setCurrentSquare(newSquare)
          }else{msg = `You can't go left`}
        }

        if(direction === 'right'){
          isMovable = currentColumn+1 <= 3
          if(isMovable){
              newSquare = this.getSquareById([currentColumn+1,currentRow, ''])
            }else{msg = `You can't go right`}
          } 

        if(direction === 'up'){
          isMovable = currentRow-1 > 0  
          if(isMovable){
              newSquare = this.getSquareById([currentColumn,currentRow-1, ''])
            }else{msg = `You can't go up`}
          }     

        if(direction === 'down'){
          isMovable = currentRow+1 <= 3
          if(isMovable){
              newSquare = this.getSquareById([currentColumn,currentRow+1, ''])
            }else{msg = `You can't go down`}
          } 
          
        if(direction === 'reset'){
          isMovable = false
          // msg = ``
          this.setState(this.initState) 
          return        
          // newSquare = this.getSquareById([2,2, ''])
          // this.setCurrentSquare(newSquare)
        }   
        
        if(isMovable) {
          // this.setCurrentSquare(newSquare)
          // this.setState({totalMoves:this.state.totalMoves+1})
          this.setCurrentSquare(newSquare, msg, this.state.totalMoves+1)
        }else{
          this.skipSquare(msg, this.state.totalMoves)
        }
  }

   // class property to submit form
   handleSubmit = e => {
    e.preventDefault();
    // console.log('formSubmit', e)

     //The endpoint expects a payload like { "x": 1, "y": 2, "steps": 3, "email": "lady@gaga.com" } 
     //http://localhost:9000/api/result

    const [square, idx] = this.getCurrentSquare();
    const payload = {
      x:square[0],
      y:square[1], 
      steps:this.state.totalMoves, 
      email:this.state.email
    }
    // curl -d "x=2&y=2&steps=3&email=foo@bar.baz" http://localhost:9000/api/result 
    this.setState({message:''})
    console.log('payload',{ ...payload})
    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {
         console.log('data ok !!!!!', res.data.message)
         this.setState({message:res.data.message, email:''}) 
      }).catch(err => {
        debugger
        console.log('data error !!!!!',err.response.data.message)
        this.setState({message:err.response.data.message, email:''}) 
      })
      .finally(() => {
        console.log(`end post call API`)
      })
  }

  onChange = evt => {
      // console.log('onChange', evt.target.value)
      const name= evt.target.value
      this.setState({email:name})
  }

  render() {
    const { className } = this.props
    const [square, idx] = this.getCurrentSquare();
    const times = this.state.totalMoves > 1 || this.state.totalMoves === 0  ? 'times' : 'time'
    // console.log('square', square)
    // const moveColumn = square[0]
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({`${square[0]}, ${square[1]}`})</h3>
          <h3 id="steps">You moved {`${this.state.totalMoves} ${times}`}</h3>
        </div>
        <div id="grid">


        {this.state.board.map( (square, idx) => (
            <Square key={idx} info={square} selected={square[2]} />
        ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button disabled={this.state.left} onClick={() => this.squareHandler('left')} id="left">LEFT</button>
          <button onClick={() => this.squareHandler('up')}  id="up">UP</button>
          <button onClick={() => this.squareHandler('right')} id="right">RIGHT</button>
          <button onClick={() => this.squareHandler('down')} id="down">DOWN</button>
          <button onClick={() => this.squareHandler('reset')} id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" onChange={this.onChange} value={this.state.email} placeholder="type email"></input>
          <input onClick={this.handleSubmit} id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
