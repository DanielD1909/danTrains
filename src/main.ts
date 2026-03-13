/**
 * My Subway Builder Mod
 * Entry point for the mod.
 */

import { TrainRegisterPanel,setToSaveData,getToSaveData } from './ui/TrainPanel';
import { TrainDictPanel } from './ui/trainDictionary';
import {settingsMenu} from './ui/Settings-Menu';
import * as p from "./processing/process";
import * as register from "./processing/register";
import type * as regType from "./processing/register";
import type * as t from "./types/trains";

const MOD_ID = 'danield1909.danTrains';
const MOD_VERSION = '1.0.0';
const TAG = '[subway-builder]';

const api = window.SubwayBuilderAPI;
if (!api) {
  console.error(`${TAG} SubwayBuilderAPI not found!`);
} else {
  console.log(`${TAG} v${MOD_VERSION} | API v${api.version}`);

  // Guard against double initialization (onMapReady can fire multiple times)
  let initialized = false;
  let saveData:Record<string, register.trainStorageData>;

  api.ui.registerComponent('settings-menu', {
    id: 'my-custom-panel',
    component: () => settingsMenu()
  }); 

  api.hooks.onGameLoaded((saveName) => {
    // console.log("save loaded");
    // console.log("30");
    const hold = p.getSaveData(saveName);
    // console.log("32");
    if (hold != undefined) {
      saveData = hold;
    }
    const saveDataData: Record<string, t.TrainTypeConfig> =
      Object.keys(saveData).reduce((acc, key) => {
        acc[key] = saveData[key].config;
        return acc;
      }, {} as Record<string, t.TrainTypeConfig>);
    // console.log("36");
    const alltypes = api.trains.getTrainTypes();
    // console.log("38");
    // console.log(Object.keys(alltypes));
    // console.log("40");
    // if (!saveData || saveData == undefined) return;
    // console.log("43 "+saveData);
    // console.log("44 "+Object.keys(saveData))
    // const datatwo = saveData.value;
    // if (Object.keys(datatwo).length > 0) {
    //   Object.keys(datatwo).forEach(key => {
    //     const hold = saveData[key as keyof typeof saveData].config;
    //     api.trains.registerTrainType(hold);
    //   });
    // }
    const legacy = p.getLegacyList(alltypes,saveDataData);
    if (legacy.length>0) {
      legacy.forEach(leg => {
        const modid:string = "dtlegacy."+leg.id;
        console.log(Object.keys(leg));
        const tempconfig:regType.trainStorageData = {
          config: leg,
          Manufacturer: ["Legacy"],
          City: ["Legacy"],
          Nation: ["Legacy"],
          Region: ["Legacy"],
          id: leg.id,
          legacy: true
        }
        const tempObject = {[modid]:tempconfig}
        Object.assign(toSave,tempObject)
      })
    }
    setToSaveData(toSave);
  })

  let toSave:Record<string, regType.trainStorageData> = {};

  api.hooks.onGameSaved(async (saveName) => {
    console.log("saved");
    const hold = getToSaveData();
    if (hold != undefined && Object.keys(hold).length > 0) {
      Object.assign(toSave,hold);
      setToSaveData(toSave);
    }
    p.exportSaveData(saveName);
  })


  // Initialize mod when map is ready
  api.hooks.onMapReady((_map) => {
    console.log("initalized");
    if (initialized) return;
    initialized = true;
    
    try {
      // Example: Add a floating panel with a React component
      api.ui.addFloatingPanel({
        id: 'registerPanel',
        title: 'Dan Trains Registration Menu',
        icon: 'TrainTrack',
        render: TrainRegisterPanel,
      });

      api.ui.addFloatingPanel({
        id: 'dictPanel',
        title: 'Dan Trains Train Dictionary',
        icon: 'BookMarked',
        render: TrainDictPanel,
        defaultWidth: 1600,
        defaultHeight: 950
      });

      
      console.log(`${TAG} Initialized successfully.`);
    } catch (err) {
      console.error(`${TAG} Failed to initialize:`, err);
      api.ui.showNotification(`${MOD_ID} failed to load. Check console for details.`, 'error');
    }
  });


}
