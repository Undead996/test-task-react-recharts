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

function GradientOutput(props){
  return(
    <linearGradient id={`${props.dataKey}_gradient`} x1="0" y1="0" x2="0" y2="1">
    <stop stopColor="red" offset={props.percentInterval[props.dataKey][1]} />
    <stop stopColor={props.color} offset={props.percentInterval[props.dataKey][1]} />
    <stop stopColor={props.color} offset={props.percentInterval[props.dataKey][0]} />
    <stop stopColor="red" offset={props.percentInterval[props.dataKey][0]} />
  </linearGradient>
  )
}

function RedLinearGradient(props){

  const [percentInterval, setPercentInterval] = useState();

  useEffect(() => {
    const findIntrval = function(){
      let data=props.data.slice(0);
      let intervals={};
      props.dataKeys.forEach(key => {
        let tmp=0;
        data.forEach(e => {
          tmp += e[key[0]];
        })
        const avg=tmp/data.length;
        tmp=0;
        data.forEach(e => {
          tmp+=((e[key[0]]-avg)**2);
        });
        const stddev=Math.sqrt(tmp/data.length);
        const interval = [avg-stddev, avg+stddev];
        console.log(interval)
        data.sort((a,b)=>{
          return a[key[0]]-b[key[0]];
        })
        let per=data[data.length-1][key[0]] - data[0][key[0]];
        intervals[key[0]]=[`${100-(100*(interval[0]-data[0][key[0]]))/per}%`, `${(100*(data[data.length-1][key[0]]-interval[1]))/per}%`]; 
      })
      setPercentInterval(intervals);
    }();

    let lines = document.querySelectorAll(".recharts-line path");
    for(let i=0;i<props.dataKeys.length;i++){
      lines[i].setAttribute("stroke", `url(#${props.dataKeys[i][0]}_gradient)`);
    }
  }, [props.data, props.dataKeys]);
  
  const gradients=props.dataKeys.map(e => (
    <GradientOutput 
    percentInterval={percentInterval}
    dataKey={e[0]}
    color={e[1]}
    key={e[0]}/>
  ));

  if(!percentInterval){
    return(
      <div></div>
    )
  }else{
    return(
      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 300 100">
      <defs>
        {gradients}
      </defs>
      </svg>
    )
  }
}

export default function App() {
    return(
    <div>
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
      <RedLinearGradient 
      data={data}
      dataKeys={[["pv", "#8884d8"], ["uv", "#82ca9d"]]}/>
    </div>
    )
}



