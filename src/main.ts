/**
 * My Subway Builder Mod
 * Entry point for the mod.
 */

import { TrainPanel } from './ui/TrainPanel';

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

  // Initialize mod when map is ready
  api.hooks.onMapReady((_map) => {
    if (initialized) return;
    initialized = true;

    try {
      // Example: Add a floating panel with a React component
      api.ui.addFloatingPanel({
        id: 'registerPanel',
        title: 'Dan Trains Registration Menu',
        icon: 'TrainTrack',
        render: TrainPanel,
      });

      
      console.log(`${TAG} Initialized successfully.`);
    } catch (err) {
      console.error(`${TAG} Failed to initialize:`, err);
      api.ui.showNotification(`${MOD_ID} failed to load. Check console for details.`, 'error');
    }
  });


}
