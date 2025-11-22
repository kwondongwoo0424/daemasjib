### 컬러 팔레트
- 메인 컬러: Orange (#F97316 - orange-500)
  * 주요 버튼, 아이콘, 강조 요소
  * Hover: orange-600 (#EA580C)

- 보조 컬러:
  * Blue (#3B82F6 - blue-500) - 수정 버튼
  * Red (#EF4444 - red-500) - 삭제/경고
  * Yellow (#EAB308 - yellow-500) - 별점
  * Green/Pink/Purple - 카테고리별 구분

- 중립 컬러:
  * Gray 50-900 - 텍스트, 배경, 테두리
  * White (#FFFFFF) - 카드, 모달 배경

### 타이포그래피
- 기본 폰트: 시스템 폰트 (sans-serif)
- 제목: text-lg ~ text-2xl, font-bold
- 본문: text-sm ~ text-base
- 작은 텍스트: text-xs

### 버튼 스타일
1. 주요 버튼 (Primary)
   - 배경: orange-500
   - Hover: orange-600
   - 텍스트: white
   - 예: 로그인, 방문기록 추가

2. 보조 버튼 (Secondary)
   - 배경: gray-100
   - Hover: gray-200
   - 텍스트: gray-700
   - 예: 취소 버튼

3. 액션 버튼
   - 수정: blue-50 배경, blue-600 텍스트
   - 삭제: red-50 배경, red-600 텍스트

### 입력 필드
- 기본 스타일:
  * 테두리: border border-gray-300
  * 배경: white
  * 패딩: px-4 py-3
  * 라운딩: rounded-lg

- Focus 상태:
  * ring-2 ring-orange-500
  * border-transparent

### 카드 컴포넌트
- 배경: white
- 그림자: shadow-md
- Hover: shadow-xl
- 라운딩: rounded-xl
- 오버플로우: overflow-hidden

### 모달
- 배경 오버레이:
  * 반투명 검정 (rgba(0,0,0,0.5))
  * 블러 효과 (backdrop-filter: blur(4px))
- 모달 박스:
  * 배경: white
  * 라운딩: rounded-2xl
  * 패딩: p-6
  * 그림자: shadow-2xl
