export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  category?: string;
  phone?: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

export interface Visit {
  id?: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  visitedAt: Date;
  rating?: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkGroup {
  id?: string;
  userId: string;
  groupName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id?: string;
  userId: string;
  groupId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  createdAt: Date;
}
