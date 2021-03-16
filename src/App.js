import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];

function LinearGradient(props){

  const [pvPercentInterval, setPvInterval] = useState();
  const [uvPercentInterval, setUvInterval] = useState();

  const findIntrval = function(arr){
    let data=arr.slice(0);
    let uvTmp=0;
    let pvTmp=0;
    let count=0;
    data.forEach(e => {
        uvTmp += e.uv;
        pvTmp += e.pv;
        ++count;
    });

    const uvAvg=uvTmp/count;
    const pvAvg=pvTmp/count;

    uvTmp=0;
    pvTmp=0;
    data.forEach(e => {
        uvTmp+=((e.uv-uvAvg)**2);
        pvTmp+=((e.pv-pvAvg)**2);
    })

    const uvStddev=Math.sqrt(uvTmp/count);
    const pvStddev=Math.sqrt(pvTmp/count);
    
    const uvInterval = [uvAvg-uvStddev, uvAvg+uvStddev];
    const pvInterval = [pvAvg-pvStddev, pvAvg+pvStddev];
    
    function pvIntervalToGradient(){
      data.sort((a,b)=>{
        return a.pv-b.pv;
      })
      let per=data[data.length-1].pv - data[0].pv;
      setPvInterval([`${100-(100*(pvInterval[0]-data[0].pv))/per}%`, `${(100*(data[data.length-1].pv-pvInterval[1]))/per}%`]);
    }
    function uvIntervalToGradient(){
      data.sort((a,b)=>{
        return a.uv-b.uv;
      })
      let per=data[data.length-1].uv - data[0].uv;
      setUvInterval([`${100-(100*(pvInterval[0]-data[0].uv))/per}%`, `${(100*(data[data.length-1].uv-uvInterval[1]))/per}%`]);
    }
    pvIntervalToGradient();
    uvIntervalToGradient();
  }
  useEffect(() => {
    findIntrval(props.data)
  }, [props.data])
  
  if(!pvPercentInterval){
    return(
      <div></div>
    )
  }else{
    return(
      <svg xmlns="http://www.w3.org/2000/svg"  width="300" height="100" viewBox="0 0 300 100">
      <defs>
          <linearGradient id="pv_gradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="red" offset={pvPercentInterval[1]} />
            <stop stopColor="#8884d8" offset={pvPercentInterval[1]} />
            <stop stopColor="#8884d8" offset={pvPercentInterval[0]} />
            <stop stopColor="red" offset={pvPercentInterval[0]} />
          </linearGradient>
          <linearGradient id="uv_gradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="red" offset={uvPercentInterval[1]} />
            <stop stopColor="#82ca9d" offset={uvPercentInterval[1]} />
            <stop stopColor="#82ca9d" offset={uvPercentInterval[0]} />
            <stop stopColor="red" offset={uvPercentInterval[0]} />
          </linearGradient>
      </defs>
      </svg>
    )
  }
}

export default function App() {

    useEffect(()=>{
      let lines = document.querySelectorAll(".recharts-line path");
      lines[0].setAttribute("stroke", "url(#pv_gradient)");
      lines[1].setAttribute("stroke", "url(#uv_gradient)");
    },[]);
 
    return(
    <div>
      <LinearGradient 
      data={data}/>
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      > 
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
    )
}


