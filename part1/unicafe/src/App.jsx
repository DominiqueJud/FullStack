import { useState } from 'react'

const Stats=({good,neutral,bad,rewiews,average,positiveFraction})=>{
  const Title=(props)=>(
    <h1>{props.text}</h1>
  )
    const StatisticLine=({value,text})=>(
      <>
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr> 
      </>
    )
    if (rewiews==0){
      const noRewiews="No Feedback given"
      return(
        <>
        <Title text="statistics"/>
        {noRewiews}
        </>
      )
    }
  return(
    <>
    <Title text="statistics"/>
    <table>
      <tbody>
    <StatisticLine value={good} text="good"/>
    <StatisticLine value={neutral} text="neutral"/>
    <StatisticLine value={bad} text="bad"/>
    <StatisticLine value={rewiews} text="all"/>
    <StatisticLine value={average} text="average"/>
    <StatisticLine value={positiveFraction+" %"} text="positive"/>
    </tbody>
    </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [rewiews,setRewiews]=useState(0)
  const [totalPoints, setTotalpoints]=useState(0)
  const [average,setAverage]=useState(0)
  const [positiveFraction,setPositiveFraction]=useState(0)

const goodRewiew=()=>{
  setGood(good+1)
  calculateStats(1)
}
  
const neutralRewiew=()=>{
  setNeutral(neutral+1)
  calculateStats(0)
}

const badRewiew=()=>{
  setBad(bad+1)
 calculateStats(-1)
}

const calculateStats=(num)=>{
  setRewiews(rewiews+1)
  setTotalpoints(totalPoints+num)
  setAverage((totalPoints+num)/(rewiews+1))
  let helper=good
  if (num==1)helper+=1
  console.log(helper)
  console.log(rewiews+1)
  setPositiveFraction(helper/(rewiews+1))
}
const Title=(props)=>(
  <h1>{props.text}</h1>
)
  const Button=({handleOnClick,text})=>(
    <button onClick={handleOnClick}>{text}</button>
  )
  const Display=({value,text})=>(
    <>{text} {value}<br/></>
  )
  return (
    <div>
      <Title text="give feedback"/>
      <Button handleOnClick={()=>goodRewiew()} text="good"/>
      <Button handleOnClick={()=>neutralRewiew()} text="neutral"/>
      <Button handleOnClick={()=>badRewiew()} text="bad"/>
      <Stats good={good} neutral={neutral} bad={bad} rewiews={rewiews} average={average} positiveFraction={positiveFraction}/>
    </div>
  )
}

export default App