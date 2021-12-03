import React, { useState, useEffect } from 'react'
import faker from 'faker'
import axios from 'axios'


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let t =[];
let v =[];
let c =[];
let h =[];
let l =[];
let o =[];
let data = {};
let options = {};


const LineChart = () => {

  const [isLoading, setLoading] = useState(true);
  const [minutes, setMinutes] = useState(0);

  const fetchData = () =>{
    t=[];v=[];c=[];h=[];l=[];o=[];
    axios.get("/api/data").
    then((response) => {
      
        response.data.forEach(function(obj) { 
        t.push(obj.t)
        v.push(obj.v)
        c.push(obj.c)
        h.push(obj.h)
        l.push(obj.l)
        o.push(obj.o)
        
        
        });
      
      
    }).then(()=>{
       data = {
        labels:t,
        datasets: [
          {
            label: 'v',
            data: v,
            borderColor: 'rgb(0, 0, 102)',
            backgroundColor: 'rgba(0, 0, 102, 0.5)',
            yAxisID: 'y',
          },
          {
            label: 'c',
            data: c,
            borderColor: 'rgb(102, 0, 102)',
            backgroundColor: 'rgba(102, 0, 102, 0.5)',
            yAxisID: 'y1',
          },
          {
            label: 'h',
            data: h,
            borderColor: 'rgb(255, 51, 0)',
            backgroundColor: 'rgba(255, 51, 0, 0.5)',
            yAxisID: 'y2',
          },
          {
            label: 'l',
            data: l,
            borderColor: 'rgb(255, 153, 0)',
            backgroundColor: 'rgba(255, 153, 0, 0.5)',
            yAxisID: 'y3',
          },
          {
            label: 'o',
            data: o,
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            yAxisID: 'y4',
          }
        ],
      };
      
     options = {
        responsive: true,
        interaction: {
          mode: 'index' ,
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Websocket Graph',
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left' ,
          },
          y1: {
            type: 'linear' ,
            display: true,
            position: 'left' ,
            grid: {
              drawOnChartArea: false,
            },
          },
          y2: {
            type: 'linear' ,
            display: true,
            position: 'left' ,
            grid: {
              drawOnChartArea: false,
            },
          },
          y3: {
            type: 'linear' ,
            display: true,
            position: 'left' ,
            grid: {
              drawOnChartArea: false,
            },
          },
          y4: {
            type: 'linear' ,
            display: true,
            position: 'left' ,
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      };
      setLoading(false);
      
  
    })
  }
  

  useEffect( () => {
    fetchData()
    setInterval(() => {
      setMinutes(minutes => minutes + 1);
      // fetchData()
    }, 1000*60);

  }, [minutes]);
  


  if (isLoading) {
    return <div className="App">Loading...</div>;
  }


    return (
        <div>
            <Line
                options = {options} 
                data = {data} 
                
                
            />
        </div>
    )
}

export default LineChart