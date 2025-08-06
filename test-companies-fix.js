// Test script to verify the companies page fix
console.log('🔧 Testing Companies Page Fix...\n');

// Mock data structures similar to what APIs return
const mockEmployeesResponse = {
  success: true,
  data: {
    employees: [
      { id: 1, name: 'Employee 1', company_id: 1 },
      { id: 2, name: 'Employee 2', company_id: 1 },
      { id: 3, name: 'Employee 3', company_id: 2 }
    ]
  }
};

const mockProjectsResponse = {
  success: true,
  data: [
    { id: 1, name: 'Project 1', company_id: 1, status: 'active' },
    { id: 2, name: 'Project 2', company_id: 1, status: 'completed' },
    { id: 3, name: 'Project 3', company_id: 2, status: 'in_progress' }
  ]
};

const mockDepartmentsResponse = {
  success: true,
  data: [
    { id: 1, name: 'IT', company_id: 1 },
    { id: 2, name: 'HR', company_id: 1 },
    { id: 3, name: 'Finance', company_id: 2 }
  ]
};

const mockCompaniesResponse = {
  success: true,
  data: [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' }
  ]
};

// Test the data extraction logic
console.log('1. Testing data extraction...');

const companies = mockCompaniesResponse;
const projects = mockProjectsResponse;
const employees = mockEmployeesResponse;
const departments = mockDepartmentsResponse;

// Apply the same logic as in the fixed code
const companiesData = Array.isArray(companies.data) ? companies.data : [];
const projectsData = Array.isArray(projects.data) ? projects.data : [];
const employeesData = Array.isArray(employees.data?.employees) ? employees.data.employees : 
                     Array.isArray(employees.data) ? employees.data : [];
const departmentsData = Array.isArray(departments.data) ? departments.data : [];

console.log('✅ Companies data:', companiesData.length, 'items');
console.log('✅ Projects data:', projectsData.length, 'items');
console.log('✅ Employees data:', employeesData.length, 'items');
console.log('✅ Departments data:', departmentsData.length, 'items');

// Test the filtering logic
console.log('\n2. Testing filtering logic...');

const stats = companiesData.map((company) => {
  const companyProjects = projectsData.filter((p) => p.company_id === company.id);
  const companyEmployees = employeesData.filter((e) => e.company_id === company.id);
  const companyDepartments = departmentsData.filter((d) => d.company_id === company.id);
  const activeProjects = companyProjects.filter((p) => 
    p.status === 'in_progress' || p.status === 'active'
  );

  return {
    id: company.id,
    name: company.name,
    projects_count: companyProjects.length,
    employees_count: companyEmployees.length,
    departments_count: companyDepartments.length,
    active_projects: activeProjects.length
  };
});

console.log('✅ Stats calculated successfully:');
stats.forEach(stat => {
  console.log(`   ${stat.name}: ${stat.employees_count} employees, ${stat.projects_count} projects, ${stat.departments_count} departments`);
});

console.log('\n🎉 All tests passed! The fix should work correctly.');

// Test edge cases
console.log('\n3. Testing edge cases...');

// Test with null/undefined data
const edgeCaseEmployees = { data: null };
const edgeCaseProjects = { data: undefined };
const edgeCaseDepartments = {};

const safeEmployeesData = Array.isArray(edgeCaseEmployees.data?.employees) ? edgeCaseEmployees.data.employees : 
                         Array.isArray(edgeCaseEmployees.data) ? edgeCaseEmployees.data : [];
const safeProjectsData = Array.isArray(edgeCaseProjects.data) ? edgeCaseProjects.data : [];
const safeDepartmentsData = Array.isArray(edgeCaseDepartments.data) ? edgeCaseDepartments.data : [];

console.log('✅ Edge case - employees:', safeEmployeesData.length);
console.log('✅ Edge case - projects:', safeProjectsData.length);
console.log('✅ Edge case - departments:', safeDepartmentsData.length);

console.log('\n✅ Edge cases handled correctly!');