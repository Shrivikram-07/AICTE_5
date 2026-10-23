const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runE2ETests() {
  console.log('=== STARTING AICTE INTELLIGENCE BROWSER AUTOMATION SUITE ===');
  console.log('Browser engine: Microsoft Edge (headless)');
  
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Collect console errors from page
  const pageErrors = [];
  page.on('pageerror', (err) => {
    console.error('[Browser PageError]', err.message);
    pageErrors.push(err.message);
  });

  const results = [];
  function recordTest(name, passed, details = '') {
    results.push({ name, passed, details });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${details ? '- ' + details : ''}`);
  }

  try {
    // -------------------------------------------------------------
    // 1. Command Centre
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 1: Command Centre Dashboard ---');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    
    const title = await page.title();
    const hasCommandCentreHeading = await page.locator('text=Regulatory Command Centre').isVisible();
    recordTest(
      'Command Centre Heading and Title',
      hasCommandCentreHeading && title.includes('AICTE Intelligence'),
      `Page title: "${title}"`
    );

    const hasPriorityQueue = await page.locator('text=Priority Regulatory Review Queue').isVisible();
    const hasMeridianCase = await page.locator('text=Meridian Institute of Technology').first().isVisible();
    recordTest(
      'Command Centre Priority Queue & Meridian Case',
      hasPriorityQueue && hasMeridianCase,
      'Meridian Institute of Technology (DEMO-EoA-2026-0142) found in queue'
    );

    // -------------------------------------------------------------
    // 2. Application Review Workspace
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 2: Application Review Workspace ---');
    await page.goto('http://localhost:5173/applications/DEMO-EoA-2026-0142/review', { waitUntil: 'networkidle' });

    const hasWorkspaceHeader = await page.locator('text=DEMO-EoA-2026-0142').first().isVisible();
    const riskScoreText = await page.locator('text=78').first().isVisible();
    recordTest(
      'Application Review Workspace Loaded',
      hasWorkspaceHeader && riskScoreText,
      'Loaded Meridian workspace with baseline risk score 78'
    );

    // -------------------------------------------------------------
    // 3. Document Upload Modal & Live Verification
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 3: Document Upload Modal & Live Python Pipeline ---');
    
    // Click "Upload Real Evidence" button
    const uploadBtn = page.locator('button:has-text("Upload Real Evidence")').first();
    await uploadBtn.click();
    
    // Wait for health probe to complete
    await page.waitForSelector('text=FastAPI Connected (Port 8000)', { timeout: 6000 });
    const modalVisible = await page.locator('text=Upload & Verify Regulatory Evidence').isVisible();
    const serverConnected = await page.locator('text=FastAPI Connected (Port 8000)').isVisible();
    recordTest(
      'Upload Modal Opens with Backend Health Connected',
      modalVisible && serverConnected,
      'FastAPI Connected (Port 8000) verified in modal'
    );

    // Test malformed / invalid file rejection
    const invalidFilePath = path.join(__dirname, 'temp_malicious.exe');
    fs.writeFileSync(invalidFilePath, 'MZ\x90\x00\x03\x00\x00\x00FakeExePayload');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(invalidFilePath);
    await page.waitForTimeout(300);

    const rejectionMsg = await page.locator('text=Unsupported file format').isVisible();
    recordTest(
      'Invalid File Extension Rejection in UI',
      rejectionMsg,
      'Executable rejected with clear validation message'
    );

    if (fs.existsSync(invalidFilePath)) fs.unlinkSync(invalidFilePath);

    // Test genuine PDF upload
    const basePdfPath = path.resolve(__dirname, '../../backend/tests/fixtures/test_fixture_valid_eoa.pdf');
    if (!fs.existsSync(basePdfPath)) {
      throw new Error('Fixture PDF does not exist at ' + basePdfPath);
    }
    const uniquePdfPath = path.resolve(__dirname, `../../backend/tests/fixtures/test_fixture_eoa_${Date.now()}.pdf`);
    const originalBytes = fs.readFileSync(basePdfPath);
    fs.writeFileSync(uniquePdfPath, Buffer.concat([originalBytes, Buffer.from(`\n% Unique Run ${Date.now()}\n`)]));

    await fileInput.setInputFiles(uniquePdfPath);
    await page.waitForTimeout(300);

    const fileLoaded = await page.locator(`text=${path.basename(uniquePdfPath)}`).first().isVisible();
    recordTest('Valid PDF Loaded in UI Dropzone', fileLoaded, `${path.basename(uniquePdfPath)} attached`);

    // Click "Execute Verification"
    const executeBtn = page.locator('button:has-text("Execute Verification")');
    await executeBtn.click();

    // Wait for python backend processing to finish
    await page.waitForSelector('text=Document Ingested & Evaluated', { timeout: 10000 });
    const verifiedStatus = await page.locator('text=VERIFIED').first().isVisible();
    const hasOrderRef = await page.locator('text=REG-REF-TEST-9921').first().isVisible();
    const hasIntake = await page.locator('text=420 Seats').first().isVisible();
    
    recordTest(
      'Live Verification Pipeline Executed',
      verifiedStatus && hasOrderRef && hasIntake,
      'Extracted Ref REG-REF-TEST-9921 & 420 Seats'
    );

    // Click "Attach Evidence & Update Risk Score"
    const attachBtn = page.locator('button:has-text("Attach Evidence & Update Risk Score")');
    await attachBtn.click();
    await page.waitForTimeout(600);

    // Verify modal closed
    const modalClosed = !(await page.locator('text=Upload & Verify Regulatory Evidence').isVisible());
    recordTest('Upload Modal Closes After Attaching Evidence', modalClosed);

    // Switch to Documents tab
    const docsTabBtn = page.locator('button:has-text("Document Intelligence")');
    await docsTabBtn.click();
    await page.waitForTimeout(400);

    const newDocInList = await page.locator(`text=${path.basename(uniquePdfPath)}`).isVisible();
    const realUploadBadge = await page.locator('text=Real Upload').first().isVisible();
    recordTest(
      'Uploaded Document Present in Workspace Documents Tab',
      newDocInList && realUploadBadge,
      'Document badge: REAL UPLOAD · FASTAPI'
    );

    if (fs.existsSync(uniquePdfPath)) fs.unlinkSync(uniquePdfPath);

    // -------------------------------------------------------------
    // 4. Document Inspector Modal
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 4: Document Inspector Modal ---');
    const inspectBtn = page.locator('button:has-text("Inspect Dossier & OCR")').first();
    await inspectBtn.click();
    await page.waitForTimeout(600);

    const inspectorOpen = await page.locator('text=Genuine Ingested Evidence').isVisible();
    const hasIframe = await page.locator('iframe[title="Official Document Stream"]').isVisible();
    recordTest(
      'Document Inspector Modal Renders Genuine File Stream',
      inspectorOpen && hasIframe,
      'Rendered genuine PDF iframe stream from FastAPI endpoint'
    );

    // Switch to Raw Extracted Text tab
    const textTab = page.locator('button:has-text("Raw Extracted Text")');
    await textTab.click();
    await page.waitForTimeout(300);

    const hasExtractedText = await page.locator('text=STATE TECHNICAL ACCREDITATION COUNCIL').isVisible();
    recordTest(
      'Inspector Displays Raw Extracted Text Stream',
      hasExtractedText,
      'Extracted text stream verified'
    );

    // Close Inspector
    const closeInspectorBtn = page.locator('button:has-text("Done Inspecting")');
    await closeInspectorBtn.click();
    await page.waitForSelector('text=Genuine Ingested Evidence', { state: 'detached', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);

    // -------------------------------------------------------------
    // 5. Finding Review & Risk Score Persistence
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 5: Finding Review & Deterministic Risk Scoring ---');
    // Switch to Overview tab
    const overviewTabBtn = page.locator('button:has-text("Overview & Brief")');
    await overviewTabBtn.click();
    await page.waitForTimeout(400);

    // Click "Inspect Finding" on fnd-01 (Simulated Expired Affiliation Certificate, weight 25)
    const reviewFindingBtn = page.locator('text=fnd-01').locator('..').locator('..').locator('text=Inspect Finding');
    await reviewFindingBtn.click();
    await page.waitForTimeout(500);

    const findingModalOpen = await page.locator('text=Scrutiny Officer Review Notes').isVisible();
    recordTest('Finding Review Modal Opened', findingModalOpen);

    // Mark as "Inspected" (should NOT remove penalty)
    const markInspectedBtn = page.locator('button:has-text("Mark as Inspected")');
    await markInspectedBtn.click();
    await page.waitForTimeout(500);

    // Risk score should STILL be 78
    const scoreAfterReviewed = await page.locator('text=78').first().isVisible();
    recordTest(
      'Marking Finding Inspected Keeps Risk Penalty Active',
      scoreAfterReviewed,
      'Risk score remains 78 after inspection'
    );

    // Now open again and resolve finding
    await page.locator('text=fnd-01').locator('..').locator('..').locator('text=Inspect Finding').click();
    await page.waitForTimeout(500);

    const notesInput = page.locator('textarea').first();
    await notesInput.fill('Audited official renewal order; compliance verified.');
    const resolveBtn = page.locator('button:has-text("Resolve & Deduct Risk")');
    await resolveBtn.click();
    await page.waitForTimeout(500);

    // Risk score should now drop from 78 to 53 (-25)
    const scoreAfterResolved = await page.locator('text=53').first().isVisible();
    recordTest(
      'Resolving Finding Deducts Exact Penalty (78 -> 53)',
      scoreAfterResolved,
      'Risk score dropped by exactly 25 to 53'
    );

    // Test page reload persistence (localStorage)
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const scorePersisted = await page.locator('text=53').first().isVisible();
    recordTest(
      'Risk Score & Finding State Persist Across Page Reload',
      scorePersisted,
      'Score remains 53 after full browser refresh'
    );

    // -------------------------------------------------------------
    // 6. Navigation to Other Modules
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 6: Cross-Module Verification & Risk Intelligence ---');
    await page.goto('http://localhost:5173/verification', { waitUntil: 'networkidle' });
    const hasVerificationTitle = await page.locator('text=Verification Operations Queue').isVisible();
    recordTest(
      'Verification Centre Route Loads',
      hasVerificationTitle,
      'Verification Operations Queue accessible'
    );

    await page.goto('http://localhost:5173/risk-intelligence', { waitUntil: 'networkidle' });
    const hasRiskTitle = await page.locator('text=Risk Intelligence & Regulatory Insights').isVisible();
    recordTest(
      'Risk Intelligence Route Loads',
      hasRiskTitle,
      'Risk analytics and telemetry charts accessible'
    );

    // -------------------------------------------------------------
    // 7. Reset Demo Dataset
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 7: Reset Demo Dataset ---');
    await page.goto('http://localhost:5173/applications/DEMO-EoA-2026-0142/review', { waitUntil: 'networkidle' });
    
    // Handle dialog
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    const resetBtn = page.locator('button:has-text("Reset Demo Dataset")');
    await resetBtn.click();
    await page.waitForTimeout(500);

    // Refresh and check that risk score restored to baseline 78
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const scoreRestored = await page.locator('text=78').first().isVisible();
    recordTest(
      'Reset Demo Dataset Restores Baseline Score (78)',
      scoreRestored,
      'Baseline score 78 restored cleanly'
    );

  } catch (err) {
    console.error('Test execution encountered fatal error:', err);
    recordTest('E2E Test Execution', false, err.message);
  } finally {
    await browser.close();
  }

  console.log('\n======================================================');
  console.log('=== PLAYWRIGHT BROWSER AUTOMATION SUMMARY ===');
  const total = results.length;
  const passedCount = results.filter((r) => r.passed).length;
  console.log(`Total Browser Tests: ${total} | Passed: ${passedCount} | Failed: ${total - passedCount}`);
  if (pageErrors.length > 0) {
    console.log(`Page JS Errors: ${pageErrors.length}`);
  }
  console.log('======================================================\n');

  if (passedCount !== total) {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error(err);
  process.exit(1);
});
