const Header=({text})=>(
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
      )
export default Courses