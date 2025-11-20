import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Visit } from '../types';

const COLLECTION_NAME = 'visits';

export const visitService = {
  async createVisit(visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...visit,
      visitedAt: Timestamp.fromDate(visit.visitedAt),
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async getVisitsByUserId(userId: string): Promise<Visit[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('visitedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      visitedAt: doc.data().visitedAt.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Visit));
  },

  async getVisitById(visitId: string): Promise<Visit | null> {
    const docRef = doc(db, COLLECTION_NAME, visitId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      visitedAt: data.visitedAt.toDate(),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Visit;
  },

  async updateVisit(visitId: string, updates: Partial<Omit<Visit, 'id' | 'userId' | 'createdAt'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, visitId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    if (updates.visitedAt) {
      updateData.visitedAt = Timestamp.fromDate(updates.visitedAt);
    }
    
    await updateDoc(docRef, updateData);
  },

  async deleteVisit(visitId: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, visitId);
    await deleteDoc(docRef);
  },

  async getVisitsByRestaurant(userId: string, restaurantId: string): Promise<Visit[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId),
      orderBy('visitedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      visitedAt: doc.data().visitedAt.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Visit));
  }
};
