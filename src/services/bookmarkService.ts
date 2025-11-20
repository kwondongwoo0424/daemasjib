import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import type { BookmarkGroup, Bookmark } from '../types';

const GROUP_COLLECTION = 'bookmark_groups';
const BOOKMARK_COLLECTION = 'bookmarks';

export const bookmarkService = {
  async createGroup(userId: string, groupName: string): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, GROUP_COLLECTION), {
      userId,
      groupName,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async getGroupsByUserId(userId: string): Promise<BookmarkGroup[]> {
    const q = query(
      collection(db, GROUP_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as BookmarkGroup));
  },

  async updateGroupName(groupId: string, newName: string): Promise<void> {
    const docRef = doc(db, GROUP_COLLECTION, groupId);
    await updateDoc(docRef, {
      groupName: newName,
      updatedAt: Timestamp.now()
    });
  },

  async deleteGroup(groupId: string): Promise<void> {
    const bookmarksQuery = query(
      collection(db, BOOKMARK_COLLECTION),
      where('groupId', '==', groupId)
    );
    const bookmarksSnapshot = await getDocs(bookmarksQuery);
    
    const deletePromises = bookmarksSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    const groupRef = doc(db, GROUP_COLLECTION, groupId);
    await deleteDoc(groupRef);
  },

  async addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, BOOKMARK_COLLECTION), {
      ...bookmark,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getBookmarksByGroupId(groupId: string): Promise<Bookmark[]> {
    const q = query(
      collection(db, BOOKMARK_COLLECTION),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Bookmark));
  },

  async getBookmarksByUserId(userId: string): Promise<Bookmark[]> {
    const q = query(
      collection(db, BOOKMARK_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Bookmark));
  },

  async deleteBookmark(bookmarkId: string): Promise<void> {
    const docRef = doc(db, BOOKMARK_COLLECTION, bookmarkId);
    await deleteDoc(docRef);
  },

  async checkBookmarkExists(userId: string, restaurantId: string, groupId: string): Promise<boolean> {
    const q = query(
      collection(db, BOOKMARK_COLLECTION),
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId),
      where('groupId', '==', groupId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
};
