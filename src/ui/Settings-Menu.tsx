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
    return (
        h(Card, { className: 'p-4' }, [
            h(CardHeader, { key: 'header' },
                h(CardTitle, null, 'DanTrains Loader')
            ),
            h(CardContent, { key: 'content' }, [
                h('div', {
                    key: 'dropdown',
                    className: 'flex items-center gap-2 mt-2'
                }, [

                    h('label', { key: 'label' }, 'Select train:'),

                    h(
                        'select',
                        {
                            key: 'select',
                            variant: 'secondary',
                            className: 'border rounded px-2 py-1',
                            value: save,
                            style: {
                                backgroundColor: '#303030'
                            },
                            onChange: (e: any) => {
                                setSave(e.target.value);
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
                }, 'Register Train')
            ])
        ])
    )
}