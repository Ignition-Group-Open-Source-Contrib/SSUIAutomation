// custom-reporter.js
import { writeFileSync } from 'fs';

export default class StatsReporter {
  constructor(options) {
    this.options = options;
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      unexecuted: 0
    };
  }

  onTestBegin() {
    this.stats.total++;
  }

  onTestEnd(test, result) {
    if (result.status === 'passed') this.stats.passed++;
    if (result.status === 'failed') this.stats.failed++;
    if (result.status === 'skipped') this.stats.skipped++;
  }

  // New: Track tests that never reached execution
  onError(error) {
    this.stats.unexecuted++;
  }

 onEnd() {
  const passPercentage = (this.stats.passed / this.stats.total * 100).toFixed(2);
  const failPercentage = (this.stats.failed / this.stats.total * 100).toFixed(2);
  const skipPercentage = (this.stats.skipped / this.stats.total * 100).toFixed(2);
  const totalExecuted = this.stats.passed + this.stats.failed + this.stats.skipped
  const unexecuted = this.stats.total - totalExecuted;
  const unexecutedPercentage = ( unexecuted / this.stats.total * 100).toFixed(2);
  console.log('\n=== TEST STATISTICS ===');
  console.log(`Total Tests:    ${this.stats.total}`);
  console.log(`✅ Passed:      ${this.stats.passed} (${passPercentage}%)`);
  console.log(`❌ Failed:      ${this.stats.failed} (${failPercentage}%)`);
  console.log(`⏭️ Skipped:      ${this.stats.skipped} (${skipPercentage}%)`);
  console.log(`⚠️ Unexecuted:   ${unexecuted} (${unexecutedPercentage}%)`);
  console.log(`📊 Pass Rate:   ${passPercentage}%`);
  console.log(`📉 Failure Rate: ${failPercentage}%`);

  if (this.options.outputFile) {
    const report = {
      ...this.stats,
      passPercentage,
      failPercentage,
      skipPercentage,
      unexecutedPercentage
    };
    writeFileSync(this.options.outputFile, JSON.stringify(report, null, 2));
  }
}
}