import { useState } from 'react'


const Names=({persons})=>(
  <>
  {persons.map(person=>
    <p key={person.name}>{person.name}: {person.number}</p>
  )}
  </>
)

const Filter=({filter,handleOnFilterChange})=>(
  <div>Filter shown with <input id="filter" value={filter} onChange={handleOnFilterChange}/>
  </div>
)


const PersonForm=({handleOnSubmit, name, handleOnChangeName, number, handleOnNumberChange})=>(
  <>
  <form onSubmit={handleOnSubmit}>
      <div>
        name: <input id="name" value={name} onChange={handleOnChangeName}/>
      </div>
      <div>
        number: <input id="number" value={number} onChange={handleOnNumberChange}/>
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  </>
)



const App = () => {


  const [persons, setPersons] = useState([
    { name: 'Dominique Jud', number:"0786930657", id:1}]) 

  const [newName, setNewName] = useState('')

  const [newNumber,setNewNumber]=useState('')

  const [filter,setFilter]=useState("")

  const [filteredPersons,setFilteredPersons]=useState(persons)

  const handleOnSubmit=(event)=>{
    event.preventDefault()
    console.log("submit")
    const names=persons.map(person=>person.name)
    console.log(names)
    if (names.includes(newName)){
      alert(`${newName} is already on the Phonebook`)
      }
    else{
      const newPersons=persons.concat({name:newName, number: newNumber, id:persons.length+1})
      setPersons(newPersons)
      setNewName("")
      setNewNumber("")
      const results=newPersons.filter(person=>person.name.toLowerCase().includes(filter.toLowerCase()))
      setFilteredPersons(results)
    }
      }

  const handleOnNameChange=(event)=>{
    setNewName(event.target.value)
  }

  const handleOnNumberChange=(event)=>{
    setNewNumber(event.target.value)
  }

  const handleOnFilterChange=(event)=>{
    setFilter(event.target.value)
    console.log(event.target.value)
    const results=persons.filter(person=>person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    console.log(persons[0].name,persons[0].name.includes(event.target.value))
    console.log(results)
    setFilteredPersons(results)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter  filter={filter} handleOnFilterChange={handleOnFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm  handleOnSubmit={handleOnSubmit} name={newName} handleOnChangeName={handleOnNameChange}
       number={newNumber} handleOnNumberChange={handleOnNumberChange}/>
      <h2>Numbers</h2>
      <Names persons={filteredPersons}/>
    </div>
  )
}

export default App