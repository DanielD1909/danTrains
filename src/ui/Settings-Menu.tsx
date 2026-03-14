import * as p from "../processing/process";
import * as reg from "../processing/register";
import type * as regType from "../processing/register";

const api = window.SubwayBuilderAPI;
const { components } = api.utils;
const r = api.utils.React;
const h = r.createElement;
const { Card, CardHeader, CardTitle, CardContent, Button, Switch, Label } = components;



export function settingsMenu() {
    const options:string[] = p.getAllSaveNames() || ["No Saves Found"];
    const [save,setSave] = r.useState(options[0]);
    const [failsafe,setFailsafe] = r.useState(false);
    function getColor() {
        if (failsafe) {
            return "#FF0000"
        } else {
            return "#AA0000"
        }
    }
    return (
        //h(Card, { className: 'w-full h-full flex flex-col' }, [
            h('div', { key: 'content', className:'flex flex-col gap-2 items-stretch min-w-full max-w-full' }, [
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
                                backgroundColor: '#303030'
                            },
                            onChange: (e: any) => {
                                setSave(e.target.value),
                                setFailsafe(false)
                            }
                        },
                        options.map(opt =>
                            h('option', { key: opt, value: opt }, opt)
                        )
                    )

                ]),
                h(Button, {
                    key: 'btn',
                    onClick: () => reg.registerTrainList(p.getSaveData(save))
                }, 'Register Train'),
                h('div',{className: 'flex flex-row items-stretch w-full'},[
                    h(Button, {
                        key: 'btn',
                        style: {
                            backgroundColor:"#FF0000"
                        },
                        onClick: () => setFailsafe(true)
                    }, 'Delete Save Data?'),
                    h(Button, {
                        key: 'btn',
                        enabled:failsafe,
                        style: {
                            backgroundColor:getColor()
                        },
                        onClick: () => p.deleteSaveData(save)
                    }, 'Delete Save Data.')
                ])
            ])
        //])
    )
}

export function settingsMenu2() {
    const allSaved:Record<string, regType.trainStorageData> = p.getAllSaved() || {};
    const options:[string, string][] = [];
    Object.keys(allSaved).forEach((key:keyof typeof allSaved) => {
        const id = allSaved[key].config.id;
        const name = allSaved[key].config.name + "(" + id + ")"
        options.push([id,name])
    })
    const [save,setSave] = r.useState(options[0]);
    return (
        //h(Card, { className: 'w-full h-full flex flex-col' }, [
            h('div', { key: 'content', className:'flex flex-col gap-2 items-stretch min-w-full max-w-full' }, [
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
                                backgroundColor: '#303030'
                            },
                            onChange: (e: any) => {
                                setSave(e.target.value)
                            }
                        },
                        options.map(opt =>
                            h('option', { key: opt[1], value: opt[0] }, opt[1])
                        )
                    )

                ]),
                h(Button, {
                    key: 'btn',
                    onClick: () => reg.registerTrain((p.getTrainFromID(save[0],allSaved)).config)
                }, 'Register Train')
            ])
        //])
    )
}