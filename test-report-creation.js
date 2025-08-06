// Test script để kiểm tra việc tạo báo cáo
const testReportCreation = async () => {
  console.log('=== Testing Report Creation ===');
  
  // 1. Test departments API
  console.log('\n1. Testing departments API...');
  try {
    const deptResponse = await fetch('http://localhost:3000/api/departments');
    const deptResult = await deptResponse.json();
    console.log('Departments status:', deptResponse.status);
    console.log('Departments count:', deptResult.data?.length || 0);
    
    if (deptResult.data && deptResult.data.length > 0) {
      console.log('First department:', deptResult.data[0]);
    }
  } catch (error) {
    console.error('Departments API error:', error);
  }
  
  // 2. Test employees API
  console.log('\n2. Testing employees API...');
  try {
    const empResponse = await fetch('http://localhost:3000/api/employees');
    const empResult = await empResponse.json();
    console.log('Employees status:', empResponse.status);
    console.log('Employees count:', empResult.data?.length || 0);
  } catch (error) {
    console.error('Employees API error:', error);
  }
  
  // 3. Test report creation
  console.log('\n3. Testing report creation...');
  const testReport = {
    title: 'Test Report - ' + new Date().toISOString(),
    type: 'Tài chính',
    department_id: 1,
    description: 'Test report created by script',
    created_by: 1
  };
  
  try {
    const reportResponse = await fetch('http://localhost:3000/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testReport)
    });
    
    const reportResult = await reportResponse.json();
    console.log('Report creation status:', reportResponse.status);
    console.log('Report creation result:', reportResult);
    
    if (reportResponse.ok) {
      console.log('✅ Report created successfully with ID:', reportResult.report?.id);
    } else {
      console.log('❌ Report creation failed:', reportResult.error);
    }
  } catch (error) {
    console.error('Report creation error:', error);
  }
  
  // 4. Test reports list
  console.log('\n4. Testing reports list...');
  try {
    const listResponse = await fetch('http://localhost:3000/api/reports');
    const listResult = await listResponse.json();
    console.log('Reports list status:', listResponse.status);
    console.log('Total reports:', listResult.total);
    console.log('Reports in current page:', listResult.reports?.length || 0);
  } catch (error) {
    console.error('Reports list error:', error);
  }
  
  console.log('\n=== Test Complete ===');
};

// Run the test if this is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testReportCreation();
} else {
  // Browser environment
  window.testReportCreation = testReportCreation;
  console.log('Test function available as window.testReportCreation()');
}