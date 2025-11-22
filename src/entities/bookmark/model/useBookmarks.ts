import { useState, useEffect } from 'react';
import { bookmarkService } from '../api/bookmarkService';
import type { BookmarkGroup, Bookmark } from '@/shared/types';

export const useBookmarkGroups = (userId: string | undefined) => {
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadGroups();
    }
  }, [userId]);

  const loadGroups = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await bookmarkService.getGroupsByUserId(userId);
      setGroups(data);
    } catch (err: any) {
      console.error('❌ 그룹 로딩 에러:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name: string) => {
    if (!userId) return;

    try {
      setError(null);
      const id = await bookmarkService.createGroup(userId, name);
      await loadGroups();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateGroupName = async (groupId: string, newName: string) => {
    try {
      setError(null);
      await bookmarkService.updateGroupName(groupId, newName);
      await loadGroups();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      setError(null);
      await bookmarkService.deleteGroup(groupId);
      await loadGroups();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroupName,
    deleteGroup,
    refresh: loadGroups,
  };
};

export const useBookmarks = (groupId: string | undefined) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      loadBookmarks();
    }
  }, [groupId]);

  const loadBookmarks = async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const data = await bookmarkService.getBookmarksByGroupId(groupId);
      setBookmarks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const id = await bookmarkService.addBookmark({
        ...bookmarkData,
        createdAt: new Date()
      });
      await loadBookmarks();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      setError(null);
      await bookmarkService.deleteBookmark(bookmarkId);
      await loadBookmarks();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    bookmarks,
    loading,
    error,
    addBookmark,
    deleteBookmark,
    refresh: loadBookmarks,
  };
};
