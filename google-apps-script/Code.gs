/**
 * ActivOrbit AI — Contact Form + Newsletter → Google Sheets
 * Google Apps Script (Code.gs)
 *
 * This script handles TWO types of submissions:
 *   1. Contact Form (from index.html) → writes to "Contacts" sheet
 *   2. Newsletter Signup (from resources.html) → writes to "Newsletter" sheet
 *
 * SETUP INSTRUCTIONS:
 * ────────────────────
 * 1. Open your existing Google Sheet (the one already connected)
 *
 * 2. Create TWO sheets (tabs) inside it:
 *    Tab 1: "Contacts" — with headers:
 *      A1: Timestamp | B1: Name | C1: Email | D1: Service | E1: Budget | F1: Message
 *
 *    Tab 2: "Newsletter" — with headers:
 *      A1: Timestamp | B1: Email
 *
 * 3. Open Apps Script
 *    → Extensions → Apps Script
 *    → Replace ALL existing code with this file
 *
 * 4. Deploy as NEW version
 *    → Deploy → New deployment
 *    → Type: "Web app"
 *    → Execute as: "Me"
 *    → Who has access: "Anyone"
 *    → Click "Deploy" → Copy the NEW Web App URL
 *
 * 5. Update BOTH URLs in your website files:
 *    → index.html:     const GOOGLE_SCRIPT_URL = 'YOUR_NEW_URL';
 *    → resources.html: const NL_SCRIPT_URL = 'YOUR_NEW_URL';
 *    (They can be the SAME URL — the script routes automatically)
 *
 * IMPORTANT: You MUST create a NEW deployment after editing.
 *            Existing deployment URLs do NOT update automatically.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    // Route based on source field
    if (data.source === 'newsletter') {
      // ── Newsletter signup ──
      var nlSheet = ss.getSheetByName('Newsletter');
      if (!nlSheet) {
        nlSheet = ss.insertSheet('Newsletter');
        nlSheet.appendRow(['Timestamp', 'Email']);
      }
      nlSheet.appendRow([
        new Date(),
        data.email || ''
      ]);
    } else {
      // ── Contact form submission ──
      var contactSheet = ss.getSheetByName('Contacts');
      if (!contactSheet) {
        contactSheet = ss.insertSheet('Contacts');
        contactSheet.appendRow(['Timestamp', 'Name', 'Email', 'Service', 'Budget', 'Message']);
      }
      contactSheet.appendRow([
        new Date(),
        data.name || '',
        data.email || '',
        data.service || '',
        data.budget || '',
        data.message || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'ActivOrbit AI endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
