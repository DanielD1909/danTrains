const api = window.SubwayBuilderAPI;

export interface colorSet {
    background: string;
    activeButton: string;
    disabledButton: string;
    textColor: string;
}

export function getColors() {
    const theme:('light'|'dark') = api.ui.getResolvedTheme();
    let resolvedColors:colorSet;
    if (theme == 'dark') {
        resolvedColors = {
            background: "#000000",
            activeButton: "#444444",
            disabledButton: "#222222",
            textColor: "#FFFFFF"
        }
    } else {
        resolvedColors = {
            background: "#FFFFFF",
            activeButton: "#EEEEEE",
            disabledButton: "#CCCCCC",
            textColor: "#000000"
        }
    }
    return resolvedColors;
}

export function dynamicButtonColors(active:boolean) {
    const hold:colorSet = getColors();
    if (active) {
        return hold.activeButton;
    } else {
        return hold.disabledButton;
    }
}