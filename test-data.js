// Test script to check database data
const { query } = require('./lib/db');

async function testData() {
  try {
    console.log('Testing News data...');
    const newsResult = await query('SELECT COUNT(*) FROM news WHERE published = true');
    console.log('News count:', newsResult.rows[0].count);
    
    const newsSample = await query('SELECT title, category, published_at FROM news WHERE published = true ORDER BY published_at DESC LIMIT 3');
    console.log('Sample news:', newsSample.rows);
    
    console.log('\nTesting Jobs data...');
    const jobsResult = await query('SELECT COUNT(*) FROM jobs WHERE status = $1', ['active']);
    console.log('Jobs count:', jobsResult.rows[0].count);
    
    const jobsSample = await query('SELECT title, company_id, location, type FROM jobs WHERE status = $1 ORDER BY created_at DESC LIMIT 3', ['active']);
    console.log('Sample jobs:', jobsSample.rows);
    
    console.log('\nTesting Projects data...');
    const projectsResult = await query('SELECT COUNT(*) FROM projects');
    console.log('Projects count:', projectsResult.rows[0].count);
    
    console.log('\nTesting Services data...');
    const servicesResult = await query('SELECT COUNT(*) FROM services');
    console.log('Services count:', servicesResult.rows[0].count);
    
    console.log('\nTesting Companies data...');
    const companiesResult = await query('SELECT COUNT(*) FROM companies');
    console.log('Companies count:', companiesResult.rows[0].count);
    
    console.log('\nAll data tests completed!');
  } catch (error) {
    console.error('Error testing data:', error);
  }
}

testData();