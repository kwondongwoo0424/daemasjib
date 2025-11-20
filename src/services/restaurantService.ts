import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Restaurant } from '../types';

const COLLECTION_NAME = 'restaurants';
const SYNC_METADATA_COLLECTION = 'sync_metadata';

export const restaurantService = {
  async cacheRestaurant(restaurant: Restaurant): Promise<string> {
    const existing = await this.findByExternalId(restaurant.externalId || restaurant.id);
    if (existing) {
      return existing.id!;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...restaurant,
      cachedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async bulkCacheRestaurants(restaurants: Restaurant[]): Promise<number> {
    let count = 0;
    const batchSize = 500;
    
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = writeBatch(db);
      const chunk = restaurants.slice(i, i + batchSize);
      
      for (const restaurant of chunk) {
        const existing = await this.findByExternalId(restaurant.externalId || restaurant.id);
        if (!existing) {
          const docRef = doc(collection(db, COLLECTION_NAME));
          batch.set(docRef, {
            ...restaurant,
            cachedAt: Timestamp.now()
          });
          count++;
        }
      }
      
      if (count > 0) {
        try {
          await batch.commit();
          console.log(`💾 ${count}개 저장 완료 (배치 ${Math.floor(i / batchSize) + 1})`);
        } catch (error) {
          console.error('배치 저장 실패:', error);
          throw error;
        }
      }
    }
    
    return count;
  },

  async updateSyncMetadata(): Promise<void> {
    await addDoc(collection(db, SYNC_METADATA_COLLECTION), {
      syncedAt: Timestamp.now(),
      type: 'daegu_food_api'
    });
  },

  async getLastSyncTime(): Promise<Date | null> {
    const q = query(
      collection(db, SYNC_METADATA_COLLECTION),
      where('type', '==', 'daegu_food_api')
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    
    const docs = querySnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => b.syncedAt.toMillis() - a.syncedAt.toMillis());
    
    if (docs.length === 0) return null;
    return docs[0].syncedAt.toDate();
  },

  async shouldSync(): Promise<boolean> {
    const lastSync = await this.getLastSyncTime();
    if (!lastSync) return true;
    
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - lastSync.getTime() > oneWeek;
  },

  async findByExternalId(externalId: string): Promise<Restaurant | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('externalId', '==', externalId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data()
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
  },

  async getAllRestaurants(): Promise<Restaurant[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Restaurant));
  }
};
