import { useState } from 'react';
import { restaurantService } from '../../../services/restaurantService';
import type { Restaurant } from '../../../types';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByRegion = async (region: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.searchByRegion(region);
      setRestaurants(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.searchByCategory(category);
      setRestaurants(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cacheRestaurant = async (restaurant: Omit<Restaurant, 'cachedAt'>) => {
    try {
      setError(null);
      const id = await restaurantService.cacheRestaurant(restaurant);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getRestaurantById = async (id: string) => {
    try {
      setError(null);
      const restaurant = await restaurantService.getRestaurantById(id);
      return restaurant;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    restaurants,
    loading,
    error,
    searchByRegion,
    searchByCategory,
    cacheRestaurant,
    getRestaurantById,
  };
};
