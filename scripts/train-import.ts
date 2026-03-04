import fs from "fs"
import Papa from "papaparse"
import type { Train, Electrification, TrackGauge, LoadingGauge, PowerSupply, TrainType, AutomationLevel } from "../src/processing/processes.d.ts"

console.log("Starting Trains");
const csv = fs.readFileSync("src/data/trains.csv", "utf8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
  skipFirstNLines: 2
})

const s:string[] = ["desc","color","name","trainType","trainType2","mainTrackID","MainTrack"];
const sl:string[] = ["Automation","Electrification","Voltage","TrackGauge","LoadingGauge","CompatibleTracks","ExtraTracks","Manufacturer","Cities","Nation","Cont","Cities2","Nation2"]
const nl:string[] = ["Multipliers"];
const b:string[] = ["canCrossRoads","Old","Generic","Ready"];
const emptyList:string[] = ["lengthList","consistList","minStationList"]

var TrainList:Train[] = [];
parsed.data.forEach((r:any) => {
  Object.keys(r).forEach((key) => {
    if (s.includes(key)) {
      r[key] = String(r[key])
    } else if (sl.includes(key)){
      r[key] = r[key].split(",").map((v:string)=>v.trim());
    } else if (nl.includes(key)){
      const hold3:string[] = r[key].split("|");
      var holdn:number[] = [];
      hold3.forEach((hold4:string) => {
        holdn.push(Number(hold4.replace(/\s/g, '')));
      });
      r[key] = holdn;
    } else if (b.includes(key)){
        r[key] = Boolean(r[key]);
    } else {
        r[key] = Number(r[key]);
    }
  })
  emptyList.forEach((key) => {
    r[key] = [];
  }
);
  const train:Train = r as Train;
  TrainList.push(train);
});
fs.writeFileSync(
  "src/data/trains.json",
  JSON.stringify(TrainList, null, "\t")
)

console.log("Trains Complete");
console.log("Starting Standards");

const csv2 = fs.readFileSync("src/data/standards.csv", "utf8");

const parsed2 = Papa.parse(csv2, {
  header: true,
  skipEmptyLines: true
})

var elist:Electrification[] = []; var tglist:TrackGauge[] = []; var lglist:LoadingGauge[] = []; var pslist:PowerSupply[] = []; var ttlist:TrainType[] = []; var alist:AutomationLevel[] = [];

parsed2.data.forEach((ro:any) => {
  if (ro.Electrification != "") {
    elist.push({
      Name: ro.Electrification,
      Actual: ro.Actual_B,
      id: ro.id_C
    })
  }
  if (ro.Track_Gauge != "") {
    tglist.push({
      Name: ro.Track_Gauge,
      Actual: Number(ro.Actual_F),
      id: ro.id_E,
      CostMultiplier: Number(ro.Cost_Multiplier_G)
    })
  } 
  if (ro.Loading_Gauge != "") {
    lglist.push({
      Name: ro.Loading_Gauge,
      id: ro.id_I,
      Average: Number(ro.Average),
      Min_No_Filler: Number(ro.Min_No_Filler),
      Max_No_Filler: Number(ro.Max_No_Filler),
      Cost_Multiplier: Number(ro.Cost_Multiplier_M),
      parallelTrackSpacing: Number(ro.parallelTrackSpacing),
      trackClearance: Number(ro.trackClearance)
    })
  } 
  if (ro.Electrification_Type != "") {
    pslist.push({
      Name: ro.Electrification_Type,
      id: ro.id_Q,
      Cost_Multiplier: Number(ro.Cost_Multiplier_R),
      Tunnel_Cost_Multiplier: Number(ro.Tunnel_Cost_Multiplier),
      Scissors_Cost_Multiplier: Number(ro.Scissors_Cost_Multiplier)
    })
  } 
  if (ro.Cost_Name != "") {
    ttlist.push({
      Name: ro.Cost_Name,
      maxSpeedLocalStation: Number(ro.maxSpeedLocalStation_V),
      train_CostPerHour: Number(ro.train_CostPerHour_W),
      car_CostPerHour: Number(ro.car_CostPerHour_X),
      canCrossRoads: Boolean(ro.canCrossRoads_Y),
      stopTimeSeconds: Number(ro.stopTimeSeconds_Z),
      maxLateralAcceleration: Number(ro.maxLateralAcceleration_AA),
      maxSlopePercentage: Number(ro.maxSlopePercentage_AB)
    })
  } 
  if (ro.Automation_Level != "") {
    alist.push({
      Name: ro.Automation_Level,
      maxSpeedLocalStation: Number(ro.maxSpeedLocalStation_AD),
      train_CostPerHour: Number(ro.train_CostPerHour_AE),
      car_CostPerHour: Number(ro.car_CostPerHour_AF),
      canCrossRoads: Boolean(ro.canCrossRoads_AG),
      stopTimeSeconds: Number(ro.stopTimeSeconds_AH),
      maxLateralAcceleration: Number(ro.maxLateralAcceleration_AI),
      baseTrackCost: Number(ro.baseTrackCost),
      baseStationCost: Number(ro.baseStationCost),
      scissorsCrossoverCost: Number(ro.scissorsCrossoverCost)
    })
  } 
})

fs.writeFileSync(
  "src/data/standards/electric.json",
  JSON.stringify(elist, null, "\t")
)
console.log("Eletrification Standards Complete");

fs.writeFileSync(
  "src/data/standards/track.json",
  JSON.stringify(tglist, null, "\t")
)
console.log("Track Gauge Standards Complete");

fs.writeFileSync(
  "src/data/standards/loading.json",
  JSON.stringify(lglist, null, "\t")
)
console.log("Loading Gauge Standards Complete");

fs.writeFileSync(
  "src/data/standards/power.json",
  JSON.stringify(pslist, null, "\t")
)
console.log("Power Supply Standards Complete");

fs.writeFileSync(
  "src/data/standards/automation.json",
  JSON.stringify(alist, null, "\t")
)
console.log("Eletrification Standards Complete");

fs.writeFileSync(
  "src/data/standards/trains.json",
  JSON.stringify(ttlist, null, "\t")
)
console.log("Train Type Standards Complete");
