import { mapFeatureKey, State as MapState } from "./map.reducer";

export interface AppState {
    [mapFeatureKey]: MapState;
  }
  