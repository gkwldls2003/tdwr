export interface Markers {
    id: number;
    name:string;
    price:number;
    latitude: number;
    longitude: number;
    description:string;
  }
  
  export interface MarkerState {
    allMarkers: Markers[];
    visibleMarkers: Markers[];
    isLoading: boolean;
    error: string | null;
  }