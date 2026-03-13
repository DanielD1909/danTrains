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
import * as tp from "./TrainPanel"

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


function specPicker(n:string,items:any[],value:string|number,f:Function,enabled:boolean,className?:string) {
    return (
        <select
        name={n}
        className={className || "text-sm white bg-black w-full"}
        onChange={v => f(v.target.value)}
        value={value}
        disabled={!enabled}
        style={{
            backgroundColor: "#000000"
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

function tagPicker(n:string,items:c.Tag[],value:string|number,f:Function,enabled:boolean,className?:string) {
    return (
        <select
        name={n}
        className={className || "text-sm white bg-black w-full"}
        onChange={v => f(v.target.value)}
        value={value}
        disabled={!enabled}
        style={{
            backgroundColor: "#000000"
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

function compare(a:number,b:number,op_code:string) {
    switch (op_code) {
        case("a"):
            return a > b;
        case("b"):
            return a >= b;
        case ("c"):
            return a < b;
        case ("d"):
            return a <= b;
        case ("e"):
            return a == b;
        default:
            return true;
    }
}

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
    Name: String
    value: number
}
const lens = numberListToLengthList(lhold);

export interface trainCacheTemplate {
    Name: string,
    Train: c.Train,
    Electrification: string,
    Voltage: string, 
    TrackGauge: string,
    LoadingGauge: string,
    trainType: string,
    Automation: string,
    minStationList: string,
    maxStationList: string
}

var trainCache:trainCacheTemplate = {
    Name: trains[0].name,
    Train: trains[0],
    Electrification: "",
    Voltage: "",
    TrackGauge: "",
    LoadingGauge: "",
    trainType: "",
    Automation: "",
    minStationList: "",
    maxStationList: ""
}

export function getTrainCache() {
    return trainCache
}

export function setTrainCache(name:string,train:c.Train,all:Omit<trainCacheTemplate, "Train" | "Name">) {
    trainCache = {
        Name: name,
        Train:train,
        ...all
    }
}

export function TrainCacheButton(name:string,train:c.Train,all:Omit<trainCacheTemplate, "Train" | "Name">,label:string) {
    return(
    <Button
        variant="secondary"
        onClick={() => setTrainCache(name,train,all)}
    >
        {label}
    </Button>
    )
}

export function ClearTrainCacheButton(label:string) {
    return(
    <Button
        variant="secondary"
        onClick={() => trainCache= {
                Name: trains[0].name,
                Train: trains[0],
                Electrification: "",
                Voltage: "",
                TrackGauge: "",
                LoadingGauge: "",
                trainType: "",
                Automation: "",
                minStationList: "",
                maxStationList: ""
            }
        }
    >
        {label}
    </Button>
    )
}

export function TrainDictPanel() {
    const [elect, setElect] = useState(""); const [auto, setAuto] = useState(""); const [gauge, setGauge] = useState("");
    const [width, setWidth] = useState(""); const [power, setPower] = useState(""); const [type, setType] = useState("");
    const [min, setMin] = useState(""); const [max, setMax] = useState("");
    const [region, setRegion] = useState(""); const [nation, setNation] = useState(""); const [city, setCity] = useState(""); const [author, setAuthor] = useState("");
    const [maxAcceleration, setMaxAcceleration] = useState(-1); const [maxDeceleration, setMaxDeceleration] = useState(-1); const [maxSpeed, setMaxSpeed] = useState(-1);
    const [maxSpeedLocalStation, setMaxSpeedLocalStation] = useState(-1); const [capacityPerCar, setCapacityPerCar] = useState(-1); const [carLength, setCarLength] = useState(-1);
    const [minCars, setMinCars] = useState(-1); const [maxCars, setMaxCars] = useState(-1); const [carsPerCarSet, setCarsPerCarSet] = useState(-1);
    const [carCost, setCarCost] = useState(-1); const [trainWidth, setTrainWidth] = useState(-1);
    const [baseTrackCost, setBaseTrackCost] = useState(-1); const [baseStationCost, setBaseStationCost] = useState(-1);
    const [trainOperationalCostPerHour, setTrainOperationalCostPerHour] = useState(-1); const [carOperationalCostPerHour, setCarOperationalCostPerHour] = useState(-1);
    const [scissorsCrossoverCost, setScissorsCrossoverCost] = useState(-1); const [trackClearance, setTrackClearance] = useState(-1);
    const [maxLateralAcceleration, setMaxLateralAcceleration] = useState(-1); const [minTurnRadius, setMinTurnRadius] = useState(-1);
    const [minStationTurnRadius, setMinStationTurnRadius] = useState(-1); const [maxSlopePercentage, setMaxSlopePercentage] = useState(-1);
    const [canCrossRoads, setCanCrossRoads] = useState("false"); const [TrainGapFillerLength, setTrainGapFillerLength] = useState(-1);
    const [stopTimeSeconds, setStopTimeSeconds] = useState(-1); const [Old, setOld] = useState("false"); const [desc, setDesc] = useState("");
    const [Generic, setGeneric] = useState("false");

    const [electBool, setElectBool] = useState(false); const [autoBool, setAutoBool] = useState(false); const [gaugeBool, setGaugeBool] = useState(false);
    const [widthBool, setWidthBool] = useState(false); const [powerBool, setPowerBool] = useState(false); const [typeBool, setTypeBool] = useState(false);
    const [minBool, setMinBool] = useState(false); const [maxBool, setMaxBool] = useState(false);
    const [regionBool, setRegionBool] = useState(false); const [nationBool, setNationBool] = useState(false); const [cityBool, setCityBool] = useState(false); const [authorBool, setAuthorBool] = useState(false);
    const [maxAccelerationBool, setMaxAccelerationBool] = useState(false); const [maxDecelerationBool, setMaxDecelerationBool] = useState(false); const [maxSpeedBool, setMaxSpeedBool] = useState(false);
    const [maxSpeedLocalStationBool, setMaxSpeedLocalStationBool] = useState(false); const [capacityPerCarBool, setCapacityPerCarBool] = useState(false); const [carLengthBool, setCarLengthBool] = useState(false);
    const [minCarsBool, setMinCarsBool] = useState(false); const [maxCarsBool, setMaxCarsBool] = useState(false); const [carsPerCarSetBool, setCarsPerCarSetBool] = useState(false);
    const [carCostBool, setCarCostBool] = useState(false); const [trainWidthBool, setTrainWidthBool] = useState(false);
    const [baseTrackCostBool, setBaseTrackCostBool] = useState(false); const [baseStationCostBool, setBaseStationCostBool] = useState(false);
    const [trainOperationalCostPerHourBool, setTrainOperationalCostPerHourBool] = useState(false); const [carOperationalCostPerHourBool, setCarOperationalCostPerHourBool] = useState(false);
    const [scissorsCrossoverCostBool, setScissorsCrossoverCostBool] = useState(false); const [trackClearanceBool, setTrackClearanceBool] = useState(false);
    const [maxLateralAccelerationBool, setMaxLateralAccelerationBool] = useState(false); const [minTurnRadiusBool, setMinTurnRadiusBool] = useState(false);
    const [minStationTurnRadiusBool, setMinStationTurnRadiusBool] = useState(false); const [maxSlopePercentageBool, setMaxSlopePercentageBool] = useState(false);
    const [canCrossRoadsBool, setCanCrossRoadsBool] = useState(false); const [TrainGapFillerLengthBool, setTrainGapFillerLengthBool] = useState(false);
    const [stopTimeSecondsBool, setStopTimeSecondsBool] = useState(false); const [OldBool, setOldBool] = useState(false); const [descBool, setDescBool] = useState(false);
    const [GenericBool, setGenericBool] = useState(false);

    const [maxAccelerationOperator, setMaxAccelerationOperator] = useState(""); const [maxDecelerationOperator, setMaxDecelerationOperator] = useState(""); const [maxSpeedOperator, setMaxSpeedOperator] = useState("");
    const [maxSpeedLocalStationOperator, setMaxSpeedLocalStationOperator] = useState(""); const [capacityPerCarOperator, setCapacityPerCarOperator] = useState(""); const [carLengthOperator, setCarLengthOperator] = useState("");
    const [minCarsOperator, setMinCarsOperator] = useState(""); const [maxCarsOperator, setMaxCarsOperator] = useState(""); const [carsPerCarSetOperator, setCarsPerCarSetOperator] = useState("");
    const [carCostOperator, setCarCostOperator] = useState(""); const [trainWidthOperator, setTrainWidthOperator] = useState("");
    const [baseTrackCostOperator, setBaseTrackCostOperator] = useState(""); const [baseStationCostOperator, setBaseStationCostOperator] = useState("");
    const [trainOperationalCostPerHourOperator, setTrainOperationalCostPerHourOperator] = useState(""); const [carOperationalCostPerHourOperator, setCarOperationalCostPerHourOperator] = useState("");
    const [scissorsCrossoverCostOperator, setScissorsCrossoverCostOperator] = useState(""); const [trackClearanceOperator, setTrackClearanceOperator] = useState("");
    const [maxLateralAccelerationOperator, setMaxLateralAccelerationOperator] = useState(""); const [minTurnRadiusOperator, setMinTurnRadiusOperator] = useState("");
    const [minStationTurnRadiusOperator, setMinStationTurnRadiusOperator] = useState(""); const [maxSlopePercentageOperator, setMaxSlopePercentageOperator] = useState("");
    const [TrainGapFillerLengthOperator, setTrainGapFillerLengthOperator] = useState("");
    const [stopTimeSecondsOperator, setStopTimeSecondsOperator] = useState("");

    const [nationList,setNationList]:[c.Nation[],Function] = useState(nats);
    const [cityList,setCityList]:[c.City[],Function] = useState(cits);

    type AllNumEntry = [number, Function, boolean, Function,string,Function];
    type AllBoolEntry = [string, Function, boolean, Function];
    const allNum:Record<string, AllNumEntry> = {
        "maxAcceleration": [maxAcceleration, setMaxAcceleration, maxAccelerationBool, setMaxAccelerationBool, maxAccelerationOperator, setMaxAccelerationOperator],
        "maxDeceleration": [maxDeceleration, setMaxDeceleration, maxDecelerationBool, setMaxDecelerationBool, maxDecelerationOperator, setMaxDecelerationOperator],
        "maxSpeed": [maxSpeed, setMaxSpeed, maxSpeedBool, setMaxSpeedBool, maxSpeedOperator, setMaxSpeedOperator],
        "maxSpeedLocalStation": [maxSpeedLocalStation, setMaxSpeedLocalStation, maxSpeedLocalStationBool, setMaxSpeedLocalStationBool, maxSpeedLocalStationOperator, setMaxSpeedLocalStationOperator],
        "capacityPerCar": [capacityPerCar, setCapacityPerCar, capacityPerCarBool, setCapacityPerCarBool, capacityPerCarOperator, setCapacityPerCarOperator],
        "carLength": [carLength, setCarLength, carLengthBool, setCarLengthBool, carLengthOperator, setCarLengthOperator],
        "minCars": [minCars, setMinCars, minCarsBool, setMinCarsBool, minCarsOperator, setMinCarsOperator],
        "maxCars": [maxCars, setMaxCars, maxCarsBool, setMaxCarsBool, maxCarsOperator, setMaxCarsOperator],
        "carsPerCarSet": [carsPerCarSet, setCarsPerCarSet, carsPerCarSetBool, setCarsPerCarSetBool, carsPerCarSetOperator, setCarsPerCarSetOperator],
        "carCost": [carCost, setCarCost, carCostBool, setCarCostBool, carCostOperator, setCarCostOperator],
        "trainWidth": [trainWidth, setTrainWidth, trainWidthBool, setTrainWidthBool, trainWidthOperator, setTrainWidthOperator],
        "baseTrackCost": [baseTrackCost, setBaseTrackCost, baseTrackCostBool, setBaseTrackCostBool, baseTrackCostOperator, setBaseTrackCostOperator],
        "baseStationCost": [baseStationCost, setBaseStationCost, baseStationCostBool, setBaseStationCostBool, baseStationCostOperator, setBaseStationCostOperator],
        "trainOperationalCostPerHour": [trainOperationalCostPerHour, setTrainOperationalCostPerHour, trainOperationalCostPerHourBool, setTrainOperationalCostPerHourBool, trainOperationalCostPerHourOperator, setTrainOperationalCostPerHourOperator],
        "carOperationalCostPerHour": [carOperationalCostPerHour, setCarOperationalCostPerHour, carOperationalCostPerHourBool, setCarOperationalCostPerHourBool, carOperationalCostPerHourOperator, setCarOperationalCostPerHourOperator],
        "scissorsCrossoverCost": [scissorsCrossoverCost, setScissorsCrossoverCost, scissorsCrossoverCostBool, setScissorsCrossoverCostBool, scissorsCrossoverCostOperator, setScissorsCrossoverCostOperator],
        "trackClearance": [trackClearance, setTrackClearance, trackClearanceBool, setTrackClearanceBool, trackClearanceOperator, setTrackClearanceOperator],
        "maxLateralAcceleration": [maxLateralAcceleration, setMaxLateralAcceleration, maxLateralAccelerationBool, setMaxLateralAccelerationBool, maxLateralAccelerationOperator, setMaxLateralAccelerationOperator],
        "minTurnRadius": [minTurnRadius, setMinTurnRadius, minTurnRadiusBool, setMinTurnRadiusBool, minTurnRadiusOperator, setMinTurnRadiusOperator],
        "minStationTurnRadius": [minStationTurnRadius, setMinStationTurnRadius, minStationTurnRadiusBool, setMinStationTurnRadiusBool, minStationTurnRadiusOperator, setMinStationTurnRadiusOperator],
        "maxSlopePercentage": [maxSlopePercentage, setMaxSlopePercentage, maxSlopePercentageBool, setMaxSlopePercentageBool, maxSlopePercentageOperator, setMaxSlopePercentageOperator],
        "TrainGapFillerLength": [TrainGapFillerLength, setTrainGapFillerLength, TrainGapFillerLengthBool, setTrainGapFillerLengthBool, TrainGapFillerLengthOperator, setTrainGapFillerLengthOperator],
        "stopTimeSeconds": [stopTimeSeconds, setStopTimeSeconds, stopTimeSecondsBool, setStopTimeSecondsBool, stopTimeSecondsOperator, setStopTimeSecondsOperator],
    };

    const allBool:Record<string, AllBoolEntry> = {
        "canCrossRoads":[canCrossRoads, setCanCrossRoads,canCrossRoadsBool, setCanCrossRoadsBool],
        "Old":[Old, setOld,OldBool,setOldBool],
        "Generic":[Generic, setGeneric,GenericBool,setGenericBool]
    }

    function fixCityList() {
        console.log(city);
        console.log(nation);
        if (cityBool && nationBool) {
            const hold = cityList.filter(city => {
                return city.Nation === nation
            })
            setCityList(hold)
        } else {
            setCityList(cits)
        }
    }

    function fixNationList() {
        console.log(nation);
        console.log(region);
        if (nationBool && regionBool) {
            const hold = nationList.filter(nation => {
                return nation.Region === region
            })
            setNationList(hold)
        } else {
            setNationList(nats)
        }
    }
    const [train, setTrain] = useState(Trains[0].name);
    const tr = p.getTrain(train) as c.Train;
    var [tlist,setTList]:[c.Train[],Function] = useState(Trains);

    function selectOperator(value:string,f:Function, className?:string) {
        return (
            <select
            name={"OperatorSelection"}
            className={className || "text-sm white bg-black w-full"}
            onChange={v => f(v.target.value)}
            value={value}
            style={{
                backgroundColor: "#000000"
            }}
            >
            <option key={"None"} value={""}>
                {""}
            </option>
            <option key={">"} value={"a"}>
                {">"}
            </option>
            <option key={">="} value={"b"}>
                {">="}
            </option>
            <option key={"<"} value={"c"}>
                {"<"}
            </option>
            <option key={"<="} value={"d"}>
                {"<="}
            </option>
            <option key={"="} value={"e"}>
                {"="}
            </option>
            </select>
        )
    }
    function numericFilterCond(value:number,key:string,operator:string,t:c.Train,active:boolean) {
        if (!active) {return true}
        const trainKey:keyof c.Train = key as keyof c.Train;
        const trainValue:number = t[trainKey] as number;
        return compare(trainValue,value,operator);
    }
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
    type AllEntry = [string, Function, boolean, Function];
    const all:Record<string, AllEntry> = {
        "Electrification":[power, setPower,powerBool,setPowerBool],
        "Voltage":[elect, setElect,electBool,setElectBool],
        "TrackGauge":[gauge, setGauge,gaugeBool,setGaugeBool],
        "LoadingGauge":[width, setWidth,widthBool,setWidthBool],
        "trainType":[type, setType,typeBool,setTypeBool],
        "Automation":[auto, setAuto,autoBool,setAutoBool],
        "minStationList":[min,setMin,minBool,setMinBool],
        "maxStationList":[max,setMax,maxBool,setMaxBool],
        "Cont":[region, setRegion,regionBool,setRegionBool],
        "Nation2":[nation, setNation,nationBool,setNationBool],
        "Cities2":[city, setCity,cityBool,setCityBool],
        "author":[author, setAuthor,authorBool,setAuthorBool],
    }

    function updateAll() {
        const allKeys = Object.keys(all) as (keyof typeof all)[];
        allKeys.forEach(key => {
            if (!all[key][2]) {
                const trainKey:(keyof c.Train) = key as keyof c.Train;
                const trainValue = tr[trainKey];
                if (key=="Tags" && typeof trainValue == "object") {
                  const hold:string[] = trainValue as string[];
                  const name:string = tp.getAuthorIdByName(hold[0])||auts[0].id;
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

    function updateAllNums() {
        const allNumKeys = Object.keys(allNum) as (keyof typeof allNum)[];
        allNumKeys.forEach(key => {
            if (!allNum[key][2]) {
                const trainKey:(keyof c.Train) = key as keyof c.Train;
                const trainValue:number = tr[trainKey] as number;
                allNum[key][1](trainValue);
            }
        })
    }
    function updateAllBools() {
        const allBoolkeys = Object.keys(allBool) as (keyof typeof allBool)[];
        allBoolkeys.forEach(key => {
            if (!allBool[key][2]) {
                const trainKey:(keyof c.Train) = key as keyof c.Train;
                const trainValue:string = tr[trainKey] as string;
                allBool[key][1](trainValue == "true");
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

        const numToggles = Object.values(allNum).map(v => v[2]);
        const numVals = Object.values(allNum).map(v => v[0]); // Added
        const numOps = Object.values(allNum).map(v => v[4]);  // Added

        const strToggles = Object.values(all).map(v => v[2]);
        const strVals = Object.values(all).map(v => v[0]);    // Added

        const boolToggles = Object.values(allBool).map(v => v[2]);
        const boolVals = Object.values(allBool).map(v => v[0]); // Added

    useEffect(() => {
        setTList(Trains);
        lengthFix();
        const hold:[string,AllEntry][] = Object.entries(all);
        var out = Trains.filter(t => {
            return hold.every(([key,value]) => {
                return trainFilterCond(key as keyof c.Train,String(value[0]),t,value[2])
            })
        })
        const holdNum:[string,AllNumEntry][] = Object.entries(allNum);
        out = out.filter(t => {
            return holdNum.every(([key,value]) => {
                return numericFilterCond(value[0],key as keyof c.Train,value[4],t,value[2])
            })
        })
        const holdBool:[string,AllBoolEntry][] = Object.entries(allBool);
        out = out.filter(t => {
            return holdBool.every(([key,value]) => {
                return trainFilterCond(key as keyof c.Train,String(value[0]),t,value[2])
            })
        })
        setTList(out);
        fixCityList();
        fixNationList();
        try {registrationPreview()}
        catch {}
    },[...numVals,...numOps,...strVals,...boolVals,tr,train])

    useEffect(() => {
        fixCityList();
        lengthFix();
        fixNationList();
        updateAll();
        updateAllNums();
        updateAllBools();
    },[...strToggles,...numToggles,...boolToggles,tr,train])

    function lengthFix() {
        if (min != "" && max != "") {
        const minn = Number(min); const maxn = Number(max);
        if (minn <= maxn) {} else if (minn < 0 || maxn < 0) {} 
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
            className="text-medium bg-black w-full"
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
        setElect(Trains[0].Voltage[0]);
        setAuto(Trains[0].Automation[0]);
        setGauge(Trains[0].TrackGauge[0]);
        setWidth(Trains[0].LoadingGauge[0]);
        setPower(Trains[0].Electrification[0]);
        setType(Trains[0].trainType);
        setTrain(Trains[0].name);
        setTList(Trains);
        setMin(String(Trains[0].minStationList[0]));
        setMax(String(Trains[0].maxStationList[Trains[0].maxStationList.length-1]));
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

    const [preview,setPreview] = useState(<div></div>)

    const tempall = {
        Electrification: power,
        Voltage: elect, 
        TrackGauge: gauge,
        LoadingGauge: width,
        trainType: type,
        Automation: auto,
        minStationList: min,
        maxStationList: max
    }

    function registrationPreview() {
        const values:Partial<Record<keyof typeof all,c.TrackGauge|c.LoadingGauge|c.Electrification|c.PowerSupply|c.TrainType|c.AutomationLevel>> = p.getAll(tempall);
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
        Object.keys(calcout).forEach(key => {
        console.log(key + calcout[key as keyof typeof calcout])
        })
        const hold:o.compileTrainOut = reg.compileTrain(tr,calcout,Number(max),String(Date.now()),calcin);
        setPreview(p.statsPreview(tr,hold.storageData,true));
    }

    function toggleBools() {
        const allKeys = Object.keys(all);
        const allNumKeys = Object.keys(allNum);
        const allBoolKeys = Object.keys(allBool);
        allKeys.forEach(key => {
            all[key][3](!all[key][2]);
        })
        allNumKeys.forEach(key => {
            allNum[key][3](!allNum[key][2]);
        })
        allBoolKeys.forEach(key => {
            allBool[key][3](!allBool[key][2]);
        })
    }

    function fixButton() {
        return(
        <Button
            variant="secondary"
            onClick={() => toggleBools()}
        >
            {"Switch all Switches"}
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
            onChange:() => setState((prevState:boolean) => !prevState)
            })}
        </div>
        )
    }

    function inputWithModeAndOperator(
        key:keyof typeof allNum,
        state: boolean,
        setState: Function,
        classN: string = "flex flex-col items-center flex-1 gap-1 text-xs text-center"
    ) {
        let bg;
        if (allNum[key][2]) {
            bg = "#272727";
        } else {
            bg = "#161616";
        }
        return (
        <div>
            <div className={"text-xs flex-wrap"}>
                <label>{String(key)}</label>
            </div>
            <div className={classN}>
                {selectOperator(allNum[key][4],allNum[key][5],classN)}
                <input
                style={{
                    backgroundColor: bg
                }}
                type="number"
                id={String(allNum[key][0])}
                readOnly={!allNum[key][2]}
                name={String(allNum[key][0])}
                min="1"
                max="500"
                step="0.01"
                value={allNum[key][0]}
                onChange={e => allNum[key][1](e.target.value)}
                />
                {h(Switch,{
                defaultValue:false,
                checked:state,
                onChange:() => setState((prevState:boolean) => !prevState)
                })}
            </div>
        </div>
        )
    }

    

    const pickerstyle:string = "flex items-center gap-4";

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2 w-full">
                {pickerWithMode(tagPicker("Tag",auts,author,setAuthor,authorBool),authorBool,setAuthorBool)}
            </div>
            <div className="flex justify-between gap-2 w-full">
                {pickerWithMode(specPicker("Region",regs,region,setRegion,regionBool),regionBool,setRegionBool)}
                {pickerWithMode(specPicker("Nation",nationList,nation,setNation,nationBool),nationBool,setNationBool)}
                {pickerWithMode(specPicker("City",cityList,city,setCity,cityBool),cityBool,setCityBool)}
            </div>
            <div className="flex justify-between gap-2 w-full">
                {pickerWithMode(specPicker("Automation Standard",als,auto,setAuto,autoBool),autoBool,setAutoBool)}
                {pickerWithMode(specPicker("Electrification Standard",es,elect,setElect,electBool),electBool,setElectBool)}
                {pickerWithMode(specPicker("Track Gauge",tgs,gauge,setGauge,electBool),gaugeBool,setGaugeBool)}
            </div>
            <div className="flex justify-between gap-2 w-full">
                {pickerWithMode(specPicker("Loading Gauge",lgs,width,setWidth,widthBool),widthBool,setWidthBool)}
                {pickerWithMode(specPicker("Power Supply",pss,power,setPower,powerBool),powerBool,setPowerBool)}
                {pickerWithMode(specPicker("Train Type",tts,type,setType,typeBool),typeBool,setTypeBool)}
            </div>
            <div className="flex justify-between gap-2 w-full">
                {pickerWithMode(specPicker("Minimum Station Length",lens,min,setMin,minBool),minBool,setMinBool)}
                {pickerWithMode(specPicker("Maximum Station Length",lens,max,setMax,maxBool),maxBool,setMaxBool)}
            </div>
            <div className="flex flex-wrap justify-between gap-2 w-full">
                {
                    (Object.keys(allNum) as (keyof typeof allNum)[]).map((key) => 
                        inputWithModeAndOperator(
                            key,
                            allNum[key][2],
                            allNum[key][3]
                        )
                    )
                }
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
                    {TrainCacheButton(train,tr,tempall,"Save and send to Registration Menu")}
                </p>
                <p className="text-sm text-muted-foreground">
                    {ClearTrainCacheButton("Purge Cache")}
                </p>
            </div>
            <p>
                {preview}
            </p>
        </div>
    );
}