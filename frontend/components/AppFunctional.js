import React,  {useState}  from 'react'

const Square = (props) =>{
  
    return(
      <div 
        info={props.info} 
        className={`square${props.selected ? ' active' : ''}`}
      >
        {props.selected}
      </div>
    )

}



export default function AppFunctional(props) {

  const initState = {
    board:[
      [1,1,''],[2,1,''],[3,1,''],
      [1,2,''],[2,2,'B'],[3,2,''],
      [1,3,''],[2,3,''],[3,3,'']
    ],
    totalMoves:0, 
    currentSquare:[[2,2,'B'],4], 
    message:''
  } 

  const [state, setState] = useState({
      board:[
        [1,1,''],[2,1,''],[3,1,''],
        [1,2,''],[2,2,'B'],[3,2,''],
        [1,3,''],[2,3,''],[3,3,'']
      ],
      totalMoves:0, 
      currentSquare:[[2,2,'B'],4], 
      message:''
    } 
  )

  /* return the current slice and its idx looking up for the letter B */
  const getCurrentSquare = () => {
    // console.log('getCurrentSquare', state.board)
    let coord=[]
    state.board.map((square, idx) => {
      // console.log('getCurrentSquare', square)
      if(square[2] === 'B') {coord = [square, idx]}
    })
    return coord
  }

  const getSquareById = (searchSquare) => {
    let coord=[]
    state.board.map((square, idx) => {
      if(square[0] === searchSquare[0] && square[1] === searchSquare[1] && square[2] === searchSquare[2] ) {coord = [square, idx]}
    })
    return coord
  }


  const setCurrentSquare = (square, msg, totalMoves) => {
      const newBoard =  JSON.parse(JSON.stringify(state.board));
      // console.log(newBoard)
      const [ newSquare, newIdx ] = square
      const [ oldSquare, oldIdx ] = getCurrentSquare() 
      newSquare[2]='B' // update letter at new square
      newBoard[newIdx] = newSquare
      newBoard[oldIdx][2] = '' // remove letter at old square
      // console.log(newBoard)
      setState({
        board:newBoard,
        totalMoves:totalMoves, 
        currentSquare:square,
        message:msg
      })
  }

  const skipSquare = (msg, totalMoves) => {
    const newBoard =  JSON.parse(JSON.stringify(state.board));
    const newSquare = JSON.parse(JSON.stringify(state.currentSquare));
    setState({
      board:newBoard,
      totalMoves:totalMoves, 
      currentSquare:newSquare,
      message:msg
    })
  }  

  const squareHandler = (direction) => {
    // console.log('////////////////////////////////////////')
    // console.log('target',direction)
    const [ square, idx ] = getCurrentSquare()
    // console.log('square' , square)

    const currentColumn = square[0]
    // console.log('currentColumn' , currentColumn)

    const currentRow = square[1]
    // console.log('currentRow' , currentRow)

    let newSquare = getCurrentSquare() // [[column,row, 'letter'],idx]
    let msg = ''
    let isMovable = false
    if(direction === 'left'){
        isMovable = currentColumn-1 > 0
        // console.log('isMovable', isMovable)
        if(isMovable){
            newSquare = getSquareById([currentColumn-1,currentRow, ''])
            // console.log('newSquare', newSquare)
            // setCurrentSquare(newSquare)
          }else{msg = `You can't go left`}
        }

        if(direction === 'right'){
          isMovable = currentColumn+1 <= 3
          if(isMovable){
              newSquare = getSquareById([currentColumn+1,currentRow, ''])
            }else{msg = `You can't go right`}
          } 

        if(direction === 'up'){
          isMovable = currentRow-1 > 0  
          if(isMovable){
              newSquare = getSquareById([currentColumn,currentRow-1, ''])
            }else{msg = `You can't go up`}
          }     

        if(direction === 'down'){
          isMovable = currentRow+1 <= 3
          if(isMovable){
              newSquare = getSquareById([currentColumn,currentRow+1, ''])
            }else{msg = `You can't go down`}
          } 
          
        if(direction === 'reset'){
          isMovable = false
          setState(initState)
          return
        }   
        
        if(isMovable) {
          setCurrentSquare(newSquare, msg, state.totalMoves+1)
        }else{
          skipSquare(msg, state.totalMoves)
        }
  }

  const [square, idx] = getCurrentSquare();
  // ${square[0]}, ${square[1]}
  return (

    

    <div id="wrapper" className={props.className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({`${square[0]}, ${square[1]}`})</h3>
          <h3 id="steps">You moved {state.totalMoves} times</h3>
        </div>
        <div id="grid">


        {state.board.map( (square, idx) => (
            <Square key={idx} info={square} selected={square[2]} />
        ))}
        </div>
        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={() => squareHandler('left')} id="left">LEFT</button>
          <button onClick={() => squareHandler('up')}  id="up">UP</button>
          <button onClick={() => squareHandler('right')} id="right">RIGHT</button>
          <button onClick={() => squareHandler('down')} id="down">DOWN</button>
          <button onClick={() => squareHandler('reset')} id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
    </div>
  )
}
