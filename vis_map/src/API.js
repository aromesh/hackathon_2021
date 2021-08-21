import {useState, useEffect} from "react"
import axios from "axios";
//import fs from 'fs'
import * as fs from 'fs'
import * as data2 from './city.list.json';
import App from './App'

// const fs = require('fs');


const URL = "http://history.openweathermap.org/data/2.5/history/city?q=London,UK&appid=d877be7ce083bf6130b8b21c3dc9590b"
const URL_START = "https://pro.openweathermap.org/data/2.5/weather?q="
const URL_END = ",AU&APPID=d877be7ce083bf6130b8b21c3dc9590b"
//const filePath = './city.list.json'

const API = () => {
    const [data,setData] = useState([]);

    //var data2 = JSON.parse(fs.readFileSync(filePath));
    //const data2 = require(filePath);
    
    let data2_arr = data2.default;
    //console.log(data2_arr);
    let filtered = data2_arr.filter((elem)=>elem.country === "AU").map((elem) => URL_START+elem.name+URL_END).slice(0,20); 
    //console.log(filtered);

    useEffect(() => {
        filtered.map((URL) => axios(URL).then((res)=>setData(oldArray => [...oldArray,{"temp":res.data.main.temp,"lon":res.data.coord.lon,"lat":res.data.coord.lat}])))
    }, []);
    // return <pre>{JSON.stringify(data,undefined,2)}</pre>;
    return <App props={data}/>

}

export default API;