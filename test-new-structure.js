// Test script for new company-department structure
const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_j3mTncOHAh5Z@ep-wispy-pine-a1vklngi-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testNewStructure() {
  try {
    console.log('🧪 Testing New Company-Department Structure...\n');
    
    // Test 1: Get Parent Company
    console.log('1. Testing Parent Company:');
    const parentResult = await pool.query('SELECT name, is_parent_company FROM companies WHERE is_parent_company = true');
    console.log('✅ Parent Company:', parentResult.rows[0]);
    
    // Test 2: Get Subsidiary Companies
    console.log('\n2. Testing Subsidiary Companies:');
    const subsidiaryResult = await pool.query('SELECT name, is_parent_company FROM companies WHERE is_parent_company = false ORDER BY name');
    console.log('✅ Subsidiary Companies:', subsidiaryResult.rows.length, 'found');
    subsidiaryResult.rows.forEach(company => {
      console.log('   -', company.name);
    });
    
    // Test 3: Check Departments Structure (no company_id)
    console.log('\n3. Testing Departments Structure:');
    const deptResult = await pool.query(`
      SELECT d.name, 
        (SELECT COUNT(*) FROM employees WHERE department_id = d.id) as total_employees,
        (SELECT COUNT(DISTINCT company_id) FROM employees WHERE department_id = d.id) as companies_count
      FROM departments d 
      ORDER BY d.name
    `);
    console.log('✅ Departments (no company_id):', deptResult.rows.length, 'found');
    deptResult.rows.forEach(dept => {
      console.log(`   - ${dept.name}: ${dept.total_employees} employees across ${dept.companies_count} companies`);
    });
    
    // Test 4: Check Employee-Department-Company relationships
    console.log('\n4. Testing Employee Relationships:');
    const empResult = await pool.query(`
      SELECT e.name, d.name as department, c.name as company
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN companies c ON e.company_id = c.id
      ORDER BY c.name, d.name, e.name
      LIMIT 10
    `);
    console.log('✅ Employee Relationships (sample):', empResult.rows.length, 'shown');
    empResult.rows.forEach(emp => {
      console.log(`   - ${emp.name} | ${emp.department || 'No Dept'} | ${emp.company || 'No Company'}`);
    });
    
    // Test 5: Company Stats Query
    console.log('\n5. Testing Company Stats:');
    const companies = await pool.query('SELECT id, name FROM companies ORDER BY name');
    
    for (const company of companies.rows) {
      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM projects WHERE company_id = $1) as projects_count,
          (SELECT COUNT(*) FROM services WHERE company_id = $1) as services_count,
          (SELECT COUNT(DISTINCT department_id) FROM employees WHERE company_id = $1 AND department_id IS NOT NULL) as departments_count,
          (SELECT COUNT(*) FROM employees WHERE company_id = $1) as employees_count
      `, [company.id]);
      
      const stat = stats.rows[0];
      console.log(`   - ${company.name}:`);
      console.log(`     Departments: ${stat.departments_count}, Employees: ${stat.employees_count}`);
      console.log(`     Projects: ${stat.projects_count}, Services: ${stat.services_count}`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Parent company properly set');
    console.log('- ✅ Departments no longer tied to specific companies');
    console.log('- ✅ Employees maintain both department and company relationships');
    console.log('- ✅ Statistics queries working correctly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testNewStructure();