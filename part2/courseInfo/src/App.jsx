import Courses from "./Course"
/*const Header=({text})=>(
<h2>{text}</h2>
)

const Courses=({courses})=>(
  courses.map(course=><Course key={course.id} course={course}/>)
)

const Course=({course})=>(
  <>
  <Header text={course.name}/>
  {course.parts.map(element=>
  <Part key={element.id} name={element.name} exercises={element.exercises}/>
  )}
    <Total parts={course.parts}/>
  </>
)

const Total=({parts})=>{
  const total=parts.reduce(
    (sum,part)=>{
      console.log(sum,part)
    return (sum+part.exercises)},
    0)
  return(<p><b>Total of {total} exercises</b></p>)
}

const Part=({name,exercises})=>(
  <p>
  {name}<br/>
  {exercises}
  </p>
)*/
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  //return <Course course={course} />
  return(
    <div>
    <h1>Web developement Courses</h1>
    <Courses courses={courses}/>
    </div>


  ) 
}

export default App

