import axios from "axios";

const baseUrl=`http://localhost:3001/persons`

const getAllData=()=>{
    return axios.get(baseUrl)
    .then(response => response.data)
}

const create= entry =>{
    return axios.post(baseUrl,entry)
    .then(response=>response.data)
}

const remove= id=>{
       return axios.delete(baseUrl+`/${id}`)
       .then(response => response.data)
}

const update=(id,entry)=>{
    return axios.put(baseUrl+`/${id}`,entry)
    .then(response => response.data)
}
export default{
    getAllData, create, remove, update}