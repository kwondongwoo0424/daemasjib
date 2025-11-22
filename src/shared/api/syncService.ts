import { daeguFoodService } from './daeguFoodService';
import { restaurantService } from '@/entities/restaurant/api/restaurantService';

export const syncService = {
  // 전체 동기화 (9개 지역 모두)
  async syncAllRestaurants(): Promise<{ total: number; new: number }> {
    
    try {
      // 1. 공공 API에서 모든 지역 데이터 가져오기
      const apiData = await daeguFoodService.searchAll();
      
      // 2. Restaurant 타입으로 변환
      const restaurants = apiData.map(item => daeguFoodService.convertToRestaurant(item));
      
      // 3. DB에 저장 (중복 자동 제외)
      const newCount = await restaurantService.bulkCacheRestaurants(restaurants);
      
      // 4. 동기화 시간 기록
      await restaurantService.updateSyncMetadata();
      
      return {
        total: apiData.length,
        new: newCount
      };
    } catch (error) {
      console.error('동기화 실패:', error);
      throw error;
    }
  },

  // 일주일 지났으면 자동 동기화
  async syncIfNeeded(): Promise<{ synced: boolean; result?: { total: number; new: number } }> {
    const shouldSync = await restaurantService.shouldSync();
    
    if (!shouldSync) {
      await restaurantService.getLastSyncTime();
      return { synced: false };
    }
    
    const result = await this.syncAllRestaurants();
    return { synced: true, result };
  },

  // 지역별 맛집 조회 (DB에서)
  async getRestaurantsByRegion(region: string, forceSync = false): Promise<any[]> {
    if (forceSync || await restaurantService.shouldSync()) {
      await this.syncIfNeeded();
    }
    
    return restaurantService.searchByRegion(region);
  },

  // 전체 맛집 조회 (DB에서)
  async getAllCachedRestaurants(forceSync = false): Promise<any[]> {
    if (forceSync || await restaurantService.shouldSync()) {
      await this.syncIfNeeded();
    }
    
    return restaurantService.getAllRestaurants();
  }
};
