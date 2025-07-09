const { execSync } = require('child_process');

try {
  console.log('Testing simple build...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
}