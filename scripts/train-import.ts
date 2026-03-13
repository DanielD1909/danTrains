import fs from "fs"
import Papa from "papaparse"
import type { Train, Electrification, TrackGauge, LoadingGauge, PowerSupply, TrainType, AutomationLevel, Region, Nation, City, Tag } from "../src/processing/processes.d.ts"

console.log("Starting Trains");
const csv = fs.readFileSync("src/data/trains.csv", "utf8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
  skipFirstNLines: 2
})

const s:string[] = ["desc","color","name","trainType","trainType2","mainTrackID","MainTrack"];
const sl:string[] = ["Automation","Electrification","Voltage","TrackGauge","LoadingGauge","CompatibleTracks","ExtraTracks","Manufacturer","Cities","Nation","Cont","Cities2","Nation2","Tags"]
const nl:string[] = ["Multipliers"];
const b:string[] = ["canCrossRoads","Old","Generic","Ready"];
const emptyList:string[] = ["lengthList","consistList","minStationList","maxStationList"]
const increment = 20;
var tagList:Set<string> = new Set();

var TrainList:Train[] = [];
parsed.data.forEach((r:any) => {
  var lengthList:number[] = []; var consistList:number[] = []; var minStationList:number[] = [];
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
        r[key] = ((r[key])==="TRUE");
    } else {
        r[key] = Number(r[key]);
    }
  })
  const tagRaw:string = String(r["Tags"]);
  
  if (tagRaw.includes(",")) {
    tagRaw.split(",").forEach (tag => {
      tagList.add(tag)
    })
  } else {
      tagList.add(tagRaw);
  }

  if (r["minCars"] != r["maxCars"]) {
    for (let step = Number(r["minCars"]); step <= Number(r["maxCars"]); step += Number(r["carsPerCarSet"])) {
        lengthList.push(Math.round(step * Number(r["carLength"])));
        consistList.push(step);
        minStationList.push(Math.round((step * Number(r["carLength"]) + 3) / increment) * increment);
    }
    r["lengthList"] = lengthList;
    r["consistList"] = consistList;
    r["minStationList"] = minStationList;
    r["maxStationList"] = minStationList;
  } else {
    r["lengthList"] = [Math.round(Number(r["minCars"]) * Number(r["carLength"]))];
    r["consistList"] = [Number(r["minCars"])];
    r["minStationList"] = [Math.round((Number(r["minCars"]) * Number(r["carLength"]) + 3) / increment) * increment];
    r["maxStationList"] = [Math.round((Number(r["minCars"]) * Number(r["carLength"]) + 3) / increment) * increment];
  }
  const train:Train = r as Train;
  TrainList.push(train);
});
fs.writeFileSync(
  "src/data/trains.json",
  JSON.stringify(TrainList, null, "\t")
)

console.log("Trains Complete");

var tList:Tag[] = [];
tagList.forEach(name => {
  const spl = name.split(":");
  tList.push({
    Name: spl[1] + " ("+spl[0]+")",
    id: name,
    Type: spl[0]
  })
})
fs.writeFileSync(
  "src/data/authors.json",
  JSON.stringify(Array.from(tList), null, "\t")
)
console.log("Authors Complete");
console.log("Starting Standards");

const csv2 = fs.readFileSync("src/data/standards.csv", "utf8");

const parsed2 = Papa.parse(csv2, {
  header: true,
  skipEmptyLines: true
})

var elist:Electrification[] = []; var tglist:TrackGauge[] = []; var lglist:LoadingGauge[] = []; var pslist:PowerSupply[] = []; var ttlist:TrainType[] = []; var alist:AutomationLevel[] = [];
var reglist:Region[] = []; var natlist:Nation[] = []; var citylist:City[] = [];

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
      canCrossRoads: (ro.canCrossRoads_Y==="TRUE"),
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
      canCrossRoads: (ro.canCrossRoads_AG==="TRUE"),
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

console.log("Starting Regions/Nations/Cities");

const csv3 = fs.readFileSync("src/data/natcont.csv", "utf8");

const parsed3 = Papa.parse(csv3, {
  header: true,
  skipEmptyLines: true
})

parsed3.data.forEach((ro:any) => {
  if (ro.F != "") {
    citylist.push({
      Name: ro.F,
      Code: ro.D,
      Nation: ro.G,
      NationCode: ro.E,
      Region: ro.H
    })
  }
})

const regionsMap: Record<string, Region> = {};
const nationsMap: Record<string, Nation> = {};

citylist.forEach(city => {
    // Handle nations
    if (!nationsMap[city.NationCode]) {
        nationsMap[city.NationCode] = {
            Name: city.Nation,
            Code: city.NationCode,
            Region: city.Region,
            CityCodes: []
        };
    }
    nationsMap[city.NationCode].CityCodes.push(city.Code);

    // Handle regions
    if (!regionsMap[city.Region]) {
        regionsMap[city.Region] = {
            Name: city.Region,
            CountryCodes: []
        };
    }
    if (!regionsMap[city.Region].CountryCodes.includes(city.NationCode)) {
        regionsMap[city.Region].CountryCodes.push(city.NationCode);
    }
});

// Convert maps to arrays
reglist = Object.values(regionsMap);
natlist = Object.values(nationsMap);

citylist.push({
  Name: "Generic",
  Code: "Generic",
  Region: "Generic",
  Nation: "Generic",
  NationCode: "Generic"
})
natlist.push({
  Name: "Generic",
  Code: "Generic",
  Region: "Generic",
  CityCodes: ["Generic"]
})
reglist.push({
  Name: "Generic",
  CountryCodes: ["Generic"]
})

fs.writeFileSync(
  "src/data/natcont/cities.json",
  JSON.stringify(citylist, null, "\t")
)
console.log("Cities Complete");

fs.writeFileSync(
  "src/data/natcont/nations.json",
  JSON.stringify(natlist, null, "\t")
)
console.log("Nations Complete");

fs.writeFileSync(
  "src/data/natcont/regions.json",
  JSON.stringify(reglist, null, "\t")
)
console.log("Regions Complete");