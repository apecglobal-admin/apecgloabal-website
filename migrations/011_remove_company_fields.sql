-- Migration: Remove company_id from employees and is_parent_company from companies
-- Vì chỉ có 1 công ty mẹ duy nhất, không cần phân biệt

-- 1. Remove company_id from employees table
ALTER TABLE employees DROP COLUMN IF EXISTS company_id;

-- 2. Remove is_parent_company from companies table  
ALTER TABLE companies DROP COLUMN IF EXISTS is_parent_company;

-- 3. Update any views or queries that might reference these fields
-- (No views currently use these fields)

-- 4. Clean up any indexes on these columns
DROP INDEX IF EXISTS idx_employees_company_id;
DROP INDEX IF EXISTS idx_companies_is_parent;

COMMENT ON TABLE employees IS 'Employees table - all employees belong to the single parent company';
COMMENT ON TABLE companies IS 'Companies table - contains parent company and client companies';