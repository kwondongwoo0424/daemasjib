import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Restaurant } from '../types';

const COLLECTION_NAME = 'restaurants';

export const restaurantService = {
  async cacheRestaurant(restaurant: Restaurant): Promise<string> {
    const existing = await this.findByExternalId(restaurant.id);
    if (existing) {
      return existing.id!;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...restaurant,
      cachedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async findByExternalId(externalId: string): Promise<Restaurant | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('id', '==', externalId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Restaurant;
  },

  async searchByRegion(region: string): Promise<Restaurant[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('region', '==', region)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Restaurant));
  },

  async searchByCategory(category: string): Promise<Restaurant[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Restaurant));
  },

  async getRestaurantById(restaurantId: string): Promise<Restaurant | null> {
    const docRef = doc(db, COLLECTION_NAME, restaurantId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Restaurant;
  }
};
