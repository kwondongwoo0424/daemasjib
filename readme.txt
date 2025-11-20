===========================================
        대맛집 UI 스타일 가이드
===========================================

프로젝트명: 대맛집 (Daemasjib)
목적: 개인 맛집 기록 및 관리 웹 애플리케이션


1. 컬러 팔레트
===========================================

Primary Colors:
  - Primary: DaisyUI의 기본 primary 색상 (파란색 계열)
  - Secondary: DaisyUI의 기본 secondary 색상 (보라색 계열)
  - Accent: DaisyUI의 기본 accent 색상 (강조 색상)

Neutral Colors:
  - Base-100: 메인 배경 (흰색/밝은 회색)
  - Base-200: 보조 배경 (연한 회색)
  - Base-300: 경계선/구분선
  - Base-content: 기본 텍스트

Semantic Colors:
  - Success: 성공 메시지 (녹색)
  - Error: 오류 메시지 (빨간색)
  - Warning: 경고 메시지 (노란색)
  - Info: 정보 메시지 (파란색)

사용 원칙:
  - Primary: 주요 액션 버튼, 링크, 강조 요소
  - Base-100: 카드 배경, 모달 배경
  - Base-200: 페이지 배경
  - Semantic Colors: 상태별 알림 및 피드백


2. 타이포그래피
===========================================

폰트 패밀리:
  - 기본: 시스템 폰트 스택 (DaisyUI 기본값)
  - 한글: -apple-system, BlinkMacSystemFont, "Segoe UI", 맑은 고딕
  - 영문: Inter, Roboto, sans-serif

폰트 크기:
  - text-xs: 12px - 작은 라벨, 부가 정보
  - text-sm: 14px - 일반 텍스트, 입력 필드
  - text-base: 16px - 기본 본문
  - text-lg: 18px - 소제목
  - text-xl: 20px - 카드 제목
  - text-2xl: 24px - 섹션 제목
  - text-3xl: 30px - 페이지 제목
  - text-4xl: 36px - 메인 제목

폰트 굵기:
  - font-normal: 400 - 일반 텍스트
  - font-medium: 500 - 강조 텍스트
  - font-semibold: 600 - 서브 헤딩
  - font-bold: 700 - 제목


3. 버튼
===========================================

버튼 종류:
  1. Primary Button
     - 클래스: btn btn-primary
     - 용도: 주요 액션 (로그인, 저장, 확인 등)
     - 예시: <button class="btn btn-primary">확인</button>

  2. Secondary Button
     - 클래스: btn btn-secondary
     - 용도: 보조 액션
     - 예시: <button class="btn btn-secondary">취소</button>

  3. Ghost Button
     - 클래스: btn btn-ghost
     - 용도: 네비게이션, 부드러운 액션
     - 예시: <button class="btn btn-ghost">뒤로</button>

버튼 크기:
  - btn-xs: 매우 작은 버튼
  - btn-sm: 작은 버튼
  - (기본): 일반 버튼
  - btn-lg: 큰 버튼

버튼 상태:
  - disabled: 비활성화 상태
  - loading: 로딩 중 (btn-disabled와 함께 사용)


4. 입력 필드
===========================================

기본 입력 필드:
  - 클래스: input input-bordered
  - 예시: <input type="text" class="input input-bordered" />

입력 필드 크기:
  - input-sm: 작은 입력 필드
  - (기본): 일반 입력 필드
  - input-lg: 큰 입력 필드

입력 필드 상태:
  - input-error: 오류 상태
  - input-success: 성공 상태
  - input-disabled: 비활성화 상태

폼 구조:
  <div class="form-control">
    <label class="label">
      <span class="label-text">라벨</span>
    </label>
    <input type="text" class="input input-bordered" />
    <label class="label">
      <span class="label-text-alt">도움말 텍스트</span>
    </label>
  </div>


5. 카드
===========================================

기본 카드:
  - 클래스: card bg-base-100 shadow-xl
  - 예시:
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">제목</h2>
        <p>내용</p>
        <div class="card-actions">
          <button class="btn btn-primary">액션</button>
        </div>
      </div>
    </div>

카드 변형:
  - 호버 효과: hover:shadow-2xl transition-shadow
  - 클릭 가능: cursor-pointer


6. 알림/피드백
===========================================

Alert 컴포넌트:
  1. Success Alert
     - 클래스: alert alert-success
     - 용도: 성공 메시지

  2. Error Alert
     - 클래스: alert alert-error
     - 용도: 오류 메시지

  3. Warning Alert
     - 클래스: alert alert-warning
     - 용도: 경고 메시지

  4. Info Alert
     - 클래스: alert alert-info
     - 용도: 정보 메시지

예시:
  <div class="alert alert-error">
    <span>오류가 발생했습니다</span>
  </div>

Loading Spinner:
  - 클래스: loading loading-spinner
  - 크기: loading-xs, loading-sm, loading-md, loading-lg


7. 레이아웃 및 반응형 디자인
===========================================

컨테이너:
  - container mx-auto: 중앙 정렬 컨테이너
  - max-w-md: 최대 너비 448px (폼, 좁은 콘텐츠)
  - max-w-4xl: 최대 너비 896px (일반 콘텐츠)
  - max-w-7xl: 최대 너비 1280px (넓은 콘텐츠)

간격:
  - p-4: 패딩 16px
  - p-8: 패딩 32px
  - gap-4: 간격 16px
  - gap-6: 간격 24px
  - mb-4: 하단 마진 16px

그리드 시스템 (Tailwind 브레이크포인트):
  - 모바일 (기본): grid-cols-1
  - sm (640px+): sm:grid-cols-2
  - md (768px+): md:grid-cols-2
  - lg (1024px+): lg:grid-cols-3
  - xl (1280px+): xl:grid-cols-4

예시:
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- 카드들 -->
  </div>

반응형 텍스트:
  - text-xl md:text-2xl lg:text-3xl
  - 모바일에서 작게, 큰 화면에서 크게

반응형 패딩:
  - p-4 md:p-6 lg:p-8
  - 화면 크기에 따라 패딩 증가


8. 네비게이션
===========================================

Navbar:
  - 클래스: navbar bg-base-100 shadow-lg
  - 구조:
    <div class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">로고</a>
      </div>
      <div class="flex-none">
        <!-- 네비게이션 항목 -->
      </div>
    </div>

Tabs:
  - 클래스: tabs tabs-boxed
  - 예시:
    <div class="tabs tabs-boxed">
      <a class="tab tab-active">탭1</a>
      <a class="tab">탭2</a>
    </div>


9. 상태별 UI 가이드라인
===========================================

로딩 상태:
  - 버튼: disabled 속성 + "로딩 중..." 텍스트
  - 페이지: 중앙에 loading spinner 표시
  - 리스트: skeleton 또는 loading spinner

성공 상태:
  - alert alert-success 컴포넌트 사용
  - 3초 후 자동 사라짐 (선택사항)
  - 체크 아이콘과 함께 표시

오류 상태:
  - alert alert-error 컴포넌트 사용
  - 명확한 오류 메시지 표시
  - 재시도 버튼 제공 (필요시)

빈 상태:
  - 중앙 정렬 메시지
  - 안내 텍스트 + 액션 버튼
  - 예: "아직 기록이 없습니다" + "추가하기" 버튼


10. 접근성 가이드라인
===========================================

  - 모든 입력 필드에 label 제공
  - 버튼에 명확한 텍스트 사용
  - 충분한 색상 대비
  - 키보드 네비게이션 지원
  - 의미있는 HTML 태그 사용 (button, input, label 등)


11. 애니메이션 및 트랜지션
===========================================

  - transition-all: 모든 속성 트랜지션
  - transition-shadow: 그림자 트랜지션
  - hover:shadow-2xl: 호버 시 그림자 강화
  - duration-200: 200ms 트랜지션
  - ease-in-out: 부드러운 가속/감속

예시:
  - 카드 호버: hover:shadow-2xl transition-shadow
  - 버튼 호버: hover:scale-105 transition-transform


12. 사용 예시
===========================================

폼 페이지:
  - 배경: bg-base-200
  - 카드: max-w-md, 중앙 정렬
  - 입력 필드: input-bordered, 전체 너비
  - 버튼: btn-primary, 전체 너비

리스트 페이지:
  - 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - 카드: shadow-xl, hover:shadow-2xl
  - 간격: gap-6

대시보드 페이지:
  - 컨테이너: container mx-auto p-8
  - 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - 카드: 클릭 가능, cursor-pointer


===========================================
        업데이트 히스토리
===========================================

v1.0 - 2025-11-20
  - 초기 UI 스타일 가이드 작성
  - DaisyUI + Tailwind CSS 기반 가이드
  - 반응형 디자인 원칙 수립
  - 상태별 UI 가이드라인 추가
