/**
 * Example Panel Component
 * Demonstrates how to create React components for Subway Builder mods.
 *
 * Note: Floating panels provide their own container, so don't wrap in Card.
 */

import { useState, useEffect } from 'react';
import * as p from '../processing/process.jsx';
import type * as c from "../processing/processes.d.ts";
import type * as o from "../processing/register.tsx";
import * as reg from "../processing/register";
import type * as dictType from "./trainDictionary";
import * as dict from "./trainDictionary";
import {getColors} from "./themeHandle";
import type {colorSet} from "./themeHandle";

import trains from "../data/trains.json"
import Electrifications from "../data/standards/electric.json"
import TrackGauges from "../data/standards/track.json"
import LoadingGauges from "../data/standards/loading.json"
import PowerSupplys from "../data/standards/power.json"
import TrainTypes from "../data/standards/trains.json"
import AutomationLevels from "../data/standards/automation.json"
import Regions from "../data/natcont/regions.json"
import Nations from "../data/natcont/nations.json"
import Cities from "../data/natcont/cities.json"
import Authors from "../data/authors.json"

const Trains: c.Train[] = trains as c.Train[];
const es: c.Electrification[] = Electrifications as c.Electrification[];
const tgs: c.TrackGauge[] = TrackGauges as c.TrackGauge[];
const lgs: c.LoadingGauge[] = LoadingGauges as c.LoadingGauge[];
const pss: c.PowerSupply[] = PowerSupplys as c.PowerSupply[];
const tts: c.TrainType[] = TrainTypes as c.TrainType[];
const als: c.AutomationLevel[] = AutomationLevels as c.AutomationLevel[];
const regs: c.Region[] = Regions as c.Region[];
const nats: c.Nation[] = Nations as c.Nation[];
const cits: c.City[] = Cities as c.City[];
const auts: c.Tag[] = Authors as c.Tag[];

const api = window.SubwayBuilderAPI;
const r = api.utils.React;
const h = r.createElement;
const {Switch, Button} = api.utils.components;

// Cast components to any to bypass strict typing (components work at runtime)
function filterItems(la:string[],lb:string[],items:any[]) {
  const indices:number[] = lb.map((item:string, idx:number) => (la.includes(item) ? idx : -1)).filter(idx => idx !== -1);
  var itemsout:any[] = [];
  indices.forEach(ind => {
    itemsout.push(items[ind])
  })
  return itemsout
}

export function getAuthorIdByName(name: string): string | undefined {
    const entry = auts.find(a => a.Name === name);
    return entry?.id;
}

var tosave:  Record<string, o.trainStorageData> = {};

export function getToSaveData() {
  console.log("toSave");
  console.log(tosave);
  return tosave;
}

export function setToSaveData(data:Record<string, o.trainStorageData>) {
  tosave = data;
}

export function addToSaveData(key:string,data:o.trainStorageData) {
  if (!Object.keys(tosave).includes(key)) {
    tosave[key] = data;
  }
}

export function specPicker(n:string,items:any[],value:string|number,f:Function,className?:string) {
    const colors:colorSet = getColors();
    return (
        <select
        name={n}
        className={className || "text-sm white bg-black w-full"}
        onChange={v => f(v.target.value)}
        value={value}
        style={{
            backgroundColor: colors.background
        }}
        >
        <option key={"Select "+n} value={""}>
            {"No Selection"}
        </option>
        {items.map((e) => (
            <option key={String(e.Name)} value={String(e.Name)}>
            {String(e.Name)}
            </option>
        ))}
        </select>
    )
}

export function tagPicker(n:string,items:c.Tag[],value:string|number,f:Function,enabled:boolean,className?:string) {
    const colors:colorSet = getColors();
    return (
        <select
        name={n}
        className={className || "text-sm white bg-black w-full"}
        onChange={v => f(v.target.value)}
        value={value}
        disabled={!enabled}
        style={{
            backgroundColor: colors.background
        }}
        >
        <option key={"Select "+n} value={""}>
            {"No Selection"}
        </option>
        {items.map((e) => (
            <option key={String(e.id)} value={String(e.id)}>
            {String(e.Name)}
            </option>
        ))}
        </select>
    )
}

function getTagNameById(id: string): string | undefined {
    const entry = auts.find(a => a.id === id);
    return entry?.Name;
}



var boolHold:boolean = false;

export function TrainRegisterPanel() {
    const colors:colorSet = getColors();
    const cacheImport:dictType.trainCacheTemplate = dict.getTrainCache();
    const [elect, setElect] = useState(cacheImport.Voltage); const [auto, setAuto] = useState(cacheImport.Automation); const [gauge, setGauge] = useState(cacheImport.TrackGauge);
    const [width, setWidth] = useState(cacheImport.LoadingGauge); const [power, setPower] = useState(cacheImport.Electrification); const [type, setType] = useState(cacheImport.trainType);
    const [min, setMin] = useState(""); const [max, setMax] = useState("");
    const [region, setRegion] = useState(""); const [nation, setNation] = useState(""); const [city, setCity] = useState("");
    const [author, setAuthor] = useState("");

    const [electBool, setElectBool] = useState(false); const [autoBool, setAutoBool] = useState(false); const [gaugeBool, setGaugeBool] = useState(false);
    const [widthBool, setWidthBool] = useState(false); const [powerBool, setPowerBool] = useState(false); const [typeBool, setTypeBool] = useState(false);
    const [minBool, setMinBool] = useState(false); const [maxBool, setMaxBool] = useState(false);
    const [regionBool, setRegionBool] = useState(false); const [nationBool, setNationBool] = useState(false); const [cityBool, setCityBool] = useState(false); const [authorBool, setAuthorBool] = useState(false);

    const [eitems,setEItems] = useState(es);
    const [typeItems,setTypeItems] = useState(tts);
    const [witems,setWItems] = useState(lgs);
    const [pitems,setPItems] = useState(pss);
    const [gitems,setGItems]= useState(tgs);
    const [aitems,setAItems] = useState(als);
    const [minopts,setMinOpts] = useState(lens);
    const [maxopts,setMaxOpts] = useState(lens); 
    const [regItems,setRegItems] = useState(regs);
    const [natItems,setNatItems] = useState(nats);
    const [cityItems,setCityItems] = useState(cits);
    const [authorItems,setAuthorItems] = useState(auts);

    const [prevDisable,setPrevDisable] = useState(true);
    const [regDisable,setRegDisable] = useState(true);
    const [prevText,setPrevText] = useState("Make all selections first.")
    const [regText,setRegText] = useState("Make all selections first.")

    function fixCityList() {
        if (cityBool && nationBool) {
            const hold = cityItems.filter(city => {
                return city.Nation === nation
            })
            setCityItems(hold)
        } else {
            setCityItems(cits)
        }
    }

    function fixRegionList() {
        if (!regionBool) {
          const entry = nats.find(a => a.Name == nation)?.Region;
          if (entry) {
            setRegion(entry)
          }
        }
    }

    function fixNationList() {
        if (nationBool && regionBool) {
            const hold = natItems.filter(nation => {
                return nation.Region === region
            })
            setNatItems(hold)
        } else {
            setNatItems(nats)
        }
    }
    const [train, setTrain] = useState(Trains[0].name);
    const tr = p.getTrain(train) as c.Train;
    var [tlist,setTList]:[c.Train[],Function] = useState(Trains);

    // var all = {
    //     Electrification: power,
    //     Voltage: elect, 
    //     TrackGauge: gauge,
    //     LoadingGauge: width,
    //     trainType: type,
    //     Automation: auto,
    //     minStationList: min,
    //     maxStationList: max
    // }
    type AllEntry = [string, Function, boolean, Function,any[],Function,boolean,any[]];
    const all:Record<string, AllEntry> = {
        "Electrification":[power, setPower,powerBool,setPowerBool,pitems,setPItems,false,pss],
        "Voltage":[elect, setElect,electBool,setElectBool,eitems,setEItems,false,es],
        "TrackGauge":[gauge, setGauge,gaugeBool,setGaugeBool,gitems,setGItems,false,tgs],
        "LoadingGauge":[width, setWidth,widthBool,setWidthBool,witems,setWItems,false,lgs],
        "trainType":[type, setType,typeBool,setTypeBool,typeItems,setTypeItems,true,tts],
        "Automation":[auto, setAuto,autoBool,setAutoBool,aitems,setAItems,false,als],
        "minStationList":[min,setMin,minBool,setMinBool,minopts,setMinOpts,false,lens],
        "maxStationList":[max,setMax,maxBool,setMaxBool,maxopts,setMaxOpts,false,lens],
        "Cont":[region, setRegion,regionBool,setRegionBool,regItems,setRegItems,true,regs],
        "Nation2":[nation, setNation,nationBool,setNationBool,natItems,setNatItems,true,nats],
        "Cities2":[city, setCity,cityBool,setCityBool,cityItems,setCityItems,true,cits],
        "Tags":[author, setAuthor,authorBool,setAuthorBool,authorItems,setAuthorItems,true,auts],
    }

    function printAllKeys(f:boolean,o?:object) {
      if (f) {
        Object.keys(all).forEach(key => {
          console.log("Key "+key+": "+all[key][0])
        })
      } else if (typeof o == "object") {
        Object.keys(o).forEach(key => {
          console.log("Key "+key+": "+o[key as keyof typeof o])
        })
      }
    }

    function toggleBools() {
      Object.keys(all).forEach(key => {
        all[key][3](!boolHold)
      })
      boolHold = !boolHold;
      lengthFix();
    }

    function updateAll() {
      const allKeys = Object.keys(all) as (keyof typeof all)[];
      allKeys.forEach(key => {
        if (!all[key][2]) {
          const trainKey:(keyof c.Train) = key as keyof c.Train;
          const trainValue = tr[trainKey];
          if (key=="Tags" && typeof trainValue == "object") {
            const hold:string[] = trainValue as string[];
            const name:string = getAuthorIdByName(hold[0])||auts[0].id;
            all[key][1](name);
          } else if (typeof trainValue == "object") {
            const hold:any[] = trainValue;
            if (hold.includes("Generic")) {
              const filled = hold.filter(h => h != "Generic");
              if (filled.length != 0) {
                all[key][1](filled[0])
              }
            } else if (key == "maxStationList") {
              all[key][1](trainValue[trainValue.length-1])
            } else {
              all[key][1](trainValue[0]);
            }
          } else {
            all[key][1](trainValue);
          }
        }
      })
    }

    function trainFilterCond(key:keyof c.Train,value:string,t:c.Train,enabled:boolean) {
        if (value=="" || !enabled || String(key) == "maxStationList") {
            return true
        }
        if ((String(key) == "minStationList") && (typeof t[key] === "object")) {
            var holdlist = t[key];
            var hold = false;
            holdlist.forEach(len => {
                if((typeof len) != "number") {
                } else {
                if(len <= Number(value)) {hold = true}
                }
            })
            return hold;
        }
        if (typeof t[key] === "number") {
            return t[key] == Number(value);
        }
        if (typeof t[key] === "string" || typeof t[key] === "boolean") {
            return t[key] == String(value);
        }
        if (typeof t[key] === "object") {
            const hold:any[] = t[key];
            return hold.includes(value);
        }
        return false;
    }

    const strToggles = Object.values(all).map(v => v[2]);
    const strVals = Object.values(all).map(v => v[0]);    // Added

    useEffect(() => {
        printAllKeys(true);
        setTList(Trains);
        lengthFix();
        const hold:[string,AllEntry][] = Object.entries(all);
        var out = Trains.filter(t => {
            return hold.every(([key,value]) => {
                return trainFilterCond(key as keyof c.Train,String(value[0]),t,value[2])
            })
        })
        setTList(out);
        setRegDisable(true);
        setRegText("Update Preview.");
        fixCityList();
        fixNationList();
        fixRegionList();
        lengthFix();
        ableCheck();
        printAllKeys(true);
    },[...strVals,tr,train])

    useEffect(() => {
        printAllKeys(true);
        fixCityList();
        fixNationList();
        fixRegionList();
        lengthFix();
        filterAll();
        updateAll();
        setRegDisable(true);
        setRegText("Update Preview.");
        ableCheck();
        printAllKeys(true);
    },[...strToggles,tr,train])

    function lengthFix() {
        if (min != "" && max != "") {
        const minn = Number(min); const maxn = Number(max);
        if (minn < maxn) {} else if (minn < 0 || maxn < 0) {} 
        else {
            const hold:number = lhold.indexOf(minn);
            setMax(String(lhold[hold+1]))
        }
        }
    }

    function trainSelect(value:string) {
        setTrain(value);
    }

    function trainPicker() {
        return (
        <select
            name="Train Picker"
            className="text-medium w-full"
            style={{
              background: colors.background
            }}
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

  function getLengthsGreaterThan(num:number,equalto:boolean=false) {
    if (equalto) {
      return lens.filter(l => l.value >= num); 
    } else {
      return lens.filter(l => l.value > num);
    }
  }

  function singleFilter(key:keyof typeof all) {
    const name = key as keyof c.Train
    const val:any = tr[name];
    const l = all[key][7];
    var out:any[] = [];
    var outText:string = key + " Fiter: ";
    const currentValue = all[key][0];

    if (all[key][2]) {
      outText += "Did not Filter.";
      resetOneList(key);
      return outText;
    } else if (name == "minStationList") {
      out = (getLengthsGreaterThan(val[0],true));
      outText += "Got lengths >= smallest minStationLength.";
    } else if (name == "maxStationList") {
      if (min != "") {
        out = (getLengthsGreaterThan(Number(min)));
        outText += "Got lengths > min.";
      } else {
        out = (getLengthsGreaterThan(Math.max(...tr["minStationList"])));
        outText += "Got lengths > biggest minStationLength.";
      }
    } else if (name == "Tags" && Array.isArray(val)) {
      out = l.filter(item => val.includes(item.id));
      outText += "Matched train tags to tags.";
    } else if (Array.isArray(val)) {
      out = l.filter(item => val.includes(item.Name));
      outText += "Matched train items to list items.";
    } else {
      out = l.filter(item => item.Name === val);
      outText += "Restricted item list to singular train value."
    }
    var outnamelist = out.map(o => o.Name);
    if (name == "Tags") {
      outnamelist = out.map(o => o.id);
    }
    if (out.length>0) {
      if (!outnamelist.includes(currentValue)) {
        var newval = out[0].Name;
        if (name == "Tags") {
          newval = out[0].id
        }
        all[key][1](newval)
        outText = outText+" Also changed value to comply. New Value: "+newval
      }
    } else {
      outText+=" No Matching values exist."
    }
    all[key][5](out);
    return outText;
  }

  function filterAll() {
    (Object.keys(all) as (keyof typeof all)[]).forEach(key => {
      console.log(singleFilter(key))
    });
  }

  function resetOneList(key:keyof typeof all) {
    all[key][5](all[key][7]);
  }


  function resetAll() {
    setElect("");
    setAuto("");
    setGauge("");
    setWidth("");
    setPower("");
    setType("");
    setTrain(Trains[0].name);
    setTList(Trains);
    setMin("");
    setMax("");
    setRegion("");
    setNation("");
    setCity(""); 
    Object.keys(all).forEach(key => {
      resetOneList(key)
    })
  }

  function resetButton() {
      return(
      <Button
          variant="secondary"
          onClick={() => resetAll()}
          style={{backgroundColor:colors.activeButton}}
      >
          Reset All
      </Button>
      )
  }

  function ableCheck() {
    var hold = false; var text = "Preview";
    Object.entries(all).forEach(entry => {
      if (entry[1][0] == "" && !entry[1][6]) {
        hold = true;
        text = "Make all selections first.";
      }
    })
    setPrevDisable(hold);
    setPrevText(text);
    if (hold) {
      setRegText("Make all selections first.");
    } else if (toRegister !== undefined) {
      setRegText("Click preview first.");
    }
  }

  const [preview,setPreview] = useState(<div></div>)
  const [toRegister,setToRegister] = useState<o.compileTrainOut | undefined>();
  const tempall =
    {
      Electrification: power,
      Voltage: elect, 
      TrackGauge: gauge,
      LoadingGauge: width,
      trainType: type,
      Automation: auto,
      minStationList: min,
      maxStationList: max
    };
  const [desc,setDesc] = useState("");
  function registrationPreview() {
    printAllKeys(true);
    //refreshAll();
    //printAllKeys(true);
    printAllKeys(false,tempall);
    const values:Partial<Record<keyof typeof all,c.TrackGauge|c.LoadingGauge|c.Electrification|c.PowerSupply|c.TrainType|c.AutomationLevel>> = p.getAll(tempall);
    console.log("Original "+min);
    console.log("Original "+max);
    const calcin:o.statsCalcInput = {
      y: values.trainType as c.TrainType,
      a: values.Automation as c.AutomationLevel,
      v: values.Voltage as c.Electrification,
      e: values.Electrification as c.PowerSupply,
      t: values.TrackGauge as c.TrackGauge,
      l: values.LoadingGauge as c.LoadingGauge,
      train: tr,
      min: Number(min),
      max: Number(max)
    }
    const calcout:o.statsCalcOutput = reg.statsCalc(calcin);
    const hold:o.compileTrainOut = reg.compileTrain(tr,calcout,Number(max),String(Date.now()),calcin);
    setPreview(p.statsPreview(tr,hold.storageData,false));
    setDesc(hold.trainConfig.description)
    setToRegister(hold);
    setRegDisable(false);
    setRegText("Register");
  }

  function registrationProccess() {
    if (toRegister !== undefined) {
      reg.registerTrain(toRegister.trainConfig);
      tosave[String(toRegister.storageData.id)] = toRegister.storageData;
      setRegText("Just registered this train");
      setRegDisable(true);
    }
  }

  function fixButton() {
    let bg:string;
    if (prevDisable) {
      bg = colors.disabledButton
    } else {
      bg = colors.activeButton
    }
      return(
        <Button
            variant="secondary"
            onClick={() => toggleBools()}
            style={{
                background: colors.activeButton
            }}
        >
            {"Switch all Switches"}
        </Button>
      )
  }

  function previewButton() {
    let bg:string;
    if (prevDisable) {
      bg = colors.disabledButton
    } else {
      bg = colors.activeButton
    }
    return(
      <Button
        variant="secondary"
        onClick={() => registrationPreview()}
        disabled = {prevDisable}
        style={{
            background: bg
        }}
      >
        {prevText}
      </Button>
    )
  }

  function registerButton() {
    let bg:string;
    if (prevDisable) {
      bg = colors.disabledButton
    } else {
      bg = colors.activeButton
    }
    return(
      <Button
        variant="secondary"
        onClick={() => registrationProccess()}
        disabled = {regDisable}
        style={{
            background: bg
        }}
      >
        {regText}
      </Button>
    )
  }

    function pickerWithMode(
        picker: any,
        state: boolean,
        setState: Function,
        classN: string = "flex items-center flex-1 leading-loose"
    ) {
        return (
        <div className={classN}>
            {picker}
            {h(Switch,{
            defaultValue:false,
            checked:state,
            onChange:() => setState((prevState:boolean) => !prevState),
            style:{
                background: colors.background
            }
            })}
        </div>
        )
    }

    const pickerstyle:string = "flex items-center gap-4";

    return (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between gap-2 w-full">
            {pickerWithMode(tagPicker("Tag",authorItems,author,setAuthor,true),authorBool,setAuthorBool)}
          </div>
          <div className="flex justify-between gap-2 w-full">
            {pickerWithMode(specPicker("Region",regItems,region,setRegion),regionBool,setRegionBool)}
            {pickerWithMode(specPicker("Nation",natItems,nation,setNation),nationBool,setNationBool)}
            {pickerWithMode(specPicker("City",cityItems,city,setCity),cityBool,setCityBool)}
          </div>
          <div className="flex justify-between gap-2 w-full">
              {pickerWithMode(specPicker("Automation Standard",aitems,auto,setAuto),autoBool,setAutoBool)}
              {pickerWithMode(specPicker("Electrification Standard",eitems,elect,setElect),electBool,setElectBool)}
              {pickerWithMode(specPicker("Track Gauge",gitems,gauge,setGauge),gaugeBool,setGaugeBool)}
          </div>
          <div className="flex justify-between gap-2 w-full">
              {pickerWithMode(specPicker("Loading Gauge",witems,width,setWidth),widthBool,setWidthBool)}
              {pickerWithMode(specPicker("Power Supply",pitems,power,setPower),powerBool,setPowerBool)}
              {pickerWithMode(specPicker("Train Type",typeItems,type,setType),typeBool,setTypeBool)}
          </div>
          <div className="flex justify-between gap-2 w-full">
              {pickerWithMode(specPicker("Minimum Station Length",minopts,min,setMin),minBool,setMinBool)}
              {pickerWithMode(specPicker("Maximum Station Length",maxopts,max,setMax),maxBool,setMaxBool)}
          </div>
          <p className="">
              {trainPicker()}
          </p>
          <div className="flex justify-between gap-2">
            <p className="text-sm text-muted-foreground">
                {resetButton()}
            </p>
            <p className="text-sm text-muted-foreground">
                {fixButton()}
            </p>
            <p className="text-sm text-muted-foreground">
                {dict.TrainCacheButton(train,tr,tempall,"[Broken] Save to Cache",true)}
            </p>
            <p className="text-sm text-muted-foreground">
                {dict.ClearTrainCacheButton("Purge Cache")}
            </p>
            <p className="text-sm text-muted-foreground">
              {previewButton()}
            </p>
            <p className="text-sm text-muted-foreground">
              {registerButton()}
            </p>
          </div>
          <p>
              <p.MinimizeButton label="Description">
                {desc}
              </p.MinimizeButton>
          </p>
          <p>
              <p.MinimizeButton label="Train Stats">
                {preview}
              </p.MinimizeButton>
          </p>
        </div>
    );
}

// export function specPicker2(n:string,items:any[],value:string|number,f:Function,className?:string) {
//   return (
//     <select
//       name={n}
//       className={className || "text-sm white bg-black w-full"}
//       onChange={v => handleSelect(v.target.value,f)}
//       value={value}
//       style={{
//         backgroundColor: "#000000"
//       }}
//     >
//       <option key={"Select "+n} value={""}>
//         {"No Selection"}
//       </option>
//       {items.map((e) => (
//         <option key={e.Name} value={e.Name}>
//           {e.Name}
//         </option>
//       ))}
//     </select>
//   )
// }
function numberListToLengthList(l:number[]) {
  let litems:lengthItem[] = [];
  l.forEach(le => {
    const len:lengthItem = {
      Name: String(le),
      value: le
    }
    litems.push(len)
  })
  return litems;
}
const lhold:number[] = Array.from({length:Math.floor((400-40)/20)+1},(_,i) => 40 + i*20).concat(620);
interface lengthItem {
  Name: string
  value: number
}
const lens = numberListToLengthList(lhold);

// export function TrainPanel() {
//   const cacheImport:dictType.trainCacheTemplate = dict.getTrainCache();
//   console.log(cacheImport);
  // const [elect, setElect] = useState(cacheImport.Voltage); const [auto, setAuto] = useState(cacheImport.Automation); const [gauge, setGauge] = useState(cacheImport.TrackGauge);
  // const [width, setWidth] = useState(cacheImport.LoadingGauge); const [power, setPower] = useState(cacheImport.Electrification); const [type, setType] = useState(cacheImport.trainType);
//   const [electBool, setElectBool] = useState(false); const [autoBool, setAutoBool] = useState(false); const [gaugeBool, setGaugeBool] = useState(false);
//   const [widthBool, setWidthBool] = useState(false); const [powerBool, setPowerBool] = useState(false); const [typeBool, setTypeBool] = useState(false);
//   const [minBool, setMinBool] = useState(false); const [maxBool, setMaxBool] = useState(false);
//   const [min, setMin] = useState(cacheImport.minStationList); const [max, setMax] = useState(cacheImport.maxStationList);
//   const [train, setTrain] = useState(cacheImport.Name);
//   const [prevDisable,setPrevDisable] = useState(true);
//   const [regDisable,setRegDisable] = useState(true);
//   const [prevText,setPrevText] = useState("Make all selections first.")
//   const [regText,setRegText] = useState("Make all selections first.")
//   var [eitems,setEItems] = useState(es);
//   var [titems,setTItems] = useState(tts);
//   var [witems,setWItems] = useState(lgs);
//   var [pitems,setPItems] = useState(pss);
//   var [gitems,setGItems]= useState(tgs);
//   var [aitems,setAItems] = useState(als);
//   var [minopts,setMinOpts] = useState(lens);
//   var [maxopts,setMaxOpts] = useState(lens); 
//   //eitems.push(""); titems.push(""); witems.push(""); gitems.push(""); pitems.push(""); aitems.push("");
//   var [tlist,setTList]:[c.Train[],any] = useState(Trains);
//   var all = {
//     Electrification: power,
//     Voltage: elect, 
//     TrackGauge: gauge,
//     LoadingGauge: width,
//     Automation: auto,
//     minStationList: min,
//     maxStationList: max
//   }
//   var all2 = {
//     trainType: type,
//   }
//   const baseOptions = {
//     elect: es,
//     auto: als,
//     gauge: tgs,
//     width: lgs,
//     power: pss,
//     type: tts,
//     min: lens,  
//     max: lens 
//   };
//   const boolToTrainKey = {
//     elect: "Voltage",
//     auto: "Automation",
//     gauge: "TrackGauge",
//     width: "LoadingGauge",
//     power: "Electrification",
//     min: "minStationList",  // new
//     max: "maxStationList"   // new
//   };

//   const drivenBoolToTrainKey = {
//     type: "trainType",
//   };

//   type BoolListPair<T = any> = [boolean, T[],Function];

//   type BoolMap = {
//     elect: BoolListPair;
//     auto: BoolListPair;
//     gauge: BoolListPair;
//     width: BoolListPair;
//     power: BoolListPair;
//     min: BoolListPair;   // new
//     max: BoolListPair;   // new
//   };

//   type DrivenBoolMap = {
//     type: BoolListPair;
//   };

//   var bools:BoolMap = {
//     "elect": [electBool,eitems,setEItems],
//     "auto": [autoBool,aitems,setAItems],
//     "gauge": [gaugeBool,gitems,setGItems],
//     "width": [widthBool,witems,setWItems],
//     "power": [powerBool,pitems,setPItems],
//     "min": [minBool, minopts,setMinOpts],  // min selector
//     "max": [maxBool, maxopts,setMaxOpts]   // max selector
//   }

//   var drivenBools:DrivenBoolMap = {
//     "type": [typeBool,titems,setTItems],
//   }

//   function updateBools() {
//     bools = {
//       "elect": [electBool,eitems,setEItems],
//       "auto": [autoBool,aitems,setAItems],
//       "gauge": [gaugeBool,gitems,setGItems],
//       "width": [widthBool,witems,setWItems],
//       "power": [powerBool,pitems,setPItems],
//       "min": [minBool, minopts,setMinOpts],  // min selector
//       "max": [maxBool, maxopts,setMaxOpts]   // max selector
//     }
//     drivenBools = {
//       "type": [typeBool,titems,setTItems],
//     }
//   }

//   function getLengthsGreaterThan(num:number,equalto:boolean=false) {
//     if (equalto) {
//       return lens.filter(l => l.value >= num); 
//     } else {
//       return lens.filter(l => l.value > num);
//     }
//   }

//   function fixedFilter(l:any[], name:keyof c.Train) {
//     const t:c.Train|undefined = p.getTrain(train);
//     if (!t) {
//       return l;
//     }
//     const val:any = t[name];
//     var hold:any[] = [];
//     if (name == "minStationList") {
//       return getLengthsGreaterThan(val[0],true);
//     }

//     if (name == "maxStationList") {
//       if (min != "") {
//         return getLengthsGreaterThan(Number(min))
//       } else {
//         return getLengthsGreaterThan(Math.max(...t["minStationList"]))
//       }
//     }

//     if (Array.isArray(val)) {
//       return l.filter(item => val.includes(item.Name));
//     }

//     return l.filter(item => item.Name === val);
//   }

//   function filterAll() {
//     (Object.keys(bools) as (keyof typeof bools)[]).forEach(key => {
//       const trainKey = boolToTrainKey[key] as keyof c.Train;
//       let func:Function = bools[key][2];

//       if (bools[key][0]) {
//         func(fixedFilter(baseOptions[key], trainKey));
//       } else {
//         func(baseOptions[key]);
//       }
//     });
//   }
  
//   function trainFilterCond(key:keyof c.Train,value:string,t:c.Train,relative:boolean) {
//     if (value=="" || relative || String(key) == "maxStationList") {
//       return true
//     }
    
//     if ((String(key) == "minStationList") && (typeof t[key] === "object")) {
//       var holdlist = t[key];
//       var hold = false;
//       holdlist.forEach(len => {
//         if((typeof len) != "number") {
//         } else {
//           if(len <= Number(value)) {hold = true}
//         }
//       })
//       return hold;
//     }
//     if (typeof t[key] === "string") {
//       return t[key] == value;
//     }

//     if (typeof t[key] === "object") {
//       const hold:any[] = t[key];
//       return hold.includes(value);
//     }
//     return false;
//   }

//   function ableCheck() {
//     var hold = false; var text = "Preview";
//     Object.entries(all).forEach(entry => {
//       if (typeof entry[1] == "string" && entry[1] == "") {
//         hold = true;
//         text = "Make all selections first.";
//       }
//     })
//     setPrevDisable(hold);
//     setPrevText(text);
//     if (hold) {
//       setRegText("Make all selections first.");
//     } else if(toRegister !== undefined) {
//       setRegText("Click preview first.");
//     }
//   }

//   useEffect(() => {
//     console.log(min);
//     console.log(max);
//     updateBools();
//     const map:any = {
//       Electrification:electBool,
//       Voltage:electBool,
//       TrackGauge:gaugeBool,
//       LoadingGauge:widthBool,
//       trainType:typeBool,
//       Automation:autoBool,
//       minStationList:minBool,
//       maxStationList:maxBool
//     }
//     //console.log("Before: "+String(tlist.length))+String(all["Electrification"]);
//     setTList(Trains);
//     lengthFix();
//     //console.log("Reset: "+String(tlist.length)+String(all["Electrification"]));
//     const hold:[string,string][] = Object.entries(all);
//     const out = Trains.filter(t => {
//       return hold.every(([key,value]) => {
//         return trainFilterCond(key as keyof c.Train,value,t,map[key])
//       })
//     })
//     setTList(out);
//     filterAll();
//     setRegDisable(true);
//     setRegText("Update Preview.");
//     ableCheck();
//     //console.log("After: "+String(tlist.length)+String(all["Electrification"]));
//   },[elect, auto, gauge, width, power, type, min, max, train,electBool, autoBool, gaugeBool, widthBool, powerBool, typeBool,minBool,maxBool])

//   function lengthFix() {
//     if (min != "" && max != "") {
//       const minn = Number(min); const maxn = Number(max);
//       if (minn <= maxn) {} else if (minn < 0 || maxn < 0) {} 
//       else {
//         const hold:number = lhold.indexOf(minn);
//         setMax(String(lhold[hold+1]))
//       }
//     }
//   }

//   function trainSelect(value:string) {
//     setTrain(value);
//   }

//   function trainPicker() {
//     return (
//       <select
//         name="Train Picker"
//         className="text-medium bg-black w-full"
//         onChange={v => trainSelect(v.target.value)}
//         value={train}
//       >
//         {tlist.map((e) => (
//           <option key={e.name} value={e.name}>
//             {e.name}
//           </option>
//         ))}
//       </select>
//     )
//   }
  
//   function resetAll() {
//     setElect("");
//     setAuto("");
//     setGauge("");
//     setWidth("");
//     setPower("");
//     setType("");
//     setTrain(Trains[0].name);
//     setTList(Trains);
//     setMin("");
//     setMax("");
//     setPreview(<div></div>);
//   }

//   function resetButton() {
//     return(
//       <Button
//         variant="secondary"
//         onClick={() => resetAll()}
//       >
//         Reset All
//       </Button>
//     )
//   }

//   const [preview,setPreview] = useState(<div></div>)
//   const [toRegister,setToRegister] = useState<o.compileTrainOut | undefined>();

//   const tempall = {
//       Electrification: power,
//       Voltage: elect, 
//       TrackGauge: gauge,
//       LoadingGauge: width,
//       trainType: type,
//       Automation: auto,
//       minStationList: min,
//       maxStationList: max
//   }

//   function registrationPreview() {
//     const values:Partial<Record<keyof typeof tempall,c.TrackGauge|c.LoadingGauge|c.Electrification|c.PowerSupply|c.TrainType|c.AutomationLevel>> = p.getAll(tempall);
//     const tr = p.getTrain(train) as c.Train;
//     const calcin:o.statsCalcInput = {
//       y: values.trainType as c.TrainType,
//       a: values.Automation as c.AutomationLevel,
//       v: values.Voltage as c.Electrification,
//       e: values.Electrification as c.PowerSupply,
//       t: values.TrackGauge as c.TrackGauge,
//       l: values.LoadingGauge as c.LoadingGauge,
//       train: tr,
//       min: Number(min),
//       max: Number(max)
//     }
//     const calcout:o.statsCalcOutput = reg.statsCalc(calcin);
//     Object.keys(calcout).forEach(key => {
//       console.log(key + calcout[key as keyof typeof calcout])
//     })
//     const hold:o.compileTrainOut = reg.compileTrain(tr,calcout,Number(max),String(Date.now()),calcin);
//     setPreview(p.statsPreview(tr,hold.storageData));
//     setToRegister(hold);
//     setRegDisable(false);
//     setRegText("Register");
//   }

//   function registrationProccess() {
//     if (toRegister !== undefined) {
//       reg.registerTrain(toRegister.trainConfig);
//       tosave[String(toRegister.storageData.id)] = toRegister.storageData;
//     }
//   }

//   function previewButton() {
//     return(
//       <Button
//         variant="secondary"
//         onClick={() => registrationPreview()}
//         disabled = {prevDisable}
//       >
//         {prevText}
//       </Button>
//     )
//   }

//   function registerButton() {
//     return(
//       <Button
//         variant="secondary"
//         onClick={() => registrationProccess()}
//         disabled = {regDisable}
//       >
//         {regText}
//       </Button>
//     )
//   }

//   function toggleBools() {
//     setElectBool(prev => !prev);
//     setAutoBool(prev => !prev);
//     setGaugeBool(prev => !prev);
//     setWidthBool(prev => !prev);
//     setPowerBool(prev => !prev);
//     setTypeBool(prev => !prev);
//     setMinBool(prev => !prev);
//     setMaxBool(prev => !prev);
//   }

//   function fixButton() {
//     return(
//       <Button
//         variant="secondary"
//         onClick={() => toggleBools()}
//       >
//         {"Switch all Switches"}
//       </Button>
//     )
//   }

//   function pickerWithMode(
//     picker: any,
//     state: boolean,
//     setState: Function,
//     classN: string = "flex items-center flex-1 leading-loose"
//   ) {
//     return (
//       <div className={classN}>
//         {picker}
//         {h(Switch,{
//           defaultValue:false,
//           checked:state,
//           onChange:() => setState((prevState:boolean) => !prevState)
//         })}
//       </div>
//     )
//   }

//   const pickerstyle:string = "flex items-center gap-4";
  
//   return (
//     <div className="flex flex-col gap-2">
//       <div className="flex justify-between gap-2 w-full">
//         {pickerWithMode(specPicker2("Automation Standard",aitems,auto,setAuto),autoBool,setAutoBool)}
//         {pickerWithMode(specPicker2("Electrification Standard",eitems,elect,setElect),electBool,setElectBool)}
//         {pickerWithMode(specPicker2("Track Gauge",gitems,gauge,setGauge),gaugeBool,setGaugeBool)}
//       </div>
//       <div className="flex justify-between gap-2 w-full">
//         {pickerWithMode(specPicker2("Loading Gauge",witems,width,setWidth),widthBool,setWidthBool)}
//         {pickerWithMode(specPicker2("Power Supply",pitems,power,setPower),powerBool,setPowerBool)}
//         {pickerWithMode(specPicker2("Train Type",titems,type,setType),typeBool,setTypeBool)}
//       </div>
//       <div className="flex justify-between gap-2 w-full">
//         {pickerWithMode(specPicker2("Minimum Station Length",minopts,min,setMin),minBool,setMinBool)}
//         {pickerWithMode(specPicker2("Maximum Station Length",maxopts,max,setMax),maxBool,setMaxBool)}
//       </div>
//       <p className="">
//         {trainPicker()}
//       </p>
      // <div className="flex justify-between gap-2">
      //   <p className="text-sm text-muted-foreground">
      //   {resetButton()}
      //   </p>
      //   <p className="text-sm text-muted-foreground">
      //     {fixButton()}
      //   </p>
      //   <p className="text-sm text-muted-foreground">
      //     {previewButton()}
      //   </p>
      //   <p className="text-sm text-muted-foreground">
      //     {registerButton()}
      //   </p>
      //  </div>
//       <p>
//         {preview}
//       </p>
//     </div>
//   );
// }