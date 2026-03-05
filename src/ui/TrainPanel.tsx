/**
 * Example Panel Component
 * Demonstrates how to create React components for Subway Builder mods.
 *
 * Note: Floating panels provide their own container, so don't wrap in Card.
 */

import { useState, useEffect } from 'react';
import * as p from '../processing/process.jsx';
import type * as c from "../processing/processes.d.ts";

import trains from "../data/trains.json"
import Electrifications from "../data/standards/electric.json"
import TrackGauges from "../data/standards/track.json"
import LoadingGauges from "../data/standards/loading.json"
import PowerSupplys from "../data/standards/power.json"
import TrainTypes from "../data/standards/trains.json"
import AutomationLevels from "../data/standards/automation.json"
const Trains: c.Train[] = trains as c.Train[];
const es: c.Electrification[] = Electrifications as c.Electrification[];
const tgs: c.TrackGauge[] = TrackGauges as c.TrackGauge[];
const lgs: c.LoadingGauge[] = LoadingGauges as c.LoadingGauge[];
const pss: c.PowerSupply[] = PowerSupplys as c.PowerSupply[];
const tts: c.TrainType[] = TrainTypes as c.TrainType[];
const als: c.AutomationLevel[] = AutomationLevels as c.AutomationLevel[];

const api = window.SubwayBuilderAPI;
const r = api.utils.React;
const h = r.createElement;

// Cast components to any to bypass strict typing (components work at runtime)
const { Button } = api.utils.components as Record<string, React.ComponentType<any>>;
function filterItems(la:string[],lb:string[],items:any[]) {
  const indices:number[] = lb.map((item:string, idx:number) => (la.includes(item) ? idx : -1)).filter(idx => idx !== -1);
  var itemsout:any[] = [];
  indices.forEach(ind => {
    itemsout.push(items[ind])
  })
  return itemsout
}

export function TrainPanel() {
  console.log(Object.getOwnPropertyNames(api.ui));
  console.log(api.ui.getResolvedTheme());
  const [elect, setElect] = useState("");
  const [auto, setAuto] = useState("");
  const [gauge, setGauge] = useState("");
  const [width, setWidth] = useState("");
  const [power, setPower] = useState("");
  const [type, setType] = useState("");
  const [train, setTrain] = useState("");
  var eitems:any[] = es; var titems:any[] = tgs; var witems:any[] = lgs; var pitems:any[] = pss; var gitems:any[] = tts; var aitems:any[] = als;
  //eitems.push(""); titems.push(""); witems.push(""); gitems.push(""); pitems.push(""); aitems.push("");
  var [tlist,setTList]:[c.Train[],any] = useState(Trains);
  var all = {
    Electrification: power,
    Voltage: elect, 
    TrackGauge: gauge,
    LoadingGauge: width,
    trainType: type,
    Automation: auto
  }
  // aitems = p.getAutomationLevelList();
  
  function trainFilterCond(key:keyof c.Train,value:string,t:c.Train) {
    if (value=="") {
      return true
    } else if (typeof t[key] === "string") {
      return t[key] == value
    } else if (typeof t[key] === "object") {
      const hold:any[] = t[key];
      return hold.includes(value)
    } else {
      return false
    }
  }

  useEffect(() => {
    console.log("Before: "+String(tlist.length))+String(all["Electrification"]);
    setTList(Trains);
    console.log("Reset: "+String(tlist.length)+String(all["Electrification"]));
    const hold:[string,string][] = Object.entries(all);
    const out = Trains.filter(t => {
      return hold.every(([key,value]) => {
        return trainFilterCond(key as keyof c.Train,value,t)
      })
    })
    setTList(out);
    console.log("After: "+String(tlist.length)+String(all["Electrification"]));
  },[elect, auto, gauge, width, power, type])

  function handleSelect(value:string,f:Function) {
    f(value);
  }

  function trainSelect(value:string) {
    setTrain(value);
  }

  function specPicker(n:string,items:any[],value:string,f:Function,className?:string) {
    return (
      <select
        name={n}
        className={className || "text-sm white bg-black"}
        onChange={v => handleSelect(v.target.value,f)}
        value={value}
        style={{
          backgroundColor: "#000000"
        }}
      >
        <option key={"No Selection"} value={""}>
          {"No Selection"}
        </option>
        {items.map((e) => (
          <option key={e.Name} value={e.Name}>
            {e.Name}
          </option>
        ))}
      </select>
    )
  }

  function trainPicker() {
    return (
      <select
        name="Train Picker"
        className="text-sm text-muted-foreground"
        onChange={v => trainSelect(v.target.value)}
        value={train}
      >
        {tlist.map((e) => (
          <option key={e.name} value={e.name}>
            {e.name}
          </option>
        ))}
      </select>
    )
  }
  
  function resetAll() {
    setElect("");
    setAuto("");
    setGauge("");
    setWidth("");
    setPower("");
    setType("");
    setTrain("");
    setTList(Trains);
  }

  function resetButton() {
    return(
      <Button
        variant="secondary"
        onClick={() => resetAll()}
      >
        Reset All
      </Button>
    )
  }
  return (
    <div className="">
      <p className="text-sm text-muted-foreground">
        Dan Trains Picker 
      </p>
      <div className="justify-content space-between">
        {specPicker("AutomationPicker",aitems,auto,setAuto)}
        {specPicker("ElectricPicker",eitems,elect,setElect)}
        {specPicker("GaugePicker",gitems,gauge,setGauge)}
      </div>
      <div className="justify-content space-between">
        {specPicker("WidthPicker",witems,width,setWidth)}
        {specPicker("PowerStandardPicker",pitems,power,setPower)}
        {specPicker("TypePicker",titems,type,setType)}
      </div>
      <p className="text-sm text-muted-foreground">
        {trainPicker()}
      </p>
      <p className="text-sm text-muted-foreground">
        {resetButton()}
      </p>
    </div>
  );
}