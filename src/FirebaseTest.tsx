import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { visitService } from './services/visitService';
import { bookmarkService } from './services/bookmarkService';
import { restaurantService } from './services/restaurantService';
import { User } from 'firebase/auth';

function FirebaseTest() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      addLog(`Auth state changed: ${user ? user.email : 'Not logged in'}`);
    });
    return () => unsubscribe();
  }, []);

  const addLog = (message: string) => {
    setTestResults((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testRegister = async () => {
    try {
      const newUser = await authService.registerWithEmail(email, password);
      addLog(`✅ Register success: ${newUser.email}`);
    } catch (error: any) {
      addLog(`❌ Register error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const user = await authService.loginWithEmail(email, password);
      addLog(`✅ Login success: ${user.email}`);
    } catch (error: any) {
      addLog(`❌ Login error: ${error.message}`);
    }
  };

  const testGoogleLogin = async () => {
    try {
      const user = await authService.loginWithGoogle();
      addLog(`✅ Google login success: ${user.email}`);
    } catch (error: any) {
      addLog(`❌ Google login error: ${error.message}`);
    }
  };

  const testLogout = async () => {
    try {
      await authService.logout();
      addLog(`✅ Logout success`);
    } catch (error: any) {
      addLog(`❌ Logout error: ${error.message}`);
    }
  };

  const testVisitCRUD = async () => {
    if (!user) {
      addLog('❌ Please login first');
      return;
    }

    try {
      // Create
      const visitId = await visitService.createVisit({
        userId: user.uid,
        restaurantId: 'test-restaurant-1',
        restaurantName: '테스트 맛집',
        visitedAt: new Date(),
        rating: 5,
        memo: '맛있어요!'
      });
      addLog(`✅ Visit created: ${visitId}`);

      // Read
      const visits = await visitService.getVisitsByUserId(user.uid);
      addLog(`✅ Visits fetched: ${visits.length} items`);

      // Update
      await visitService.updateVisit(visitId, {
        rating: 4,
        memo: '수정된 메모'
      });
      addLog(`✅ Visit updated`);

      // Read single
      const visit = await visitService.getVisitById(visitId);
      addLog(`✅ Visit detail: rating=${visit?.rating}, memo=${visit?.memo}`);

      // Delete
      await visitService.deleteVisit(visitId);
      addLog(`✅ Visit deleted`);
    } catch (error: any) {
      addLog(`❌ Visit CRUD error: ${error.message}`);
    }
  };

  const testBookmarkCRUD = async () => {
    if (!user) {
      addLog('❌ Please login first');
      return;
    }

    try {
      // Create Group
      const groupId = await bookmarkService.createGroup(user.uid, '서울 맛집');
      addLog(`✅ Group created: ${groupId}`);

      // Read Groups
      const groups = await bookmarkService.getGroupsByUserId(user.uid);
      addLog(`✅ Groups fetched: ${groups.length} items`);

      // Update Group
      await bookmarkService.updateGroupName(groupId, '강남 맛집');
      addLog(`✅ Group name updated`);

      // Add Bookmark
      const bookmarkId = await bookmarkService.addBookmark({
        userId: user.uid,
        groupId: groupId,
        restaurantId: 'test-restaurant-1',
        restaurantName: '테스트 맛집',
        restaurantAddress: '서울시 강남구'
      });
      addLog(`✅ Bookmark added: ${bookmarkId}`);

      // Read Bookmarks
      const bookmarks = await bookmarkService.getBookmarksByGroupId(groupId);
      addLog(`✅ Bookmarks fetched: ${bookmarks.length} items`);

      // Check exists
      const exists = await bookmarkService.checkBookmarkExists(user.uid, 'test-restaurant-1', groupId);
      addLog(`✅ Bookmark exists: ${exists}`);

      // Delete Bookmark
      await bookmarkService.deleteBookmark(bookmarkId);
      addLog(`✅ Bookmark deleted`);

      // Delete Group
      await bookmarkService.deleteGroup(groupId);
      addLog(`✅ Group deleted`);
    } catch (error: any) {
      addLog(`❌ Bookmark CRUD error: ${error.message}`);
    }
  };

  const testRestaurantCache = async () => {
    try {
      // Cache restaurant
      const id = await restaurantService.cacheRestaurant({
        id: 'external-123',
        name: '맛있는집',
        address: '서울시 강남구',
        category: '한식',
        region: '강남구',
        phone: '02-1234-5678'
      });
      addLog(`✅ Restaurant cached: ${id}`);

      // Search by region
      const restaurants = await restaurantService.searchByRegion('강남구');
      addLog(`✅ Search by region: ${restaurants.length} items`);

      // Search by category
      const koreanFood = await restaurantService.searchByCategory('한식');
      addLog(`✅ Search by category: ${koreanFood.length} items`);

      // Get by ID
      const restaurant = await restaurantService.getRestaurantById(id);
      addLog(`✅ Restaurant detail: ${restaurant?.name}`);
    } catch (error: any) {
      addLog(`❌ Restaurant cache error: ${error.message}`);
    }
  };

  const testAll = async () => {
    setTestResults([]);
    addLog('🚀 Starting all tests...');
    await testRegister();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testVisitCRUD();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testBookmarkCRUD();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testRestaurantCache();
    addLog('✅ All tests completed!');
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔥 Firebase Test Dashboard</h1>

        {/* User Status */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">👤 User Status</h2>
            {user ? (
              <div className="alert alert-success">
                <span>✅ Logged in as: {user.email}</span>
              </div>
            ) : (
              <div className="alert alert-warning">
                <span>⚠️ Not logged in</span>
              </div>
            )}
          </div>
        </div>

        {/* Test Inputs */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">🔑 Authentication Test</h2>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary" onClick={testRegister}>
                Register
              </button>
              <button className="btn btn-secondary" onClick={testLogin}>
                Login
              </button>
              <button className="btn btn-accent" onClick={testGoogleLogin}>
                Google Login
              </button>
              <button className="btn btn-error" onClick={testLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Feature Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">📝 Visit CRUD</h2>
              <button className="btn btn-primary" onClick={testVisitCRUD}>
                Test Visits
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">⭐ Bookmark CRUD</h2>
              <button className="btn btn-secondary" onClick={testBookmarkCRUD}>
                Test Bookmarks
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">🍴 Restaurant Cache</h2>
              <button className="btn btn-accent" onClick={testRestaurantCache}>
                Test Cache
              </button>
            </div>
          </div>
        </div>

        {/* Run All Tests */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex gap-2">
              <button className="btn btn-success flex-1" onClick={testAll}>
                🚀 Run All Tests
              </button>
              <button className="btn btn-outline" onClick={clearLogs}>
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">📊 Test Results</h2>
            <div className="mockup-code max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <pre data-prefix="$" className="text-warning">
                  <code>No tests run yet. Click a test button above.</code>
                </pre>
              ) : (
                testResults.map((result, index) => (
                  <pre key={index} data-prefix=">" className={result.includes('❌') ? 'text-error' : 'text-success'}>
                    <code>{result}</code>
                  </pre>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirebaseTest;
