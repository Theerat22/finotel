export interface HotelInfo {
    id?: string;
    name: string;
    type: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    rooms?: RoomInfo[];
  }
  
  export interface RoomInfo {
    id?: string;
    hotelId?: string;
    name: string;
    price: number;
    facilities: string[];
  }