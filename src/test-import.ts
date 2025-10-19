import { AWSTestingFramework } from 'aws-testing-framework';

async function testLibraryImport() {
  console.log('Testing AWS Testing Framework import...');
  
  try {
    // Test basic instantiation
    const framework = new AWSTestingFramework();
    console.log('✅ Framework instantiated successfully');
    
    // Test service access
    const s3Service = framework.s3Service;
    const lambdaService = framework.lambdaService;
    const sqsService = framework.sqsService;
    const stepFunctionService = framework.stepFunctionService;
    const healthValidator = framework.healthValidator;
    console.log('✅ All services accessible');
    
    // Test reporter access
    const reporter = framework.reporter;
    console.log('✅ Reporter accessible');
    
    // Test configuration access
    const config = framework.getConfig();
    console.log('✅ Configuration accessible');
    
    // Test cleanup (dispose)
    await framework.dispose();
    console.log('✅ Framework disposed successfully');
    
    console.log('🎉 All basic functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing library:', error);
    process.exit(1);
  }
}

testLibraryImport();