// Test script for Reports API
const baseUrl = 'http://localhost:3000';

async function testAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${baseUrl}${endpoint}`, options);
        const result = await response.json();
        
        console.log(`✅ ${method} ${endpoint}:`, {
            status: response.status,
            data: result
        });
        
        return result;
    } catch (error) {
        console.error(`❌ ${method} ${endpoint}:`, error);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Testing Reports API Endpoints...\n');
    
    // Test 1: Get reports list
    console.log('1. Testing reports list...');
    await testAPI('/api/reports?page=1&limit=5');
    
    // Test 2: Get reports stats
    console.log('\n2. Testing reports stats...');
    await testAPI('/api/reports/stats');
    
    // Test 3: Get departments
    console.log('\n3. Testing departments...');
    await testAPI('/api/departments');
    
    // Test 4: Get specific report
    console.log('\n4. Testing specific report...');
    await testAPI('/api/reports/1');
    
    // Test 5: Create new report
    console.log('\n5. Testing create report...');
    const newReport = {
        title: 'Test Report API',
        type: 'Kinh doanh',
        department_id: 1,
        created_by: 1,
        description: 'Test report created via API'
    };
    await testAPI('/api/reports', 'POST', newReport);
    
    // Test 6: Test download (this will increment download count)
    console.log('\n6. Testing download...');
    await testAPI('/api/reports/1/download', 'POST');
    
    console.log('\n✅ All tests completed!');
}

// Run tests if this is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    runTests();
} else {
    // Browser environment
    runTests();
}

module.exports = { testAPI, runTests };