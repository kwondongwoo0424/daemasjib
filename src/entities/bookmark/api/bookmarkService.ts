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
import { db } from '@/shared/config/firebase/config';
import type { BookmarkGroup, Bookmark } from '@/shared/types';

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

  // Alias for compatibility
  async createBookmarkGroup(data: { userId: string; groupName: string; createdAt: Date; updatedAt: Date }): Promise<string> {
    return this.createGroup(data.userId, data.groupName);
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

  // Alias for compatibility
  async getBookmarkGroups(userId: string): Promise<BookmarkGroup[]> {
    return this.getGroupsByUserId(userId);
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

  async addBookmark(bookmark: { userId: string; groupId: string; restaurantId: string; restaurantName: string; restaurantAddress: string; createdAt: Date }): Promise<string> {
    const docRef = await addDoc(collection(db, BOOKMARK_COLLECTION), {
      userId: bookmark.userId,
      groupId: bookmark.groupId,
      restaurantId: bookmark.restaurantId,
      restaurantName: bookmark.restaurantName,
      restaurantAddress: bookmark.restaurantAddress,
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
    try {

      // 인덱스 없이도 작동하도록 orderBy 제거
      const q = query(
        collection(db, BOOKMARK_COLLECTION),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);

      const bookmarks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        } as Bookmark;
      });

      // 클라이언트 사이드에서 정렬
      return bookmarks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('[Bookmark Debug] Error fetching bookmarks:', error);
      throw error;
    }
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
