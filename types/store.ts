export interface TradingHours {
  open_now?: boolean
  periods?: Array<{
    open: { day: number; hour: number; minute: number }
    close?: { day: number; hour: number; minute: number }
  }>
  weekday_text?: string[]
}

export interface Store {
  id: string;
  name: string;
  street: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  google_maps_embed_url: string | null;
  uber_url: string;
  email: string;
  google_url: string;
  google_rating: number | null;
  google_user_ratings_total: number | null;
  google_trading_hours: TradingHours | null;
  google_last_synced_at: string | null;
}

export interface StorePhoto {
  id: string;
  store_id: string;
  photo_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface EnrichedStore extends Store {
  rating?: GoogleRating;
  tradingHours?: TradingHours;
  photos?: StorePhoto[];
}

// Additional types for Google Places API
export interface GoogleRating {
  value: number;
  total: number;
}

export interface TradingHours {
  open_now?: boolean;
  periods?: Array<{
    open: { day: number; hour: number; minute: number };
    close?: { day: number; hour: number; minute: number };
  }>;
  weekday_text?: string[];
}