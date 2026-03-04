/**
 * Example Panel Component
 * Demonstrates how to create React components for Subway Builder mods.
 *
 * Note: Floating panels provide their own container, so don't wrap in Card.
 */

import { useState } from 'react';
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
  const [elect, setElect] = useState("");
  const [auto, setAuto] = useState("");
  const [gauge, setGauge] = useState("");
  const [width, setWidth] = useState("");
  const [power, setPower] = useState("");
  const [type, setType] = useState("");
  const [train, setTrain] = useState("");
  var eitems:any[] = es; var titems:any[] = tgs; var witems:any[] = lgs; var gitems:any[] = pss; var pitems:any[] = tts; var aitems:any[] = als;
  var tlist:c.Train[] = Trains;
  var all = {
    Electrification: elect,
    Voltage: power, 
    TrackGauge: gauge,
    LoadingGauge: width,
    trainType: type,
    Automation: auto
  }
  // aitems = p.getAutomationLevelList();
  
  function trainFilterCond(key:keyof c.Train,value:string,t:c.Train) {
    if (value==="") {
      return true
    } else if (typeof t[key] === "string" || typeof t[key] === "object") {
      return true
    } else {
      return false
    }
  }

  function trainFilter() {
    const hold:[string,string][] = Object.entries(all);
    hold.forEach(s => {
      tlist = tlist.filter(t => {
        trainFilterCond(s[0] as keyof c.Train,s[1],t);
      })
    })
  }

  function handleSelect(value:string,f:Function) {
    f(value);
    trainFilter();
  }

  function trainSelect(value:string) {
    setTrain(value);
  }
  
  function resetAll() {
    setElect("");
    setAuto("");
    setGauge("");
    setWidth("");
    setPower("");
    setType("");
  }
  return (
    <div className="">
      <p className="text-sm text-muted-foreground">
        Dan Trains Picker 
      </p>
      <select
        name="AutomationPicker"
        className="text-sm text-muted-foreground"
        onChange={v => handleSelect(v.target.value,setAuto)}
      >
        {aitems.map((a) => (
          <option key={a.Name} value={a.Name}>
            {a.Name}
          </option>
        ))}
      </select>
      <select
        name="ElectrificationPicker"
        className="text-sm text-muted-foreground"
        onChange={v => handleSelect(v.target.value,setAuto)}
      >
        {eitems.map((e) => (
          <option key={e.Name} value={e.Name}>
            {e.Name}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">
        <select
          name="TrainPicker"
          className="text-sm text-muted-foreground"
          onChange={v => trainSelect(v.target.value)}
        >
          {tlist.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
      </p>
      <p className="text-sm text-muted-foreground">
      <Button
        variant="secondary"
        onClick={() => resetAll()}
      >
        Reset All
      </Button>
      </p>
    </div>
  );
}