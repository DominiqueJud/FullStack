import { useState } from 'react'


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [voted,setVoted]=useState([0,0,0,0,0,0,0,0])
  const [IndexMostVotes,setIndexMostVotes]=useState(0)



  const newSelected=()=>{
    console.log("new Select")
    const randomIndex=Math.floor(Math.random()*anecdotes.length)
    console.log(randomIndex)
    setSelected(randomIndex)
  }
  
  const vote=()=>{
    const helper=[...voted]
    helper[selected]+=1
    setVoted(helper)
    let mostVotes=0
    let indexMV=0
    let indexi=0
    helper.forEach(element => {
      if(element>mostVotes){
        mostVotes=element
        indexMV=indexi
      }
      indexi+=1
    });
    setIndexMostVotes(indexMV)
  }
  const Title=({text})=>(
    <h1>{text}</h1>
  )
 
  return (
    <div>
      <Title text="Anecdote of the Day"/>
      {anecdotes[selected]}<br/>
      {"has "+voted[selected]+" votes"}<br/>
      <button onClick={()=>vote()}>vote</button>
      <button onClick={()=>newSelected()}>Get a new Quote</button>
      <Title text="Anecdote with most votes"/>
      {anecdotes[IndexMostVotes]}

    </div>
  )
}

export default App