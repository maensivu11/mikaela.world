/* Fixture layer for the static Find Funding portfolio embed.
   Signs the visitor in with dummy tokens and answers every call to the absent
   backend (https://ff.mock) with synthetic sample data. No request leaves the page. */
(function () {
  var HOST = 'https://ff.mock';
  var PID = '5a3b1e00-0000-4000-8000-000000000001';
  try {
    localStorage.setItem('pathfund_token', 'sample-token');
    localStorage.setItem('pathfund_refresh_token', 'sample-refresh');
  } catch (e) {}

  function Refusal(status, detail) { this.status = status; this.detail = detail; }
  function refuse(status, detail) { return new Refusal(status, detail); }

  var STATUS_LINE = 'Nothing has been added to your profile yet.';
  var doc = { id: 'd1', profile_id: PID, filename: 'sample-tax-return-2025.pdf', content_type: 'application/pdf', byte_size: 482113, sha256: 'x',
    doc_kind: 'tax_return', status: 'extracted', status_reason: null, page_count: 6, extraction_method: 'deterministic-v1',
    proposed_count: 4, confirmed_count: 0, consent_version: 'v1', uploaded_at: null };
  function fact(id, key, label, value, page, excerpt, confidence) {
    return { id: id, document_id: 'd1', field_key: key, label: label, value: value, source_document: doc.filename, page: page,
      excerpt: excerpt, confidence: confidence, extraction_method: 'deterministic-v1', status: 'proposed', decided_value: null,
      applied_to_profile: false, apply_error: null, lands_in: key };
  }
  var facts = [
    fact('f1', 'legal_name', 'Legal name', 'Sample Bakery LLC', 1, 'Name of corporation: Sample Bakery LLC', 0.95),
    fact('f2', 'annual_revenue', 'Annual revenue', '$1,284,300.00', 3, 'Gross receipts or sales: $1,284,300.00', 0.85),
    fact('f3', 'employee_count', 'Team size', '14', 4, 'Number of employees: 14', 0.8),
    fact('f4', 'entity_type', 'Business structure', 'LLC', 1, 'Form 1120-S, S corporation election', 0.7)];
  var consent = { version: 'v1',
    disclosure: 'Your files are read by software, including an AI reader, to propose facts. A person confirms each one.',
    retention: 'The AI provider does not keep your files after the read.',
    consent: 'I agree that these files may be read to propose facts for my profile.',
    profile_status_line: STATUS_LINE, seam_status_today: '', llm_extraction_enabled: true };

  var NOW = Date.now(), DAY = 864e5;
  function iso(ms) { return new Date(ms).toISOString(); }
  function profile() {
    return { id: PID, user_id: 'sample-user', legal_name: 'Sample Bakery LLC', trade_name: 'Sample Bakery', entity_type: 'LLC', stage: 'operating',
      sam_uei: null, website: 'https://example.com', primary_naics: '311811', employee_count: 14, annual_revenue: null, r_and_d_spend: null,
      capital_gains: null, is_opportunity_zone: false, is_small_business: true, us_owned: true, sam_registration_status: null,
      state: 'OH', city: 'Columbus', country: 'US', zip_code: '43215', address_line1: '100 Sample St', address_line2: null,
      state_of_formation: 'OH', date_established: '2016-04-01', years_in_business: 9, contact_name: 'Sample Owner', contact_title: 'Owner',
      contact_email: 'owner@example.com', contact_phone: null, keywords: 'bakery, wholesale bread, cafe', domains: null,
      use_of_funds: 'A second oven line and a delivery van for wholesale accounts.', ownership_traits: 'woman_owned',
      net_income: 96000, requested_amount: 150000, requested_term_months: 60, match_threshold: 0.5, auto_draft_enabled: false,
      onboarding_details: null, created_at: iso(NOW - 30 * DAY), updated_at: iso(NOW - DAY), first_matches: [] };
  }
  function tracker() {
    return { profile_id: PID, removed: [], restore_window_days: 30, total: 0, groups: [], counts: { draft: 0, ready: 0, submitted: 0, heard: 0 },
      due_today: 0, completeness_rule: '', outside_applications_supported: false, outside_applications_note: '' };
  }
  var locations = [{ id: 'loc1', profile_id: PID, label: 'Bakery and cafe', address_line1: '100 Sample St', address_line2: null,
    city: 'Columbus', state: 'OH', zip_code: '43215', country: 'US', use: 'production', source_fact_id: null }];

  function intakeState() {
    var confirmed = facts.filter(function (f) { return f.status === 'confirmed'; }).length;
    return { profile_id: PID, staged_count: 0, proposed_count: facts.length - confirmed, confirmed_count: confirmed, profile_status_line: STATUS_LINE };
  }

  /* Fact decisions survive a full page load inside the frame, so a confirmed
     fact is still confirmed on the profile screen. */
  var DECISIONS_KEY = 'ff-embed-decisions';
  function loadDecisions() { try { return JSON.parse(sessionStorage.getItem(DECISIONS_KEY) || '{}'); } catch (e) { return {}; } }
  function applyDecisions() {
    var d = loadDecisions();
    facts.forEach(function (f) {
      var x = d[f.id]; if (!x) return;
      f.status = x.decision === 'confirm' ? 'confirmed' : 'rejected';
      f.decided_value = x.value != null ? x.value : f.value;
      f.applied_to_profile = x.decision === 'confirm';
    });
  }
  applyDecisions();
  function decideFact(m, body) {
    var d = loadDecisions();
    d[m[1]] = { decision: body && body.decision, value: body && body.value };
    try { sessionStorage.setItem(DECISIONS_KEY, JSON.stringify(d)); } catch (e) {}
    applyDecisions();
    return facts.filter(function (f) { return f.id === m[1]; })[0] || refuse(404, 'That fact is not in this sample.');
  }

  /* Upload. The file's bytes stay in the browser: the shim only learns its name
     and size, and the "read" shows the sample tax return's facts, saying so. */
  var staged = null;
  var SAMPLE_NOTE = 'This is a sample: your file was not sent anywhere or read. It shows the facts from the sample tax return.';
  function stagedView() {
    return { id: staged.id, profile_id: PID, filename: staged.filename, content_type: staged.type, byte_size: staged.size, sha256: 'sample',
      doc_kind: staged.kind, kind_source: 'you_told_us', status: staged.status, promoted_document_id: null, page_count: 6,
      read_reason: SAMPLE_NOTE, read_status: 'read', progress: null, archive_id: null, archive_name: null, consent_version: 'v1',
      consented_at: iso(NOW), staged_at: iso(NOW),
      preview_facts: facts.map(function (f) { return { field_key: f.field_key, label: f.label, value: f.value, page: f.page, excerpt: f.excerpt,
        confidence: f.confidence, extraction_method: f.extraction_method, lands_in: f.lands_in }; }),
      profile_status_line: STATUS_LINE, holding_note: SAMPLE_NOTE, next_step: 'Keep it to review each fact, or discard it.' };
  }
  function beginStaged(filename, type, size, kind) {
    staged = { id: 'st1', filename: filename || 'your-file', type: type || 'application/octet-stream', size: size || 0, kind: kind || 'other', received: 0, status: 'staged' };
  }
  function stageForm(m, body, raw) {
    var file = raw && raw.get ? raw.get('file') : null;
    beginStaged(file && file.name, file && file.type, file && file.size, raw && raw.get ? raw.get('doc_kind') : null);
    return stagedView();
  }
  function stageBegin(m, body) {
    beginStaged(body && body.filename, body && body.content_type, body && body.byte_size, body && body.doc_kind);
    return { id: staged.id, received_bytes: 0, byte_size: staged.size };
  }
  function stagePart(m, body, raw, headers) {
    var offset = Number(headers['X-Upload-Offset'] || 0), size = raw && raw.size != null ? raw.size : 0;
    staged.received = offset + size;
    return { id: staged.id, received_bytes: staged.received, byte_size: staged.size };
  }
  function stagedOr404(fn) { return function (m, body) { return staged ? fn(m, body) : refuse(404, 'That upload is not here any more. Choose the file again.'); }; }
  var stagedRoutes = [
    ['POST', /^\/api\/v1\/documents\/staged$/, stageForm],
    ['POST', /^\/api\/v1\/documents\/staged\/begin$/, stageBegin],
    ['PUT', /^\/api\/v1\/documents\/staged\/[^/]+\/part$/, function (m, body, raw, headers) { return staged ? stagePart(m, body, raw, headers) : refuse(404, 'That upload is not here any more. Choose the file again.'); }],
    ['POST', /^\/api\/v1\/documents\/staged\/[^/]+\/complete$/, stagedOr404(stagedView)],
    ['GET', /^\/api\/v1\/documents\/staged\/[^/]+$/, stagedOr404(stagedView)],
    ['PATCH', /^\/api\/v1\/documents\/staged\/[^/]+$/, stagedOr404(function (m, body) { staged.kind = body && body.doc_kind; return stagedView(); })],
    ['POST', /^\/api\/v1\/documents\/staged\/[^/]+\/confirm$/, stagedOr404(function () {
      staged.status = 'confirmed';
      return { document: doc, facts: facts, next_step: 'Review each fact below.', profile_status_line: STATUS_LINE }; })],
    ['DELETE', /^\/api\/v1\/documents\/staged\/[^/]+$/, stagedOr404(function () {
      var id = staged.id; staged = null;
      return { id: id, status: 'deleted', bytes_destroyed: true, note: 'Discarded.', profile_status_line: STATUS_LINE }; })]];

  /* Sample opportunities. Invented programs and agencies, labelled as samples. */
  function sid(n) { return '50110000-0000-4000-8000-00000000000' + n; }
  var OPPS = [
    { n: 1, title: 'Small Business Equipment Grant (sample)', agency: 'Sample City Economic Development', cls: 'grant', min: 10000, max: 50000, days: 24,
      why: 'Food manufacturers with under 50 employees in the city can fund production equipment. Your second oven line is equipment.', fit: 'Strong', score: 0.86 },
    { n: 2, title: 'Main Street Growth Loan (sample)', agency: 'Sample State Development Authority', cls: 'loan', min: 50000, max: 250000, days: null,
      why: 'Term loans for established small businesses with two or more years of revenue. You have nine.', fit: 'Good', score: 0.74 },
    { n: 3, title: 'Women-Owned Business Expansion Award (sample)', agency: 'Sample Regional Foundation', cls: 'grant', min: 5000, max: 25000, days: 41,
      why: 'Awards for women-owned businesses expanding into wholesale. Your profile names wholesale accounts as the use of funds.', fit: 'Good', score: 0.71 },
    { n: 4, title: 'Clean Delivery Vehicle Rebate (sample)', agency: 'Sample County Sustainability Office', cls: 'grant', min: 2000, max: 15000, days: 63,
      why: 'Rebates on electric delivery vans for local businesses. A delivery van is in your plan.', fit: 'Possible', score: 0.58 }];
  function closeDate(o) { return o.days == null ? null : iso(NOW + o.days * DAY).slice(0, 10); }
  function match(o, rank) {
    return { id: 'm' + o.n, profile_id: PID, solicitation_id: sid(o.n), funding_class: o.cls, overall_score: o.score, fit_label: o.fit, served_rank: rank,
      eligible: true, qualification_status: 'eligible', eligibility_blockers: [], estimated_award_probability: null, estimated_value: o.max,
      rationale_summary: o.why, action: 'apply', close_date: closeDate(o), deadline_state: o.days == null ? 'rolling' : null,
      days_until_close: o.days, closing_soon: o.days != null && o.days < 30, solicitation_title: o.title, agency: o.agency,
      source_url: 'https://example.com/sample-program-' + o.n, program_summary: o.why, solicitation_type: o.cls, funding_instrument: o.cls,
      award_amount_min: o.min, award_amount_max: o.max };
  }
  function solicitation(m) {
    var o = OPPS.filter(function (x) { return sid(x.n) === m[1]; })[0];
    if (!o) return refuse(404, 'That opportunity is not in this sample.');
    return { id: sid(o.n), title: o.title, agency: o.agency, funding_class: o.cls, solicitation_type: o.cls, status: 'open', source: 'sample',
      source_url: 'https://example.com/sample-program-' + o.n, close_date: closeDate(o), deadline_state: o.days == null ? 'rolling' : null,
      description: o.why, award_amount_min: o.min, award_amount_max: o.max, funding_instrument: o.cls, geographic_restrictions: null };
  }
  var completeness = { score: 72, level: 'good', present_fields: 18, total_fields: 25,
    missing: [{ field: 'sam_uei', weight: 3, why: 'Federal programs ask for a SAM.gov UEI.' }],
    unlock_opportunities: [{ field: 'sam_uei', weight: 3, why: 'Federal programs ask for a SAM.gov UEI.' }] };
  function clock() { return { as_of: iso(NOW), prerequisites: [], start_today_message: null, note: '' }; }

  /* One table: [method, path pattern, answer]. The answer is a value or a
     function(match, body); refuse(status, detail) answers with an error status. */
  var ROUTES = stagedRoutes.concat([
    ['POST', /^\/api\/v1\/documents\/facts\/([^/]+)$/, decideFact],
    ['GET', /^\/api\/v1\/matches$/, function () { return OPPS.map(match); }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/matches\/([^/]+)$/, function (m) {
      var i = OPPS.map(function (o) { return sid(o.n); }).indexOf(m[1]);
      return i < 0 ? refuse(404, 'No match recorded.') : match(OPPS[i], i + 1); }],
    ['GET', /^\/api\/v1\/solicitations\/([^/]+)$/, solicitation],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/optimal-stack$/, function () { return refuse(403, 'Funding stacks are not part of this sample.'); }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/completeness$/, completeness],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/prerequisite-clock$/, clock],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/match-progress$/, function () { return refuse(404, 'No match run in this sample.'); }],
    ['GET', /^\/api\/v1\/applications$/, []],
    ['GET', /^\/api\/v1\/matches\/(m\d)$/, function (m) { var i = Number(m[1].slice(1)) - 1; return OPPS[i] ? match(OPPS[i], i + 1) : refuse(404, 'No match recorded.'); }],
    ['POST', /^\/api\/v1\/matches\/(m\d)\/feedback$/, function (m, body) { return { id: 'fb-' + m[1], match_id: m[1], event_type: body && body.event_type, recorded: true }; }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/needs$/, []],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/saved$/, { items: [], total: 0 }],
    ['GET', /^\/api\/v1\/providers\/status$/, { configured: false, count: 0 }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/foundation-prospects$/, { title: '', note: '', page: 1, page_count: 0, total: 0, cards_per_page: 4, cards: [] }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/follow-ups\/[^/]+$/, { template: { agency: null, program_type: null, sections: 0 }, questions: [], covered: [], questions_remaining: 0, note: '' }],
    ['GET', /^\/api\/v1\/documents\/consent$/, consent],
    ['GET', /^\/api\/v1\/documents\/intake-state$/, intakeState],
    ['GET', /^\/api\/v1\/documents\/staged$/, function () { return staged && staged.status === 'staged' ? [stagedView()] : []; }],
    ['GET', /^\/api\/v1\/documents$/, function () { return [doc]; }],
    ['GET', /^\/api\/v1\/documents\/[^/]+\/facts$/, function () { return facts; }],
    ['GET', /^\/api\/v1\/profiles$/, function () { return [profile()]; }],
    ['GET', /^\/api\/v1\/profiles\/[^/]+$/, profile],
    ['GET', /^\/api\/v1\/profiles\/[^/]+\/locations$/, locations],
    ['GET', /^\/api\/v1\/applications\/tracker$/, tracker],
  ]);

  function answer(method, path, body, raw, headers) {
    for (var i = 0; i < ROUTES.length; i++) {
      var r = ROUTES[i], m = path.match(r[1]);
      if (r[0] !== method || !m) continue;
      var data = typeof r[2] === 'function' ? r[2](m, body, raw, headers) : r[2];
      return data instanceof Refusal ? { status: data.status, data: { detail: data.detail } } : { status: 200, data: data };
    }
    (window.__unmatched = window.__unmatched || []).push(method + ' ' + path);
    return { status: 404, data: { detail: 'Not available in this sample.' } };
  }

  function respond(status, data) {
    var text = data === undefined ? '' : JSON.stringify(data);
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(new Response(status === 204 ? null : text, { status: status, headers: { 'Content-Type': 'application/json' } }));
      }, 120);
    });
  }

  /* Inside the portfolio frame, scrollIntoView (Next's router calls it on every
     navigation) would also scroll the case page around the frame. Scroll only
     this window, to the element's top. */
  if (window.parent !== window) {
    Element.prototype.scrollIntoView = function () {
      window.scrollTo(0, this.getBoundingClientRect().top + window.scrollY);
    };
  }

  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    if (url.indexOf(HOST) !== 0) {
      // The app asks which build is live and reloads when it differs; the live build is always this one.
      if (new URL(url, location.href).pathname === '/build-id') {
        var meta = document.querySelector('meta[name="x-ff-build"]');
        return Promise.resolve(new Response(meta ? meta.content : '', { status: 200, headers: { 'Content-Type': 'text/plain' } }));
      }
      return realFetch(input, init);
    }
    var u = new URL(url), method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase(), body = null;
    try { body = init && typeof init.body === 'string' ? JSON.parse(init.body) : null; } catch (e) {}
    (window.__calls = window.__calls || []).push(method + ' ' + u.pathname + u.search);
    var raw = init && init.body, headers = (init && init.headers) || {};
    if (headers instanceof Headers) headers = Object.fromEntries(headers.entries());
    var out = answer(method, u.pathname, body, raw, headers);
    return respond(out.status, out.data);
  };
})();
