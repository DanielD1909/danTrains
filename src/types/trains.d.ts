/** Subway Builder Modding API v1.0.0 */

import type { ElevationType } from './core';

// =============================================================================
// TRAIN TYPE STATS
// =============================================================================

/** Performance and cost statistics for a train type. */
export interface TrainTypeStats {
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
  parallelTrackSpacing: number;
  stopTimeSeconds: number;
}

// =============================================================================
// TRAIN TYPE CONFIGURATION
// =============================================================================

/**
 * Configuration for a custom train type, used with `api.trains.registerTrainType()`.
 *
 * Elevation multipliers affect construction costs at different depths/heights:
 * - DEEP_BORE: below -30m
 * - STANDARD_TUNNEL: -30m to -8m
 * - CUT_AND_COVER: -8m to -3m
 * - AT_GRADE: -3m to 4.5m
 * - ELEVATED: above 4.5m
 */
export interface TrainTypeConfig {
  /** Unique identifier for this train type */
  id: string;
  /** Display name */
  name: string;
  /** Description of this train type */
  description: string;
  /** Performance and cost statistics */
  stats: TrainTypeStats;
  /** Track types this train can run on (e.g. ["heavy-metro"]) */
  compatibleTrackTypes: string[];
  /** Visual appearance settings */
  appearance: {
    /** Hex color for the train (e.g. "#FF0000") */
    color: string;
  };
  /** Cost multipliers for each elevation type */
  elevationMultipliers?: Partial<Record<ElevationType, number>>;
  /** Whether this train type can cross roads at grade level */
  allowAtGradeRoadCrossing?: boolean;
  Manufacturer?: string[];
}

/** Alias for TrainTypeConfig. */
export type TrainType = TrainTypeConfig;
