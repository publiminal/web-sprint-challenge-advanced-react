import React,  {useState}  from 'react'
import axios from 'axios'

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
    message:'',
    email:''
  } 

  const [state, setState] = useState({
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
        message:msg,
        email:''
      })
  }

  const skipSquare = ({msg, totalMoves, email}) => {
    const newBoard =  JSON.parse(JSON.stringify(state.board));
    const newSquare = JSON.parse(JSON.stringify(state.currentSquare));
    setState({
      board:newBoard,
      totalMoves:totalMoves || state.totalMoves, 
      currentSquare:newSquare,
      message:msg || state.msg,
      email:email || ''
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
          // skipSquare(msg, state.totalMoves)
          skipSquare({msg:msg, totalMoves:state.totalMoves, email:state.email})

        }
  }


  // class property to submit form
  const handleSubmit = e => {
    e.preventDefault();
    // console.log('formSubmit', e)

     //The endpoint expects a payload like { "x": 1, "y": 2, "steps": 3, "email": "lady@gaga.com" } 
     //http://localhost:9000/api/result

    const [square, idx] = getCurrentSquare();
    const payload = {
      x:square[0],
      y:square[1], 
      steps:state.totalMoves, 
      email:state.email
    }
    // curl -d "x=2&y=2&steps=3&email=foo@bar.baz" http://localhost:9000/api/result 
    // setState({message:''})
    skipSquare({msg:'', totalMoves:state.totalMoves, email:state.email})
    // console.log('payload',{ ...payload})
    axios.post('http://localhost:9000/api/result', payload)
      .then(res => {
         console.log('data ok !!!!!', res.data.message)
        //  setState({message:res.data.message, email:''}) 
        skipSquare({msg:res.data.message, totalMoves:state.totalMoves, email:''})

      }).catch(err => {
        // debugger
        console.log('data error !!!!!',err.response.data.message)
        // setState({message:err.response.data.message, email:''}) 
        skipSquare({msg:err.response.data.message, totalMoves:state.totalMoves, email:''})
        
      })
      .finally(() => {
        console.log(`end post call API`)
      })
  }

  const onChange = evt => {
      // console.log('onChange', evt.target.value)
      const name= evt.target.value
      // setState({email:name})
      skipSquare({msg:null, totalMoves:null, email:name})
  }

  const [square, idx] = getCurrentSquare();
  const times = state.totalMoves > 1 || state.totalMoves === 0  ? 'times' : 'time'

  // ${square[0]}, ${square[1]}
  return (

    

    <div id="wrapper" className={props.className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({`${square[0]}, ${square[1]}`})</h3>
          <h3 id="steps">You moved {`${state.totalMoves} ${times}`}</h3>

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
          <input id="email" onChange={onChange} value={state.email} type="email" placeholder="type email"></input>
          <input onClick={handleSubmit} id="submit" type="submit"></input>
        </form>
    </div>
  )
}
