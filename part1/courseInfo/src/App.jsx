const Header=(props)=>{
  console.log(props)
  return(
    <h1>{props.title}</h1>
  )
}



const Parts=(props)=>{
  console.log(props)
  return(
    <p>{props.name} {props.exercise}</p>
  )
}

const Content=(props)=>{
  console.log(props)
  return(
    <div>
      <Parts name={props.parts[0].name} exercise={props.parts[0].exercises} />
      <Parts name={props.parts[1].name} exercise={props.parts[1].exercises} />
      <Parts name={props.parts[2].name} exercise={props.parts[2].exercises} />
    </div>
  )
}
const Total=(props)=>{
  console.log(props)
  let sum=0
  props.parts.forEach(part => {sum+=part.exercises})
  return(
    <p>Number of exercises {sum}</p>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header title={course.name}/>
      <Content parts={course.parts}
      />
      <Total parts={course.parts}/>
    </div>
  )
}


export default App