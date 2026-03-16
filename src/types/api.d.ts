/** Subway Builder Modding API v1.0.0 */

import type { Coordinate, GameSpeed } from './core';
import type {
  Station,
  Track,
  Train,
  Route,
  DemandData,
  RidershipStats,
  LineMetric,
  ModeChoiceStats,
  CompletedCommute,
  StationRidership,
  RouteRidership,
} from './game-state';
import type { GameConstants } from './game-constants';
import type { Bond, BondType, BondResult } from './game-actions';
import type { CityConfig, City, CityTab, CityDataFiles } from './cities';
import type { TrainTypeConfig } from './trains';
import type { StationTypeConfig } from './stations';
import type {
  MapSource,
  MapLayer,
  TileURLOverride,
  LayerOverride,
  RoutingServiceOverride,
  RouteResult,
  DefaultLayerVisibility,
} from './map';
import type {
  BlueprintTrackInput,
  TrackGroupInput,
  PlaceBlueprintResult,
  BuildBlueprintsResult,
  CreateRouteOptions,
  CreateRouteResult,
  BuyTrainsResult,
  AddTrainResult,
  BlueprintCost,
} from './build';
import type {
  MissionConfig,
  CareerMetrics,
  CareerOperators,
  CareerRegions,
} from './career';
import type { NewspaperTemplate, TweetTemplate } from './content-templates';
import type { CommuteTimeRange } from './pop-timing';
import type {
  UIPlacement,
  NotificationType,
  Theme,
  UIButtonOptions,
  UIToggleOptions,
  UISliderOptions,
  UISelectOptions,
  UITextOptions,
  UISeparatorOptions,
  UIComponentOptions,
  UIToolbarButtonOptions,
  UIToolbarPanelOptions,
  UIFloatingPanelOptions,
  UIStyledButtonOptions,
  UIStyledToggleOptions,
  UIStyledSliderOptions,
  UIMainMenuButtonOptions,
} from './ui';
import type { I18nAPI } from './i18n';
import type { RechartsComponents } from './utils';
import type { GameSchemas } from './schemas';

// =============================================================================
// MODDING API INTERFACE
// =============================================================================

/**
 * The main Subway Builder Modding API.
 * Access via `window.SubwayBuilderAPI`.
 */
export interface ModdingAPI {
  /** Current API version string. */
  version: string;

  // ---------------------------------------------------------------------------
  // TOP-LEVEL METHODS
  // ---------------------------------------------------------------------------

  /** Register a new custom city. */
  registerCity(city: CityConfig): void;

  /** Modify game constants (partial update). */
  modifyConstants(constants: Partial<GameConstants>): void;

  /** Register newspaper article templates for in-game newspapers. */
  registerNewspaperTemplates(templates: NewspaperTemplate[]): void;

  /**
   * Register tweet templates for in-game social media.
   * @remarks May not be available in all game versions.
   */
  registerTweetTemplates(templates: TweetTemplate[]): void;

  /** Hot-reload all mods. Clears callbacks, UI components, custom layers/sources, and custom train types. */
  reloadMods(): Promise<void>;

  // ---------------------------------------------------------------------------
  // CITIES NAMESPACE
  // ---------------------------------------------------------------------------

  cities: {
    /** Register a city selection tab in the UI. */
    registerTab(tab: CityTab): void;
    /** Set the data file URLs for a custom city. */
    setCityDataFiles(cityCode: string, files: CityDataFiles): void;
    /** Get the data file URLs for a city. */
    getCityDataFiles(cityCode: string): CityDataFiles | undefined;
    /** Get all registered city tabs. */
    getTabs(): CityTab[];
  };

  // ---------------------------------------------------------------------------
  // MAP NAMESPACE
  // ---------------------------------------------------------------------------

  map: {
    /** Register a new map tile or data source. */
    registerSource(id: string, config: MapSource): void;
    /** Register a new map layer. */
    registerLayer(config: MapLayer): void;
    /** Register a complete map style URL. */
    registerStyle(styleUrl: string): void;
    /** Override tile URLs for a specific city. */
    setTileURLOverride(config: TileURLOverride): void;
    /** Override paint, filter, or source-layer for an existing map layer. */
    setLayerOverride(config: LayerOverride): void;
    /** Override the driving-route service for a city. */
    setRoutingServiceOverride(config: RoutingServiceOverride): void;
    /** Get the routing service override for a city. */
    getRoutingServiceOverride(cityCode: string): RoutingServiceOverride | undefined;
    /** Query a driving route between two points. */
    queryRoute(cityCode: string, origin: Coordinate, destination: Coordinate): Promise<RouteResult>;
    /** Set default visibility for built-in map layers in a city. */
    setDefaultLayerVisibility(cityCode: string, visibility: DefaultLayerVisibility): void;
    /** Get default visibility settings for a city. */
    getDefaultLayerVisibility(cityCode: string): DefaultLayerVisibility | undefined;
  };

  // ---------------------------------------------------------------------------
  // TRAINS NAMESPACE
  // ---------------------------------------------------------------------------

  trains: {
    /** Register a new custom train type. */
    registerTrainType(config: TrainTypeConfig): void;
    /** Modify an existing train type (partial update). */
    modifyTrainType(id: string, updates: Partial<TrainTypeConfig>): void;
    /** Get all registered train types. */
    getTrainTypes(): Record<string, TrainTypeConfig>;
    /** Get a single train type by ID. */
    getTrainType(id: string): TrainTypeConfig | undefined;
  };

  // ---------------------------------------------------------------------------
  // STATIONS NAMESPACE
  // ---------------------------------------------------------------------------

  stations: {
    /** Register a new custom station type. */
    registerStationType(config: StationTypeConfig): void;
    /** Modify an existing station type (partial update). */
    modifyStationType(id: string, updates: Partial<StationTypeConfig>): void;
    /** Get all registered station types. */
    getStationTypes(): Record<string, StationTypeConfig>;
    /** Get a single station type by ID. */
    getStationType(id: string): StationTypeConfig | undefined;
  };

  // ---------------------------------------------------------------------------
  // CAREER NAMESPACE
  // ---------------------------------------------------------------------------

  career: {
    /** Register a new career mission. */
    registerMission(config: MissionConfig): void;
    /** Unregister a previously registered mission. */
    unregisterMission(id: string): void;
    /** Get missions registered by this mod. */
    getMyMissions(): MissionConfig[];
    /** Get all registered missions from all mods. */
    getAllMissions(): MissionConfig[];
    /** Get all missions for a specific city. */
    getMissionsForCity(cityCode: string): MissionConfig[];
    /** Mission metric constants. */
    METRICS: CareerMetrics;
    /** Comparison operator constants. */
    OPERATORS: CareerOperators;
    /** Pre-defined geographic region bounding boxes. */
    REGIONS: CareerRegions;
  };

  // ---------------------------------------------------------------------------
  // UI NAMESPACE
  // ---------------------------------------------------------------------------

  ui: {
    // -- Component registration --

    /** Register a custom React component at a UI placement. */
    registerComponent(placement: UIPlacement, config: UIComponentOptions): void;
    /** Unregister a custom component from a UI placement. */
    unregisterComponent(placement: UIPlacement, id: string): void;
    /** Get all registered components at a placement. */
    getComponents(placement: UIPlacement): UIComponentOptions[];
    /** Force a UI update, optionally targeting a specific placement. */
    forceUpdate(placement?: string): void;

    // -- Notifications --

    /** Show a notification message. Defaults to 'info' type. */
    showNotification(message: string, type?: NotificationType): void;

    // -- Theme & Styling --

    /** Set the UI theme. */
    setTheme(theme: Theme): void;
    /** Get the current theme setting. */
    getTheme(): string;
    /** Get the resolved theme (actual 'light' or 'dark', resolving 'system'). */
    getResolvedTheme(): ('light'|'dark');
    /** Set the accent color. */
    setAccentColor(color: string): void;
    /** Set the primary color. */
    setPrimaryColor(color: string): void;
    /** Set an arbitrary CSS variable. */
    setCSSVariable(name: string, value: string): void;
    /** Reset all color customizations. */
    resetColors(): void;

    // -- UI Primitives --

    /** Add a button to a UI placement. */
    addButton(placement: UIPlacement, config: UIButtonOptions): void;
    /** Add a toggle to a UI placement. */
    addToggle(placement: UIPlacement, config: UIToggleOptions): void;
    /** Add a slider to a UI placement. */
    addSlider(placement: UIPlacement, config: UISliderOptions): void;
    /** Add a dropdown select to a UI placement. */
    addSelect(placement: UIPlacement, config: UISelectOptions): void;
    /** Add a text element to a UI placement. */
    addText(placement: UIPlacement, config: UITextOptions): void;
    /** Add a visual separator to a UI placement. */
    addSeparator(placement: UIPlacement, config: UISeparatorOptions): void;

    // -- Toolbar --

    /** Add a button to the main toolbar. */
    addToolbarButton(config: UIToolbarButtonOptions): void;
    /** Add a panel to the main toolbar. */
    addToolbarPanel(config: UIToolbarPanelOptions): void;

    // -- Floating panels --

    /** Add a draggable floating panel. */
    addFloatingPanel(config: UIFloatingPanelOptions): void;

    // -- Styled variants --

    /** Add a styled button (with variant support) to a UI placement. */
    addStyledButton(placement: UIPlacement, config: UIStyledButtonOptions): void;
    /** Add a styled toggle to a UI placement. */
    addStyledToggle(placement: UIPlacement, config: UIStyledToggleOptions): void;
    /** Add a styled slider (with optional value display) to a UI placement. */
    addStyledSlider(placement: UIPlacement, config: UIStyledSliderOptions): void;
    /** Add a button to the main menu. */
    addMainMenuButton(config: UIMainMenuButtonOptions): void;

    // -- Layer visibility --

    /** Get the list of available map layer IDs. */
    getAvailableLayers(): string[];
    /** Get the visibility of a specific map layer. */
    getLayerVisibility(layerId: string): boolean;
    /** Set the visibility of a specific map layer. */
    setLayerVisibility(layerId: string, visible: boolean): void;
    /** Get visibility state of all map layers. */
    getAllLayerVisibility(): Record<string, boolean>;
    /** Set visibility for multiple map layers at once. */
    setMultipleLayerVisibility(visibility: Record<string, boolean>): void;
  };

  // ---------------------------------------------------------------------------
  // HOOKS NAMESPACE
  // ---------------------------------------------------------------------------

  hooks: {
    /** Called when the game engine initializes. */
    onGameInit(callback: () => void): void;
    /** Called at the start of each new in-game day. */
    onDayChange(callback: (day: number) => void): void;
    /** Called when a city is loaded. */
    onCityLoad(callback: (cityCode: string) => void): void;
    /** Called when the MapLibre map instance is ready. */
    onMapReady(callback: (map: maplibregl.Map) => void): void;
    /** Called when a station is constructed. */
    onStationBuilt(callback: (station: Station) => void): void;
    /** Called when a station is deleted. */
    onStationDeleted(callback: (stationId: string) => void): void;
    /** Called when a new route is created. */
    onRouteCreated(callback: (route: Route) => void): void;
    /** Called when a route is deleted. */
    onRouteDeleted(callback: (routeId: string, routeBullet: string) => void): void;
    /** Called when tracks are built (constructed from blueprints). */
    onTrackBuilt(callback: (tracks: Track[]) => void): void;
    /** Called when blueprint tracks are placed on the map. */
    onBlueprintPlaced(callback: (tracks: Track[]) => void): void;
    /** Called when population/demand data changes. */
    onDemandChange(callback: (popCount: number) => void): void;
    /** Called when tracks are added or deleted. */
    onTrackChange(callback: (changeType: 'add' | 'delete', count: number) => void): void;
    /** Called when a new train is spawned on a route. */
    onTrainSpawned(callback: (train: Train) => void): void;
    /** Called when a train is removed. */
    onTrainDeleted(callback: (trainId: string, routeId: string) => void): void;
    /** Called when game pause state changes. */
    onPauseChanged(callback: (isPaused: boolean) => void): void;
    /** Called when game speed changes. */
    onSpeedChanged(callback: (newSpeed: GameSpeed) => void): void;
    /** Called when the player's money changes. */
    onMoneyChanged(callback: (newBalance: number, change: number, type: 'revenue' | 'expense', category?: string) => void): void;
    /** Called after the game is saved. */
    onGameSaved(callback: (saveName: string) => void): void;
    /** Called after a save is loaded. */
    onGameLoaded(callback: (saveName: string) => void): void;
    /** Called when a game warning occurs. */
    onWarning(callback: (message: string) => void): void;
    /** Called when a game error occurs. */
    onError(callback: (error: string) => void): void;
    /** Called when the game session ends. */
    onGameEnd(callback: () => void): void;
  };

  // ---------------------------------------------------------------------------
  // ACTIONS NAMESPACE
  // ---------------------------------------------------------------------------

  actions: {
    /** Add money to the player's budget. */
    addMoney(amount: number, category?: string): void;
    /** Subtract money from the player's budget. */
    subtractMoney(amount: number, category?: string): void;
    /** Set the player's budget to an exact amount. */
    setMoney(amount: number): void;
    /** Set the game's pause state. */
    setPause(paused: boolean): void;
    /** Set the game speed. */
    setSpeed(speed: GameSpeed): void;
    /** Set the ticket price. */
    setTicketPrice(price: number): void;
    /** Get the current ticket price. */
    getTicketPrice(): number;
    /** Issue a bond by type ID. */
    issueBond(bondTypeId: string): BondResult;
    /** Pay down a bond. */
    payBond(bondId: string, amount: number): BondResult;
    /** Get all active bonds. */
    getBonds(): Bond[];
    /** Set a speed multiplier for a specific game speed. */
    setSpeedMultiplier(speed: GameSpeed, multiplier: number): void;
  };

  // ---------------------------------------------------------------------------
  // GAME STATE NAMESPACE
  // ---------------------------------------------------------------------------

  gameState: {
    /** Get all stations. */
    getStations(): Station[];
    /** Get all routes. */
    getRoutes(): Route[];
    /** Get all tracks. */
    getTracks(): Track[];
    /** Get all trains. */
    getTrains(): Train[];
    /** Get the current demand data, or null if not loaded. */
    getDemandData(): DemandData | null;
    /** Get the current in-game day. */
    getCurrentDay(): number;
    /** Get the current in-game hour (0-23). */
    getCurrentHour(): number;
    /** Get elapsed game time in seconds. */
    getElapsedSeconds(): number;
    /** Get the player's current budget. */
    getBudget(): number;
    /** Get the current ticket price. */
    getTicketPrice(): number;
    /** Get the current game speed. */
    getGameSpeed(): GameSpeed;
    /** Check if the game is paused. */
    isPaused(): boolean;
    /** Get all active bonds. */
    getBonds(): Bond[];
    /** Get all available bond types. */
    getBondTypes(): Record<string, BondType>;
    /** Get aggregate ridership statistics. */
    getRidershipStats(): RidershipStats;
    /** Get per-route ridership metrics. */
    getLineMetrics(): LineMetric[];
    /** Calculate the cost of constructing the given blueprint tracks. */
    calculateBlueprintCost(tracks: Track[]): BlueprintCost;
    /** Get mode choice statistics (walking, driving, transit, unknown). */
    getModeChoiceStats(): ModeChoiceStats;
    /** Get all completed commutes in the current time window. */
    getCompletedCommutes(): CompletedCommute[];
    /** Get ridership for a specific station, or aggregate station ridership if no ID is given. */
    getStationRidership(stationId?: string | null): StationRidership;
    /** Get ridership broken down by station for a specific route. */
    getRouteRidership(routeId?: string | null): RouteRidership;
  };

  // ---------------------------------------------------------------------------
  // BUILD NAMESPACE
  // ---------------------------------------------------------------------------

  build: {
    /** Place blueprint tracks on the map. */
    placeBlueprintTracks(tracks: BlueprintTrackInput[], groups?: TrackGroupInput[]): PlaceBlueprintResult;
    /** Construct all placed blueprints. */
    buildBlueprints(): Promise<BuildBlueprintsResult>;
    /** Erase all placed blueprints. */
    eraseBlueprints(): void;
    /** Undo the last blueprint placement. */
    undoBlueprint(): void;
    /** Redo the last undone blueprint placement. */
    redoBlueprint(): void;
    /** Get the total cost of all placed blueprints. */
    getBlueprintCost(): number;
    /** Get the number of placed blueprint tracks. */
    getBlueprintCount(): number;
    /** Create a new route. */
    createRoute(options?: CreateRouteOptions): CreateRouteResult;
    /** Delete a route by ID. */
    deleteRoute(id: string): boolean;
    /** Purchase trains of a specific type. */
    buyTrains(count: number, type: string): BuyTrainsResult;
    /** Add a train to a route at a specific station index. */
    addTrainToRoute(routeId: string, stationIdx: number): AddTrainResult;
    /** Delete a train by ID. */
    deleteTrain(id: string): boolean;
  };

  // ---------------------------------------------------------------------------
  // POP TIMING NAMESPACE
  // ---------------------------------------------------------------------------

  popTiming: {
    /** Get the current commute time ranges. */
    getCommuteTimeRanges(): CommuteTimeRange[];
    /** Set custom commute time ranges. Hours in 24-hour format (0-23). */
    setCommuteTimeRanges(ranges: CommuteTimeRange[]): void;
    /** Reset commute time ranges to defaults. */
    resetCommuteTimeRanges(): void;
  };

  // ---------------------------------------------------------------------------
  // STORAGE NAMESPACE
  // ---------------------------------------------------------------------------

  /**
   * Persistent key-value storage for mod data.
   * @remarks Electron only. In browser, storage operations are no-ops
   * (set does nothing, get returns defaultValue, keys returns []).
   */
  storage: {
    /** Store a JSON-serializable value. */
    set(key: string, value: unknown): Promise<void>;
    /** Retrieve a stored value, or the default if not found. */
    get<T = unknown>(key: string, defaultValue?: T): Promise<T>;
    /** Delete a stored value. */
    delete(key: string): Promise<void>;
    /** Get all stored keys. */
    keys(): Promise<string[]>;
  };

  // ---------------------------------------------------------------------------
  // UTILS NAMESPACE
  // ---------------------------------------------------------------------------

  utils: {
    /** Get all registered cities. */
    getCities(): City[];
    /** Get the current game constants. */
    getConstants(): GameConstants;
    /** Get the MapLibre map instance, or null if not loaded. */
    getMap(): maplibregl.Map | null;
    /** Get the current city code. */
    getCityCode(): string;
    /**
     * Load city data from a path. Use instead of `fetch()` for Electron compatibility.
     */
    loadCityData(path: string): Promise<unknown>;
    /** React library instance. */
    React: typeof import('react');
    /** Lucide icon components (PascalCase names). */
    icons: Record<string, React.ComponentType<any>>;
    /** Shared UI components from the game. */
    components: {
      Button: React.ComponentType<any>;
      Card: React.ComponentType<any>;
      CardContent: React.ComponentType<any>;
      CardDescription: React.ComponentType<any>;
      CardHeader: React.ComponentType<any>;
      CardTitle: React.ComponentType<any>;
      Progress: React.ComponentType<any>;
      Slider: React.ComponentType<any>;
      Switch: React.ComponentType<any>;
      Label: React.ComponentType<any>;
      Input: React.ComponentType<any>;
      Badge: React.ComponentType<any>;
      Tooltip: React.ComponentType<any>;
      TooltipContent: React.ComponentType<any>;
      TooltipProvider: React.ComponentType<any>;
      TooltipTrigger: React.ComponentType<any>;
      SubwayButton: React.ComponentType<any>;
      MainMenuButton: React.ComponentType<any>;
    };
    /** Recharts charting library components. */
    charts: RechartsComponents;
    /** Internationalization API. */
    i18n: I18nAPI;
  };

  // ---------------------------------------------------------------------------
  // SCHEMAS NAMESPACE
  // ---------------------------------------------------------------------------

  /** Zod validation schemas for city data files. */
  schemas: GameSchemas;
}
