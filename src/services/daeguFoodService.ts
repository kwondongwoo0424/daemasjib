export interface DaeguFoodItem {
  cnt: string;
  OPENDATA_ID: string;
  GNG_CS: string;
  FD_CS: string;
  BZ_NM: string;
  TLNO: string;
  MBZ_HR: string;
  SEAT_CNT: string;
  PKPL: string;
  HP: string;
  PSB_FRN: string;
  BKN_YN: string;
  INFN_FCL: string;
  BRFT_YN: string;
  DSSRT_YN: string;
  MNU: string;
  SMPL_DESC: string;
  SBW: string;
  BUS: string;
}

export interface DaeguFoodResponse {
  status: string;
  total: string;
  data: DaeguFoodItem[];
}

export const daeguFoodService = {
  async searchByRegion(region: string): Promise<DaeguFoodItem[]> {
    try {
      const url = `https://www.daegufood.go.kr/kor/api/tasty.html?mode=json&addr=${encodeURIComponent(region)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DaeguFoodResponse = await response.json();
      
      if (data.status !== 'DONE') {
        throw new Error('API returned non-DONE status');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Daegu Food API Error:', error);
      throw error;
    }
  },

  async searchAll(): Promise<DaeguFoodItem[]> {
    const regions = ['동구', '서구', '남구', '북구', '수성구', '달서구', '중구', '달성군', '군위군'];
    const allRestaurants: DaeguFoodItem[] = [];
    
    for (const region of regions) {
      try {
        const items = await this.searchByRegion(region);
        allRestaurants.push(...items);
        console.log(`✅ ${region}: ${items.length}개 맛집`);
      } catch (error) {
        console.error(`❌ ${region} 조회 실패:`, error);
      }
    }
    
    return allRestaurants;
  },

  convertToRestaurant(item: DaeguFoodItem) {
    return {
      id: `daegu-${item.OPENDATA_ID}`,
      externalId: item.OPENDATA_ID,
      name: item.BZ_NM,
      address: item.GNG_CS,
      phone: item.TLNO,
      region: this.extractRegion(item.GNG_CS),
      category: item.FD_CS,
      businessHours: item.MBZ_HR,
      menu: item.MNU,
      description: item.SMPL_DESC,
      parking: item.PKPL,
      seatCount: item.SEAT_CNT,
      reservationAvailable: item.BKN_YN === '가능'
    };
  },

  extractRegion(address: string): string {
    const match = address.match(/대구광역시?\s*([\w가-힣]+구|[\w가-힣]+군)/);
    return match ? match[1] : '기타';
  }
};
