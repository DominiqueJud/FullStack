import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"




const Form=({formValue,handleOnChangeFormValue})=>{
  return(
    <form>
      {"find countries: "}
      <input id="contryName" type="text" value={formValue} onChange={handleOnChangeFormValue}></input>
    </form>
  )
}

const ShowButton=({country, handleOnButtonClick})=>{
  return(
    <button name={country} onClick={handleOnButtonClick}>show</button>
  )
}


const Nation=({country})=>{
  const languages=Object.values(country.languages)
  console.log(languages)
  return(
  <>
  <h1>{country.name.common}</h1>
  <div>{"capital "+country.capital}<br/>
       {"area "+country.area}<br/>
       <br/>
       <b>{"languages"}</b><br/>
       <br/>
       {languages.map(language=>
        <li>{language}<br/></li>
       )}
       <img src={country.flags.png}/>
        </div>
  </>)
}


const Countries=({data,formValue, handleOnButtonClick})=>{
  const countries= data.map(country=> 
    country.name.common)
    .filter(name=>name.toLowerCase().includes(formValue.toLowerCase()))
  if (countries.length>=11){
  return(
  <div>
    {"Too many Matches, specify your filter"}
  </div>
  )}
  if(countries.length>=2){
    return(
      <div>
      {countries.map(country=>
        <>{country}<ShowButton country={country} handleOnButtonClick={handleOnButtonClick}/> <br/></>
      )}
      </div>
    )
  }
  if (countries.length===1){
    console.log(data)
    const country=data.filter(country=> country.name.common===countries[0])[0]
    console.log(country)
    return(
      <Nation country={country}/>
    )
  }
}

const App = () => {

  const [data,setData]=useState([])
  const [formValue,setFormValue]=useState("")

  useEffect(()=>{
  axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
  .then(response=> {
    console.log(response.data[0]) 
    setData(response.data)})},[])

    const handleOnButtonClick=(event)=>{
      event.preventDefault()
      const name= event.target.name
      console.log(name)
      setFormValue(name)
    }

 const handleOnChangeFormValue=(event)=>{
  const value = event.target.value
  setFormValue(value)
 }
 
  return(
    <div>
    <h1>Look for country</h1>
    <Form formValue={formValue} handleOnChangeFormValue={handleOnChangeFormValue}/>
    <Countries data={data} formValue={formValue} handleOnButtonClick={handleOnButtonClick}/>
    </div>


  ) 


}

export default App

