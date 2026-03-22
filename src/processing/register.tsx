import type * as c from "../processing/processes.d.ts";
import * as p from "../processing/process";
import type * as t from "../types/trains";
import type { ElevationType } from '../types/core';
import {addToSaveData} from '../ui/TrainPanel'
import type * as elec from "../types/electron"
import trains from "../data/trains.json"

const api = window.SubwayBuilderAPI;

const elecAPI = window.electron as elec.ElectronAPI
let game_version: string | undefined;

elecAPI.getVersion().then(v => {
    game_version = v;
});

export function isNewVersion() {
    const versionSplit = game_version?.split(".")
    if (versionSplit != undefined) {
        if (Number(versionSplit[0])>=1 && Number(versionSplit[1])>=2 && Number(versionSplit[2])>=1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export interface statsCalcInput {
    y: c.TrainType,
    a: c.AutomationLevel,
    v: c.Electrification,
    e: c.PowerSupply,
    t: c.TrackGauge,
    l: c.LoadingGauge,
    train: c.Train,
    min: number,
    max: number
}

export interface trainStorageData {
    config: t.TrainTypeConfig,
    Manufacturer: string[],
    City: string[],
    Nation: string[],
    Region: string[],
    calcin?: statsCalcInput,
    id?: string,
    saved?: boolean,
    legacy?: boolean
}

const base = {
    baseTrackCost: 50000,
    baseStationCost: 75000000,
    scissorsCrossoverCost: 15000000,
    DEEP_BORE: 4.5,
    STANDARD_TUNNEL: 2,
    CUT_AND_COVER: 1,
    AT_GRADE: 0.3,
    ELEVATED: 0.8
}

export interface statsCalcOutput {
    baseTrackCost: number,
    baseStationCost: number,
    scissorsCrossoverCost: number,
    parallelTrackSpacing: number,
    elevationMults: Record<ElevationType, number>,
    trackClearance: number,
    trainOperationalCostPerHour: number,
    carOperationalCostPerHour: number,
    maxSpeedLocalStation: number,
    canCrossRoads: boolean,
    stopTimeSeconds: number,
    maxLateralAcceleration: number,
    minCars: number,
    maxCars: number,
    name: string,
    id: string,
    coefficient: number
}

export function statsCalc(i:statsCalcInput) {
    console.log("Game Version"+game_version);
    const baseTrackCost:number = Math.round(base.baseTrackCost * i.e.Cost_Multiplier * i.t.CostMultiplier * i.a.baseTrackCost);
    const baseStationCost:number = Math.round(base.baseStationCost * i.a.baseStationCost);
    const scissorsCrossoverCost:number = Math.round(base.scissorsCrossoverCost * i.e.Scissors_Cost_Multiplier * i.a.scissorsCrossoverCost);
    const height = i.y.height + i.e.AddedHeight;
    const gottenMults:number[] = p.getMults(i.l,i.e,height);
    let mult:number;
    if (i.train.Old == true) {mult = 7/5} else {mult = 1}
    const elevationMults = {
        DEEP_BORE: Number((base.DEEP_BORE * gottenMults[0]).toFixed(2)),
        STANDARD_TUNNEL: Number((base.STANDARD_TUNNEL * gottenMults[0]).toFixed(2)),
        CUT_AND_COVER: Number((base.CUT_AND_COVER * gottenMults[1]).toFixed(2)),
        AT_GRADE: base.AT_GRADE,
        ELEVATED: Number((base.ELEVATED * gottenMults[2]).toFixed(2)),
    }
    const parallelTrackSpacing:number = i.l.parallelTrackSpacing;
    const trackClearance:number = i.l.trackClearance;
    const trainOperationalCostPerHour:number = Math.round(i.y.train_CostPerHour*mult)+i.a.train_CostPerHour;
    const carOperationalCostPerHour:number = ((Math.round(i.y.train_CostPerHour*mult)+i.a.train_CostPerHour)/10);
    const maxSpeedLocalStation:number = i.y.maxSpeedLocalStation+i.a.maxSpeedLocalStation;
    const canCrossRoads:boolean = (i.y.canCrossRoads && i.a.canCrossRoads);
    const stopTimeSeconds:number = Number((i.y.stopTimeSeconds*i.a.stopTimeSeconds).toFixed(2));
    const coefficient:number = Math.sqrt((i.y.maxCantDeficiency+i.y.maxCant)*i.t.Cant_Multiplier/(11.82*i.t.Actual/1.435));
    console.log("Apple"+(i.y.maxCantDeficiency+i.y.maxCant));
    console.log("Banana"+coefficient);
    console.log("Orange"+(11.82*i.t.Actual/1.435));
    const maxLateralAcceleration:number = Number((Math.pow(coefficient/3.6,2)).toFixed(2));
    const minCars:number = i.train.consistList[0];
    const hold:number[] = p.compatibleConsists(i.min,i.train,isNewVersion(),i.max);
    const maxCars:number = hold[hold.length-1];
    var name:string = i.v.Actual+" ("+i.a.Name+" | "+i.e.id.toUpperCase()+" | "+i.l.id.toUpperCase()+")";
    if (i.t.id != "std") {
        name = i.t.Name + " " + name
    }
    var carActual = carOperationalCostPerHour;
    if ((i.train.trainType).includes("LRT")) {
        carActual = carActual/i.train.carsPerCarSet
    }
    carActual = Number(carActual.toFixed(2));
    const id:string = i.t.id+"_"+i.v.id+"-"+i.a.Name[i.a.Name.length-1]+"_"+i.e.id+"_"+i.l.id;
    const o:statsCalcOutput = { 
        baseTrackCost: baseTrackCost,
        baseStationCost: baseStationCost,
        scissorsCrossoverCost: scissorsCrossoverCost,
        parallelTrackSpacing: parallelTrackSpacing,
        elevationMults: elevationMults,
        trackClearance: trackClearance,
        trainOperationalCostPerHour: trainOperationalCostPerHour,
        carOperationalCostPerHour: carActual,
        maxSpeedLocalStation: maxSpeedLocalStation,
        canCrossRoads: canCrossRoads,
        stopTimeSeconds: stopTimeSeconds,
        maxLateralAcceleration: maxLateralAcceleration,
        minCars: minCars,
        maxCars: maxCars,
        name: name,
        id: id,
        coefficient:coefficient
    };
    return o;
}

export function compileTrain(train:c.Train,sco:statsCalcOutput,max:number,idin:string,calcin:statsCalcInput) {
    var msl = train.minStationList[train.consistList.indexOf(sco.maxCars)];
    if (isNewVersion()) {
        msl = train.minStationList[train.consistList.indexOf(sco.minCars)];
    }
    const stat:t.TrainTypeStats = {
        maxAcceleration: train.maxAcceleration,
        maxDeceleration: train.maxDeceleration,
        maxSpeed: train.maxSpeed,
        maxSpeedLocalStation: sco.maxSpeedLocalStation,
        capacityPerCar: train.capacityPerCar,
        carLength: train.carLength,
        minCars: sco.minCars,
        maxCars: sco.maxCars,
        carsPerCarSet: train.carsPerCarSet,
        carCost: train.carCost,
        trainWidth: train.trainWidth,
        minStationLength: msl,
        maxStationLength: max,
        baseTrackCost: sco.baseTrackCost,
        baseStationCost: sco.baseStationCost,
        trainOperationalCostPerHour: sco.trainOperationalCostPerHour,
        carOperationalCostPerHour: sco.carOperationalCostPerHour,
        scissorsCrossoverCost: sco.scissorsCrossoverCost,
        trackClearance: sco.trackClearance,
        maxLateralAcceleration: sco.maxLateralAcceleration,
        minTurnRadius: train.minTurnRadius,
        minStationTurnRadius: train.minStationTurnRadius,
        maxSlopePercentage: train.maxSlopePercentage,
        parallelTrackSpacing: sco.parallelTrackSpacing,
        stopTimeSeconds: sco.stopTimeSeconds
    }
    const tracktypecompat:string = "\""+idin+"\"";
    var desc = " Current Track Setup: "+sco.name;
    if (train.desc[train.desc.length-1] != ".") {
        desc = train.desc + "." + desc;
    } else {
        desc = train.desc + desc
    }
    const creatorList = train.Tags.filter(tag => tag.includes("Creator"))
    if (creatorList.length > 0) {
        const creatorString = creatorList.join(", ").replace("Creator:","");
        desc = desc + ". Created by: "+creatorString;
    }
    
    const config:t.TrainTypeConfig = {
        id: "dt."+idin,
        name: train.name,
        /** Description of this train type */
        description: desc,
        /** Performance and cost statistics */
        stats: stat,
        /** Track types this train can run on (e.g. ["heavy-metro"]) */
        compatibleTrackTypes: [tracktypecompat],
        /** Visual appearance settings */
        appearance: {color: train.color},
        /** Cost multipliers for each elevation type */
        elevationMultipliers: sco.elevationMults,
        /** Whether this train type can cross roads at grade level */
        allowAtGradeRoadCrossing: sco.canCrossRoads,
    }
    const store:trainStorageData = {
        id: "dt."+idin,
        config: config,
        Manufacturer: train.Manufacturer,
        City: train.Cities2,
        Nation: train.Nation2,
        Region: train.Cont,
        calcin: calcin
    }
    const out:compileTrainOut = {
        storageData: store,
        trainConfig: config,
    }
    return out;
}

export interface compileTrainOut {
    storageData: trainStorageData,
    trainConfig: t.TrainTypeConfig
}

export function registerTrain(inp:t.TrainTypeConfig) {
    api.trains.registerTrainType(inp);
    console.log("Train Registered! ID: "+inp.id);
    api.ui.showNotification("Train Registered! ID: "+inp.id,'info');
    const check:boolean = (api.trains.getTrainType(inp.id) != undefined);
    return check;
}

export function registerTrainList(inp:Record<string,trainStorageData>) {
    console.log(inp + "inp");
    console.log(Object.keys(inp) + "keys");
    (Object.keys(inp)).forEach(key => {
        const con = inp[key].config;
        registerTrain(con);
        addToSaveData(key,inp[key])
        console.log("Added Train: "+key);
    })
    console.log("Added all trains from save.")
}

const Trains: c.Train[] = trains as c.Train[];
export function updateTrainsIfPossible(inp:Record<string,t.TrainTypeConfig>) {
    var hold:boolean = false;
    const blist:Record<string,boolean> = {}
    Object.keys(inp).forEach(key => {
        const train = Trains.find(train => inp[key].name == train.name || inp[key].name == train.Alias)
        if (train == undefined) {
            console.log("No matching train found for "+key+" ("+inp[key].name+")")
            blist[key] = false;
        } else if (train.minTurnRadius < inp[key].stats.minTurnRadius) {
            const old = inp[key].stats.minTurnRadius
            hold = true;
            blist[key] = true;
            inp[key].stats.minTurnRadius = train.minTurnRadius
            console.log("Updated Turn Radius for "+key+" ("+inp[key].name+") from "+old+" to "+train.minTurnRadius)
        } else {
            console.log("No Update Needed for "+key+" ("+inp[key].name+")")
            blist[key] = false;
        }
    })
    return [inp,hold,blist];
}