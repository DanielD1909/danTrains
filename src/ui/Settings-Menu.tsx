import * as p from "../processing/process";
import * as reg from "../processing/register";
import type * as regType from "../processing/register";
import { getColors } from "./themeHandle";
import type * as t from "../types/trains";
import type { colorSet } from "./themeHandle";

const api = window.SubwayBuilderAPI;
const { components } = api.utils;
const r = api.utils.React;
const h = r.createElement;
const { Card, CardHeader, CardTitle, CardContent, Button, Switch, Label } = components;



export function settingsMenu() {
    const colors: colorSet = getColors();
    const options: string[] = p.getAllSaveNames() || ["No Saves Found"];
    const [save, setSave] = r.useState(options[0]);
    const [failsafe, setFailsafe] = r.useState(false);
    const [canReg, setCanReg] = r.useState(true);
    const [text,setText] = r.useState("Register");
    return (
        //h(Card, { className: 'w-full h-full flex flex-col' }, [
        h('div', { key: 'content', className: 'flex flex-col gap-2 items-stretch min-w-full max-w-full' }, [
            h('div', { key: 'Name', className: 'text-lg font-bold w-full' }, 'DanTrains Loader (By Save)'),
            h('div', {
                key: 'dropdown',
                className: 'flex flex-row items-center gap-2 mt-2 w-full'
            }, [
                h('label', { key: 'label', className: 'flex-shrink-0 w-24' }, 'Select save:'),
                h(
                    'select',
                    {
                        key: 'select',
                        variant: 'secondary',
                        className: 'border rounded px-2 py-1 flex-1 w-full',
                        value: save,
                        style: {
                            backgroundColor: colors.background
                        },
                        onChange: (e: any) => {
                            setSave(e.target.value),
                            setFailsafe(false),
                            setText("Register"),
                            setCanReg(true)
                        }
                    },
                    options.map(opt =>
                        h('option', { key: opt, value: opt }, opt)
                    )
                )

            ]),
            h(Button, {
                key: 'btn',
                disabled: !canReg,
                onClick: () => {
                    setText("Registered!");
                    const saved = p.getSaveData(save);
                    var hold:Record<string, t.TrainTypeConfig> = {}
                    Object.keys(saved).forEach(key => {
                        console.log(key + "key");
                        console.log(saved[key].id + "key id thingy")
                        hold[key] = saved[key].config
                    })
                    const fixed = reg.updateTrainsIfPossible(hold)[0] as Record<string, t.TrainTypeConfig>;
                    const touse:Record<string, reg.trainStorageData> = {}
                    Object.keys(fixed).forEach(key => {
                        const temp:reg.trainStorageData = {
                            ...saved[key as keyof typeof saved],
                            config: fixed[key as keyof typeof fixed]
                        }
                        touse[key] = temp;
                    })
                    reg.registerTrainList(touse);
                    setCanReg(false);
                },
                style: {
                    backgroundColor: colors.activeButton,
                    color: colors.textColor
                },
            }, text),
            h('div', { className: 'flex flex-row items-stretch w-full' }, [
                h(Button, {
                    key: 'btn',
                    style: {
                        backgroundColor: "#FF0000"
                    },
                    onClick: () => setFailsafe(true)
                }, 'Delete Save Data?'),
                h(Button, {
                    key: 'btn',
                    disabled: !failsafe,
                    style: {
                        backgroundColor: "#FF0000"
                    },
                    onClick: () => p.deleteSaveData(save)
                }, 'Delete Save Data.')
            ])
        ])
        //])
    )
}

export function settingsMenu2() {
    try {
        const colors: colorSet = getColors();
        const allSaved: Record<string, regType.trainStorageData> = p.getAllSaved() || {};
        const options: [string, string][] = [];
        Object.keys(allSaved).forEach((key: keyof typeof allSaved) => {
            const id = allSaved[key].config.id;
            console.log("ID: " + id);
            const name = allSaved[key].config.name + "(" + id + ")"
            console.log("Name: " + name);
            options.push([id, name])
        })
        const [canReg, setCanReg] = r.useState(true);
        const [text,setText] = r.useState("Register");
        const [save, setSave] = r.useState(options[0][0]);
        return (
            //h(Card, { className: 'w-full h-full flex flex-col' }, [
            h('div', { key: 'content', className: 'flex flex-col gap-2 items-stretch min-w-full max-w-full' }, [
                h('div', { key: 'Name', className: 'text-lg font-bold w-full' }, 'DanTrains Loader (By ID)'),
                h('div', {
                    key: 'dropdown',
                    className: 'flex flex-row items-center gap-2 mt-2 w-full'
                }, [
                    h('label', { key: 'label', className: 'flex-shrink-0 w-24' }, 'Select save:'),
                    h(
                        'select',
                        {
                            key: 'select',
                            variant: 'secondary',
                            className: 'border rounded px-2 py-1 flex-1 w-full',
                            value: save,
                            style: {
                                backgroundColor: colors.background
                            },
                            onChange: (e: any) => {
                                setSave(e.target.value)
                                setCanReg(true)
                                setText("Register")
                            }
                        },
                        options.map(opt =>
                            h('option', { key: opt[1], value: opt[0] }, opt[1])
                        )
                    )

                ]),
                h(Button, {
                    key: 'btn',
                    disabled: !canReg,
                    onClick: () => {
                        setText("Registered!");
                        reg.registerTrain((p.getTrainFromID(save, allSaved)).config)
                        setCanReg(false)
                    },
                    style: {
                        backgroundColor: colors.activeButton,
                        color: colors.textColor
                    },
                }, text)
            ])
            //])
        )
    }
    catch {
        return <div>No Save Found</div>
    }
}