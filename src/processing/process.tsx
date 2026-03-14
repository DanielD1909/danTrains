import trains from "../data/trains.json"
import es from "../data/standards/electric.json"
import tgs from "../data/standards/track.json"
import lgs from "../data/standards/loading.json"
import pss from "../data/standards/power.json"
import tts from "../data/standards/trains.json"
import als from "../data/standards/automation.json"
import type { Train, Electrification, TrackGauge, LoadingGauge, PowerSupply, TrainType, AutomationLevel } from "../processing/processes.d.ts"
import type { TrainTypeConfig } from "../types"
import * as reg from "./register"
import type * as regType from "./register"
import {getToSaveData} from "../ui/TrainPanel"
import React, { useState } from "react";
const Trains: Train[] = trains as Train[];
const train_names:string[] = trains.map(t => t.name);
const Electrifications: Electrification[] = es as Electrification[];
const TrackGauges: TrackGauge[] = tgs as TrackGauge[];
const LoadingGauges: LoadingGauge[] = lgs as LoadingGauge[];
const PowerSupplys: PowerSupply[] = pss as PowerSupply[];
const TrainTypes: TrainType[] = tts as TrainType[];
const AutomationLevels: AutomationLevel[] = als as AutomationLevel[];
const api = window.SubwayBuilderAPI;
const key = "danTrains."

export async function exportSaveData(saveid?:string) {
    const tosave:Record<string, regType.trainStorageData> = getToSaveData();
    const existing:Record<string, regType.trainStorageData>|undefined = getAllSaved();
    console.log(Object.keys(tosave).length);
    if (existing == undefined) {
        localStorage.setItem(key+"dt_allsaved",JSON.stringify(tosave));
    } else {
        const merged: Record<string, regType.trainStorageData> = {
            ...existing,
            ...tosave,
        };
        localStorage.setItem(key+"dt_allsaved", JSON.stringify(merged));
    }
    if (!saveid) {} else {
        setAllSaveNames(saveid)
        const raw = localStorage.getItem(key+"saves."+saveid);
        if (!raw) {
            localStorage.setItem(key+"saves."+saveid,JSON.stringify(tosave));
        } else {
                const existingSaveSpecific:Record<string, regType.trainStorageData> = JSON.parse(raw);
                if (existingSaveSpecific == undefined) {
                localStorage.setItem(key+"saves."+saveid,JSON.stringify(tosave));
            } else {
                const merged: Record<string, regType.trainStorageData> = {
                    ...existingSaveSpecific,
                    ...tosave,
                };
                localStorage.setItem(key+"saves."+saveid,JSON.stringify(merged));
            }
        }
    }
}

export function getAllSaveNames() {
    const raw = localStorage.getItem(key+"allsaves");
    if (!raw) {return []}
    const allSaveNamesList:string[] = JSON.parse(raw);
    return allSaveNamesList;
}

export function deleteSaveData(name:string) {
    localStorage.removeItem(key+"saves."+name);
    const currentList = getAllSaveNames();
    if (!currentList) {throw "could not get save names"}
    else {
        const currentSet:Set<string> = new Set(currentList);
        currentSet.delete(name);
        const newList = Array.from(currentSet);
        localStorage.setItem(key+"allsaves",JSON.stringify(newList))
    }
}

export function setAllSaveNames(saveName:string) {
    const currentList = getAllSaveNames();
    if (!currentList) {throw "could not get save names"}
    else {
        const currentSet:Set<string> = new Set(currentList);
        currentSet.add(saveName);
        const newList = Array.from(currentSet);
        localStorage.setItem(key+"allsaves",JSON.stringify(newList))
    }
}

export function getSaveData(saveid:string) {
    const raw = localStorage.getItem(key+"saves."+saveid);
    if (!raw) {
        console.log("save data not found");
        throw "save data not found"
    }
    console.log(raw);
    const saveSpecificData:Record<string, regType.trainStorageData> = JSON.parse(raw);
    console.log(saveSpecificData);
    return saveSpecificData
}

export function getAllSaved() {
    const raw = localStorage.getItem(key+"dt_allsaved");
    if (!raw) return undefined
    const existing:Record<string, regType.trainStorageData> = JSON.parse(raw);
    return existing
}

export function legacyFilter(inp:string,hold:string[]) {
    if (inp.includes("dt.")) {
        return false;
    } else if (hold.includes(inp)) {
        return false;
    } else {
        return (train_names.includes(inp))
    }
}

export function danTrainsFilter(inp:string,hold:string[]) {
    if (inp.includes("dt.") && !(hold.includes(inp))) {
        return true;
    } else { return false;}
}

export function getLegacyList(gotten:Record<string, TrainTypeConfig>,saveData:Record<string, TrainTypeConfig>) {
    var savedTrains = Object.keys(saveData).map(key => saveData[key].id)
    var hold:TrainTypeConfig[] = [];
    Object.keys(gotten).forEach(key => {
        if (legacyFilter(key,savedTrains)) {hold.push(gotten[key])}
    })
    return hold;
}

export function getDanTrainsList(gotten:Record<string, TrainTypeConfig>,saveData:Record<string, TrainTypeConfig>) {
    var savedTrains = Object.keys(saveData).map(key => saveData[key].id)
    var hold:TrainTypeConfig[] = [];
    Object.keys(gotten).forEach(key => {
        if (danTrainsFilter(key,savedTrains)) {hold.push(gotten[key])}
    })
    return hold;
}

export function getTrainFromID(id:string,allSaved:Record<string, regType.trainStorageData>) {
    var hold:regType.trainStorageData | undefined;
    Object.keys(allSaved).forEach((key:keyof typeof allSaved) => {
        if (allSaved[key].config.id == id) {
            hold = allSaved[key];
        }
    })
    if (hold !== undefined) {
        return hold
    } else {
        throw ("Nothing found fuck shit")
    }
}


export function getTrainList() {
    Trains.forEach(t => {
        var lengthList:number[] = []; var consistList:number[] = []; var minStationList:number[] = [];
        for (let step = t.minCars; step < t.maxCars; step += t.carsPerCarSet) {
            lengthList.push(Math.round(step * t.carLength));
            consistList.push(step);
            minStationList.push(Math.round((step * t.carLength + 3) / 50) * 50);
        }
        t.lengthList = lengthList;
        t.consistList = consistList;
        t.minStationList = minStationList;
        t.maxStationList = minStationList;
    })
    return Trains
}

export function getTrain(name:string) {
    const hold = Trains.find(t => t.name === name);
    if (typeof hold == "object") {
        return Trains.find(t => t.name === name)
    } else {
        throw "Something went horribly wrong";
    }
}

const aliasTable = {
    Voltage: Electrifications,
    TrackGauge: TrackGauges,
    LoadingGauge: LoadingGauges,
    Electrification: PowerSupplys,
    trainType: TrainTypes,
    Automation: AutomationLevels
}

export function getOne(name:string,t:keyof typeof aliasTable) {
    const hold = aliasTable[t];
    const o = hold.find(h => h.Name === name);
    if (o == undefined) {throw "fuck"}
    else {return o}
}

export interface getAllInput {
    Type: keyof typeof aliasTable
    Name: string
}

interface all {
    Electrification: string,
    Voltage: string, 
    TrackGauge: string,
    LoadingGauge: string,
    trainType: string,
    Automation: string,
    minStationList: string,
    maxStationList: string
}

function allToInput(all:all) {
    var keys = Object.keys(all);
    keys = keys.filter(k => (k != "minStationList" &&  k != "maxStationList"))
    var outputList:getAllInput[] = [];
    keys.forEach(key => {
        const temp = {
            Type: key as keyof typeof aliasTable,
            Name: all[key as keyof typeof all]
        }
        outputList.push(temp);
    })
    return outputList;
}

export function getAll(all:all) {
    const inp = allToInput(all)
    var hold:Partial<Record<keyof typeof aliasTable,TrackGauge|LoadingGauge|Electrification|PowerSupply|TrainType|AutomationLevel>> = {};
    inp.forEach((key) => {
        const newkey:(keyof typeof aliasTable) = key.Type
        hold[newkey] = getOne(key.Name,newkey);
    })
    return hold;
}
export function compatibleConsists(min:number,t:Train,newV:boolean,max:number) {
    var output:number[] = [];
    if (newV) {
        t.consistList.forEach((n:number,i:number) => {
            const hold:any[] = t.minStationList;
            if (hold[i]<=max) {
                output.push(n);
            }
        })
    } else {
        t.consistList.forEach((n:number,i:number) => {
            const hold:any[] = t.minStationList;
            if (hold[i]<=min) {
                output.push(n);
            }
        })
    }
    return output
}

function latExplain(data:reg.trainStorageData,type:string) {
    if (!data || !data.calcin) {
        return (<div></div>)
    } else if (type.includes("Rubber")) {
        return (
            <table className="w-full table-fixed text-center border-collapse text-xs">
                <tr>
                    <th>Base Max Lateral Acceleration (m/s<sup>2</sup>)</th>
                    <th>Limit Multiplier</th>
                    <th>Max Lateral (m/s<sup>2</sup>))</th>
                </tr>
                <tr>
                    <td>{Math.sqrt((((data.calcin.y.maxCantDeficiency+data.calcin.y.maxCant)/(11.82*data.calcin.t.Actual/1.435))/3.6)^2).toFixed(2)}</td>
                    <td>{"x"+data.calcin.t.Cant_Multiplier}</td>
                    <td>{data.config.stats.maxLateralAcceleration})</td>
                </tr>
                
            </table>
        )
    } else {
        return (
            <table className="w-full table-fixed text-center border-collapse text-xs">
                <tr>
                    <th>Max Cant (mm)</th>
                    <th>Max Cant Deficiency (mm)</th>
                    <th>Limit Multiplier</th>
                    <th>Coefficient (mm*m*(km/h)<sup>-2</sup>)</th>
                    <th>Equivalent Max Lateral (m/s<sup>2</sup>))</th>
                </tr>
                <tr>
                    <td>{data.calcin.y.maxCantDeficiency}</td>
                    <td>{data.calcin.y.maxCant}</td>
                    <td>{"x"+data.calcin.t.Cant_Multiplier}</td>
                    <td>{Math.sqrt((data.calcin.y.maxCantDeficiency+data.calcin.y.maxCant)*data.calcin.t.Cant_Multiplier/(11.82*data.calcin.t.Actual/1.435)).toFixed(2)}</td>
                    <td>{data.config.stats.maxLateralAcceleration}</td>
                </tr>
                
            </table>
        )
    }
}

export function MinimizeButton({ label = "Toggle", className = "flex flex-col gap-2 border p-1", children }: { label?: string; className?:string;children: React.ReactNode }) {
    const [minimized, setMinimized] = useState(false);

    return (
        <div className={className}>
            <button
                onClick={() => setMinimized(!minimized)}
                className="px-1 py-1 hover:bg-gray-300 rounded text-sm font-bold"
                style= {{
                    backgroundColor:"#000000"
                }}
            >
                {minimized ? `+ ${label}` : `- ${label}`}
            </button>

            {!minimized && <div className="mt-2">{children}</div>}
        </div>
    );
}

export function statsPreview(train:Train,data?:reg.trainStorageData,dict:boolean=false) {
    if (!data || !data.calcin) {
        return (<div></div>)
    }
    let maxstr:string;
    if (dict) {
        maxstr = train.consistList.join(" | ")
    } else {
        maxstr = data.config.stats.maxCars+"/"+train.maxCars
    }
    const temp1 = data.calcin.a.car_CostPerHour; const temp2 = data.calcin.a.train_CostPerHour;
    var hold = {
        accph: "",
        atcph: ""
    }
    if (temp1>0) {
        hold["accph"] = ("+"+String(temp1))
    } else {
        hold["accph"] = String(temp1)
    }
    if (temp2>0) {
        hold["atcph"] = ("+"+String(temp2))
    } else {
        hold["atcph"] = String(temp2)
    }
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-1 text-sm font-bold">
                    Base Game Stats
                </div>
                <table className="w-full table-fixed text-center border-collapse text-xs">
                    <tr>
                        <th>Max Speed (m/s)</th>
                        <th>Max Acceleration (m/s<sup>2</sup>)</th>
                        <th>Max Deceleration (m/s<sup>2</sup>)</th>
                        <th>Max Station Speed (m/s)</th>
                        <th>Stop Time (s)</th>
                    </tr>
                    <tr>
                        <td>{data.config.stats.maxSpeed}</td>
                        <td>{data.config.stats.maxAcceleration}</td>
                        <td>{data.config.stats.maxDeceleration}</td>
                        <td>{data.config.stats.maxSpeedLocalStation}</td>
                        <td>{data.config.stats.stopTimeSeconds}</td>
                    </tr>
                    <tr>
                        <th>Per Car Capacity (pax)</th>
                        <th>Car Length (m)</th>
                        <th>Minimum Consist (#)</th>
                        <th>Maximum Consist (#)</th>
                        <th>Cars Per Set (#)</th>
                    </tr>
                    <tr>
                        <td>{data.config.stats.capacityPerCar}</td>
                        <td>{data.config.stats.carLength}</td>
                        <td>{data.config.stats.minCars}</td>
                        <td>{maxstr}</td>
                        <td>{data.config.stats.carsPerCarSet}</td>
                    </tr>
                    <tr>
                        <th>Minimum Station Length (m)</th>
                        <th>Maximum Station Length (m)</th>
                        <th>Parallel Track Spacing (m)</th>
                        <th>Train Width (m)</th>
                        <th>Crossover Capital Cost (USD)</th>
                    </tr>
                    <tr>
                        <td>{data.config.stats.minStationLength}</td>
                        <td>{data.config.stats.maxStationLength}</td>
                        <td>{data.config.stats.parallelTrackSpacing}</td>
                        <td>{data.config.stats.trainWidth}</td>
                        <td>{data.config.stats.scissorsCrossoverCost}</td>
                    </tr>
                    <tr>
                        <th>Car Capital Cost (USD)</th>
                        <th>Track Capital Cost (USD)</th>
                        <th>Station Capital Cost (USD)</th>
                        <th>Per Train Operating Cost (USD)</th>
                        <th>Per Car Operating Cost (USD)</th>
                    </tr>
                    <tr>
                        <td>{data.config.stats.carCost}</td>
                        <td>{data.config.stats.baseTrackCost}</td>
                        <td>{data.config.stats.baseStationCost}</td>
                        <td>{data.config.stats.trainOperationalCostPerHour}</td>
                        <td>{data.config.stats.carOperationalCostPerHour}</td>
                    </tr>
                    <tr>
                        <th>Max Lateral Acceleration (m/s<sup>2</sup>)</th>
                        <th>Minimum Turn Radius (m)</th>
                        <th>Minimum Station Turn Radius (m)</th>
                        <th>Required Track Clearance (m)</th>
                        <th>Maximum Possible Slope (%)</th>
                    </tr>
                    <tr>
                        <td>{data.config.stats.maxLateralAcceleration}</td>
                        <td>{data.config.stats.minTurnRadius}</td>
                        <td>{data.config.stats.minStationTurnRadius}</td>
                        <td>{data.config.stats.trackClearance}</td>
                        <td>{data.config.stats.maxSlopePercentage}</td>
                    </tr>
                </table>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 flex-1 text-sm font-bold">
                    Mod Stats
                </div>
                <table className="w-full table-fixed text-center border-collapse text-xs">
                    <tr>
                        <th>Cost Stat (USD)</th>
                        <th>Automation Level</th>
                        <th>Power Supply System</th>
                        <th>Loading Gauge</th>
                        <th>Track Gauge</th>
                    </tr>
                    <tr>
                        <th>Track Capital Cost</th>
                        <td>{"x"+data.calcin.a.baseTrackCost}</td>
                        <td>N/A</td>
                        <td>{"x"+data.calcin.e.Cost_Multiplier}</td>
                        <td>{"x"+data.calcin.t.CostMultiplier}</td>
                    </tr>
                    <tr>
                        <th>Station Capital Cost</th>
                        <td>{"x"+data.calcin.a.baseStationCost}</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                    </tr>
                    <tr>
                        <th>Crossover Capital Cost</th>
                        <td>{"x"+data.calcin.a.scissorsCrossoverCost}</td>
                        <td>N/A</td>
                        <td>{"x"+data.calcin.e.Scissors_Cost_Multiplier}</td>
                        <td>N/A</td>
                    </tr>
                    <tr>
                        <th>Tunnel Multiplier</th>
                        <td>N/A</td>
                        <td>{"x"+data.calcin.l.Cost_Multiplier}</td>
                        <td>{"x"+data.calcin.e.Tunnel_Cost_Multiplier}</td>
                        <td>N/A</td>
                    </tr>
                </table>
                <div className="flex items-center gap-2 flex-1 text-sm font-bold">
                    <table className="w-full table-fixed text-center border-collapse text-xs">
                        <tr>
                            <th>Stat </th>
                            <th>Base (from Train Type)</th>
                            <th>From Automation Level</th>
                        </tr>
                        <tr>
                            <th>Max Station Speed (m/s)</th>
                            <td>{data.calcin.y.maxSpeedLocalStation}</td>
                            <td>{"+"+data.calcin.a.maxSpeedLocalStation}</td>
                        </tr>
                        <tr>
                            <th>Per Train Operating Cost (USD)</th>
                            <td>{data.calcin.y.train_CostPerHour}</td>
                            <td>{hold.atcph}</td>
                        </tr>
                        <tr>
                            <th>Per Car Operating Cost (USD)</th>
                            <td>{data.calcin.y.car_CostPerHour}</td>
                            <td>{hold.accph}</td>
                        </tr>
                        <tr>
                            <th>Allow At-Grade (boolean)</th>
                            <td>{String(data.calcin.y.canCrossRoads)}</td>
                            <td>{String(data.calcin.a.canCrossRoads)}</td>
                        </tr>
                        <tr>
                            <th>Stop Time (s)</th>
                            <td>{data.calcin.y.stopTimeSeconds}</td>
                            <td>{"x"+data.calcin.a.stopTimeSeconds}</td>
                        </tr>
                    </table>
                    {latExplain(data,data.calcin.t.Name)}
                </div>
            </div>
        </div>
    )
}