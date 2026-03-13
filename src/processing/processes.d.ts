export interface Train {
    /** Maximum acceleration rate (m/s^2) */
    maxAcceleration: number;
    /** Maximum deceleration rate (m/s^2) */
    maxDeceleration: number;
    /** Maximum speed (m/s) */
    maxSpeed: number;
    /** Maximum speed when approaching a local station (m/s) */
    maxSpeedLocalStation: number;
    /** Passenger capacity per car */
    capacityPerCar: number;
    /** Length of each car (meters) */
    carLength: number;
    /** Minimum number of cars per train */
    minCars: number;
    /** Maximum number of cars per train */
    maxCars: number;
    /** Number of cars in a car set (purchase unit) */
    carsPerCarSet: number;
    /** Cost per car */
    carCost: number;
    /** Width of the train (meters) */
    trainWidth: number;
    /** Minimum station platform length */
    minStationLength: number;
    /** Maximum station platform length */
    maxStationLength: number;
    /** Base cost per track segment */
    baseTrackCost: number;
    /** Base cost per station */
    baseStationCost: number;
    /** Hourly operational cost per train */
    trainOperationalCostPerHour: number;
    /** Hourly operational cost per car */
    carOperationalCostPerHour: number;
    /** Cost for a scissors crossover */
    scissorsCrossoverCost: number;
    trackClearance: number;
    maxLateralAcceleration: number;
    minTurnRadius: number;
    minStationTurnRadius: number;
    maxSlopePercentage: number;
    Automation: string[];
    Electrification: string[];
    Voltage: string[];
    TrackGauge: string[];
    LoadingGauge: string[];
    CompatibleTracks: string[];
    ExtraTracks: string[];
    canCrossRoads: boolean;
    TrainGapFillerLength: number;
    stopTimeSeconds: number;
    minStationLength: number;
    maxStationLength: number;
    Old: boolean;
    Multipliers: number[];
    desc: string;
    color: string;
    Manufacturer: string[];
    Cities: string[];
    Nation: string[];
    Cont: string[];
    Generic: boolean;
    Cities2: string[];
    Nation2: string[];
    Ready: boolean;
    name: string;
    trainType: string;
    trainType2: string;
    MainTrack: string;
    mainTrackID: string;
    lengthList:number[];
    consistList:number[];
    minStationList:number[];
    maxStationList:number[];
    Tags:string[];
}

export interface Electrification {
    Name: string;
    Actual: string;
    id: string;
}
export interface TrackGauge {
    Name: string;
    id: string;
    Actual: number;
    CostMultiplier: number;
}
export interface LoadingGauge {
    Name: string;
    id: string;
    Average: number;
    Min_No_Filler: number;
    Max_No_Filler: number;
    Cost_Multiplier: number;
    parallelTrackSpacing: number;
    trackClearance: number;
}
export interface PowerSupply {
    Name: string;
    id: string;
    Cost_Multiplier: number;
    Tunnel_Cost_Multiplier: number;
    Scissors_Cost_Multiplier: number;
}
export interface TrainType {
    Name: string;
    maxSpeedLocalStation: number;
    train_CostPerHour: number;
    car_CostPerHour: number;
    canCrossRoads: boolean;
    stopTimeSeconds: number;
    maxLateralAcceleration: number;
    maxSlopePercentage: number;
}
export interface AutomationLevel {
    Name: string;
    maxSpeedLocalStation: number;
    train_CostPerHour: number;
    car_CostPerHour: number;
    canCrossRoads: boolean;
    stopTimeSeconds: number;
    maxLateralAcceleration: number;
    baseTrackCost: number;
    baseStationCost: number;
    scissorsCrossoverCost: number;
}

export interface Region {
    Name: string;
    CountryCodes: string[];
}

export interface Nation {
    Name: string;
    Code: string;
    Region: string;
    CityCodes: string[];
}

export interface City {
    Name: string;
    Code: string;
    Region: string;
    Nation: string;
    NationCode: string;
}

export interface Tag {
    Name: string;
    Type: string;
    id: string;
}