import { useState, useEffect } from 'react'
import axios from "axios";
import Communicate from "../src/Service"

const DelButton = ({ person, handleOnDelClick }) => (
  <button id={person.id} name={person.name} onClick={handleOnDelClick}>delete</button>
)

const Names = ({ persons, handleOnDelClick }) => (
  <>
    {persons.map(person =>
      <p key={person.name}>{person.name}: {person.number} <DelButton person={person} handleOnDelClick={handleOnDelClick} /></p>
    )}
  </>
)

const Filter = ({ filter, handleOnFilterChange }) => (
  <div>Filter shown with <input id="filter" value={filter} onChange={handleOnFilterChange} />
  </div>
)


const PersonForm = ({ handleOnSubmit, name, handleOnChangeName, number, handleOnNumberChange }) => (
  <>
    <form onSubmit={handleOnSubmit}>
      <div>
        name: <input id="name" value={name} onChange={handleOnChangeName} />
      </div>
      <div>
        number: <input id="number" value={number} onChange={handleOnNumberChange} />
      </div>
      <div>
        <button type="submit" >add</button>
      </div>
    </form>
  </>
)

const Notification = ({ message }) => {
  
  if (message === null) {
    return null
  }
  const text=message[0]
  const colorspez=message[1]
  const notificationStyle={
    color:colorspez,
    fontStyle:'italic',
    fontSize: 20,
    background:"lightgrey",
    borderStyle:"solid",
    padding:10
  }
  return (
    <div style={notificationStyle}>
      {text}
    </div>
  )
}


const App = () => {


  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')

  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState("")

  const [filteredPersons, setFilteredPersons] = useState(persons)

  const [actions, setActions] = useState(0)

  const [message, setMessage]= useState(null)

  useEffect(() => {
    Communicate.getAllData()
      .then((response) => {
        setPersons(response)
        if (filter === "") {
          setFilteredPersons(response)
        }
        else {
          setFilteredPersons(response.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())))
        }
        console.log(response, "got Data from the server")
      })
  }, [actions])

  const handleOnSubmit = (event) => {
    event.preventDefault()
    console.log("submit")
    const names = persons.map(person => person.name)
    console.log(names)
    if (names.includes(newName)) {
      if (window.confirm(`${newName} is already on the PhoneBook, do you want to replace his number with the new onde?`)) {
        const person = persons.filter(person => person.name === newName)[0]
        console.log(person)
        Communicate.update(person.id, { ...person, number: newNumber })
          .then(response => {
            console.log(response)
            setActions(actions + 1)
            setMessage([`${person.name} number updated`,"green"])
            setTimeout(()=>setMessage(null),5000)
          })
          .catch(error=>{
            console.log(error.response.data.error)
            setMessage([error.response.data.error,"red"])
            setTimeout(()=>setMessage(null),5000)
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber }
      setNewName("")
      setNewNumber("")
      Communicate.create(newPerson)
        .then(response => {
          console.log(response, "new Entry created")
          setActions(actions + 1)
          setMessage([`${newPerson.name} addet to the Phonebook`,"red"])
          setTimeout(()=>setMessage(null),5000)
        })
        .catch(error=>{console.log(error.response.data.error)
          setMessage([`${error.response.data.error}`,"red"])
          setTimeout(()=>setMessage(null),5000)
        })
    }
  }
  const handleOnDelClick = (event) => {
    console.log("delete object with Id: ", event.target.id)
    const name=event.target.name
    if (window.confirm(`Do you really want to delete ${event.target.name}?`)) {
      Communicate.remove(event.target.id)
        .then(response => {
          console.log(response, "Promise done")
          setActions(actions + 1)
          setMessage([`${name} sucsesfully removed from the phonebook`,"green"])
          setTimeout(()=>setMessage(null),5000)
        })
        .catch(response =>{
          setActions(actions+1)
          setMessage([`${name} was already removed from the server`,"red"])
          setTimeout(()=>setMessage(null),5000)
        })
    }
  }
  const handleOnNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleOnNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleOnFilterChange = (event) => {
    setFilter(event.target.value)
    console.log(event.target.value)
    const results = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    console.log(persons[0].name, persons[0].name.includes(event.target.value))
    console.log(results)
    setFilteredPersons(results)
  }

  return (
    <div>
      <Notification message={message}/>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleOnFilterChange={handleOnFilterChange} />
      <h2>Add a new</h2>
      <PersonForm handleOnSubmit={handleOnSubmit} name={newName} handleOnChangeName={handleOnNameChange}
        number={newNumber} handleOnNumberChange={handleOnNumberChange} />
      <h2>Numbers</h2>
      <Names persons={filteredPersons} handleOnDelClick={handleOnDelClick} />
    </div>
  )
}

export default App