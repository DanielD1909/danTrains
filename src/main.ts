/**
 * My Subway Builder Mod
 * Entry point for the mod.
 */

import { TrainRegisterPanel, setToSaveData, getToSaveData } from './ui/TrainPanel';
import { TrainDictPanel } from './ui/trainDictionary';
import { settingsMenu, settingsMenu2 } from './ui/Settings-Menu';
import * as p from "./processing/process";
import * as register from "./processing/register";
import type * as regType from "./processing/register";
import type * as t from "./types/trains";
import { FAQPanel } from './ui/faq';

const MOD_ID = 'danield1909.danTrains';
const MOD_VERSION = '1.0.0';
const TAG = '[danTrains]';

const api = window.SubwayBuilderAPI;
var change: boolean = false;

if (!api) {
    console.error(`${TAG} SubwayBuilderAPI not found!`);
} else {
    console.log(`${TAG} v${MOD_VERSION} | API v${api.version}`);

    // Guard against double initialization (onMapReady can fire multiple times)
    let initialized = false;
    let saveData: Record<string, register.trainStorageData>;

    api.ui.registerComponent('main-menu', {
        id: 'danTrains-panel',
        component: () => settingsMenu()
    });

    try {
        api.ui.registerComponent('main-menu', {
            id: 'danTrains-panel-2',
            component: () => settingsMenu2()
        });
    } catch {
        console.log("No saves detected")
    }

    let toSave: Record<string, regType.trainStorageData> = {};

    api.hooks.onGameLoaded((saveName) => {
        let allsaved = p.getAllSaved();
        if (allsaved == undefined) {
            allsaved = {}
        }
        const hold = p.getSaveData(saveName);
        if (hold != undefined) {
            saveData = hold;
            toSave = saveData;
            Object.keys(hold).forEach(key => {
                console.log("hold[key]_"+hold[key])
            })
        }
        const saveDataData: Record<string, t.TrainTypeConfig> =
            Object.keys(saveData).reduce((acc, key) => {
                if (saveData[key].config != undefined) {
                    acc[key] = saveData[key].config;
                }
                return acc;
            }, {} as Record<string, t.TrainTypeConfig>);
        var alltypes = api.trains.getTrainTypes(); var blist: Record<string, boolean>;
        [alltypes, change, blist] = register.updateTrainsIfPossible(alltypes) as [Record<string, t.TrainTypeConfig>, boolean, Record<string, boolean>];
        const legacy = p.getLegacyList(alltypes, saveDataData);
        const existing = p.getDanTrainsList(alltypes, saveData, allsaved, blist);
        if (legacy.length > 0) {
            legacy.forEach(leg => {
                const modid: string = "dtlegacy." + leg.id;
                console.log(Object.keys(leg));
                const tempconfig: regType.trainStorageData = {
                    config: leg,
                    Manufacturer: ["Legacy"],
                    City: ["Legacy"],
                    Nation: ["Legacy"],
                    Region: ["Legacy"],
                    id: leg.id,
                    legacy: true
                }
                console.log("AAAAAAAAAAAAAA " + tempconfig.id);
                toSave[modid] = tempconfig;
            })
        }
        if (existing.length > 0) {
            existing.forEach(train => {
                if (train != undefined && train.config != undefined) {
                    console.log(Object.keys(train));
                    const tempconfig: regType.trainStorageData = {
                        config: train.config,
                        Manufacturer: train.Manufacturer,
                        City: train.City,
                        Nation: train.Nation,
                        Region: train.Region,
                        id: train.config.id,
                        legacy: false
                    }
                    console.log("mtr " + train.config.stats.minTurnRadius)
                    toSave[train.config.id] = tempconfig;
                }
            })
        }
        setToSaveData(toSave);
    })

    api.hooks.onGameSaved(async (saveName) => {
        console.log("saved");
        const hold = getToSaveData();
        if (hold != undefined && Object.keys(hold).length > 0) {
            toSave = {
                ...toSave,
                ...hold
            };
            setToSaveData(toSave);
        }
        p.exportSaveData(change, saveName);
    })

    api.hooks.onBeforeSaveLoad(async (saveName:string) => {
        console.log("Before Load")
        const saved = p.getSaveData(saveName);
        var hold:Record<string, t.TrainTypeConfig> = {}
        Object.keys(saved).forEach(key => {
            console.log(key + "key");
            console.log(saved[key].id + "key id thingy")
            hold[key] = saved[key].config
        })
        const fixed = register.updateTrainsIfPossible(hold)[0] as Record<string, t.TrainTypeConfig>;
        const touse:Record<string, regType.trainStorageData> = {}
        Object.keys(fixed).forEach(key => {
            const temp:regType.trainStorageData = {
                ...saved[key as keyof typeof saved],
                config: fixed[key as keyof typeof fixed]
            }
            touse[key] = temp;
        })
        register.registerTrainList(touse);
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

            api.ui.addFloatingPanel({
                id: 'FAQPanel',
                title: 'danTrains FAQ Panel',
                icon: 'HelpCircle',
                render: FAQPanel,
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
