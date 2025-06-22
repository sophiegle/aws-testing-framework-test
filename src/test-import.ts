import { AWSTestingFramework } from 'aws-testing-framework';

async function testLibraryImport() {
  console.log('Testing AWS Testing Framework import...');
  
  try {
    // Test basic instantiation
    const framework = new AWSTestingFramework();
    console.log('✅ Framework instantiated successfully');
    
    // Test basic methods
    const correlationId = framework.generateCorrelationId();
    console.log(`✅ Generated correlation ID: ${correlationId}`);
    
    // Test reporter configuration
    framework.configureReporter('./test-reports');
    const reporter = framework.getReporter();
    console.log('✅ Reporter configured successfully');
    
    // Test cleanup
    await framework.cleanup();
    console.log('✅ Cleanup completed successfully');
    
    console.log('🎉 All basic functionality tests passed!');
    
  } catch (error) {
    console.error('❌ Error testing library:', error);
    process.exit(1);
  }
}

testLibraryImport();