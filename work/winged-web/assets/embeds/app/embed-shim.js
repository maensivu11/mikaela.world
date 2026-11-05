/* Fixture layer for the static portfolio embed. Intercepts every call to the
   (absent) Winged backend and answers with synthetic "Sample" data. No network. */
(function () {
  window.__WINGED_EMBED__ = true; // demo mode flag: screens with hardware/vendor gates render simulated
  var HOST = 'https://wingedweb.mock';
  var A = './embed-assets/';
  var now = Date.now(), H = 3600e3, D = 24 * H;
  var iso = function (ms) { return new Date(ms).toISOString(); };
  try { localStorage.setItem('winged_token', 'demo'); } catch (e) {}
  var state = { picked: null, proposed: {}, chat: [], deployed: !/^#\/(onboard|preview)/.test(location.hash), bioUsed: false, vouchApproved: {} };
  var stage = (location.hash.match(/stage=(before|during|after)/) || [0, 'before'])[1];
  var dateAt = stage === 'before' ? now + 2 * D : stage === 'during' ? now + 20 * 60e3 : now - 6 * H;
  var asset = function (f) { return new URL(A + f, document.baseURI).href; };
  var BIO_BODY = 'Maya is happiest outdoors and unhurried. Weekends mean Lands End trails and a good coffee. She wants someone to be easy company with.';

  function user() {
    return { id: 'sample-user', first_name: 'Maya', last_name: 'Lindqvist', birthday: '1994-01-01', gender: 'woman', height_cm: 170,
      sexuality: 'straight', selected_intro_id: state.picked || 'a1', agent_deployed: state.deployed, agent_active: state.deployed,
      latitude: 37.77, longitude: -122.42, address: 'San Francisco, CA', dating_preferences: ['men'],
      dating_preference_age_range_start: 28, dating_preference_age_range_end: 40, maximum_distance: 25, measurement_unit: 'mi',
      onboarding_experience: 'bio_v1', capabilities: { profile_bio: true, cloned_media: false },
      bio: state.bioUsed || state.deployed ? { id: 'bio-1', schema_version: 1, language: 'en', body: BIO_BODY } : null,
      photos: [1, 2, 3, 4].map(function (i) { return { id: 'ph' + i, order_no: i, url: asset('p' + i + '.svg') }; }),
      audio_files: [1, 2, 3].map(function (i) { return { id: 'a' + i, url: asset('take-' + i + '.wav'), category: 'intro', created_at: iso(now - i * 1000) }; }) };
  }
  var dim = function (s, t) { return { score: s, explanation: t }; };
  function matches() {
    return [
      { id: 'm1', name: 'Theo Marchetti', age: 33, gender: 'man', distance_in_kms: 4, neighborhood: 'Mission', match_percent: 0.9,
        intro_url: asset('take-2.wav'), lovestory_url: null,
        agent_recommendation_text: 'Exceptional alignment across all core dimensions. You both want slow mornings, long walks and someone who listens.',
        agent_recommendation_audio_status: null, bio: { id: 'b1', schema_version: 1, language: 'en', body: 'Sunday record-digging on Valencia, bad at small talk, great at dinner. Happiest with a burrito in Dolores Park. Looking for someone who laughs easily.' },
        onboarding_experience: 'bio_v1', capabilities: { profile_bio: true },
        images: [1, 5, 3].map(function (i, k) { return { url: asset('p' + i + '.svg'), order_no: k + 1 }; }),
        your_status: state.proposed.m1 ? 'proposed' : 'pending', partner_status: 'proposed', date_instance_id: null,
        qualifier_results: { personality_compatibility_score: dim(.92, 'Warm and curious on both sides; you recharge the same way.'),
          lifestyle_compatibility_score: dim(.88, 'Similar rhythms: early mornings, quiet evenings, weekend trips.'),
          values_compatibility_score: dim(.95, 'Both put kindness and honesty first.'),
          physical_chemistry_score: dim(.84, 'Attraction signals line up on both sides.'),
          long_term_potential_score: dim(.9, 'Both are looking for something real, not a pastime.'), total_score: .9 },
        vouch_count: 2, vouches: [{ name: 'Priya S.', quote: 'The most reliable person I know, and funny on top of it.', relationship: 'Friend' }, { name: 'Marcus L.', quote: 'Brings calm into any room.', relationship: 'Colleague' }] },
    ];
  }
  var bio = function () {
    var used = state.bioUsed;
    var draft = { id: 'bio-1', schema_version: 1, language: 'en', body: BIO_BODY,
      sentences: { everyday_life: 'Weekends mean Lands End trails and a good coffee.', interests_and_energy: 'Happiest outdoors and unhurried.', connection: 'She wants someone to be easy company with.' } };
    return { contract_version: 1, state_revision: used ? 2 : 1, draft: draft, published: null, published_bio_id: null, accepted_bio_id: used ? 'bio-1' : null,
      generation_state: 'ready', review_state: used ? 'accepted' : 'unreviewed', ready_for_review: true, can_deploy: used, rewrite_remaining: 1, request_id: null,
      retry_after_seconds: null, allowed_actions: { use: ['bio-1'], regenerate: true, retry: false, report: true }, support_url: null, correction: null };
  };
  var dateState = function () { return { dateInstance: { id: 'd1', confirmed_time: iso(dateAt), proposed_time: iso(dateAt), suggested_times: [iso(now + 2 * D), iso(now + 3 * D)],
    date_type: 'coffee', suggested_date_types: [{ value: 'coffee' }, { value: 'walk' }], selected_venue_id: 'v1',
    suggested_venues: [{ id: 'v1', name: 'Foreign Cinema', address: '2534 Mission St, San Francisco', description: 'Old films on the courtyard wall; ask for a table near the screen.', photo_url: asset('p3.svg'), rating: 4.7, price_level: 3 }],
    initiator_confirmed_at: iso(now - H), receiver_confirmed_at: iso(now - H), booking_confirmed_at: iso(now - H), initiator_user_ref_id: 'sample-user', receiver_user_ref_id: 'm1', plan_notes: null, date_ended_at: stage === 'after' ? iso(now - 4 * H) : null },
    current_user_id: 'sample-user', initiator_name: 'Maya', receiver_name: 'Theo Marchetti', availabilityStatus: { currentUser: { hasAvailability: true }, partner: { hasAvailability: true }, bothHaveAvailability: true } }; };
  var vouches = function () { return [
    { id: 'v1', token: 'vt1', invitee_name: 'Priya S.', status: 'completed', user_approved: state.vouchApproved.v1 === undefined ? null : state.vouchApproved.v1, created_at: iso(now - 3 * D), completed_at: iso(now - 2 * D), vouch_response: { summary: 'Maya is the friend who remembers everything and shows up first.', quote: 'The most loyal person I know.', relationship: 'Friend' } },
    { id: 'v2', token: 'vt2', invitee_name: 'Marcus L.', status: 'completed', user_approved: true, created_at: iso(now - 5 * D), completed_at: iso(now - 4 * D), vouch_response: { summary: 'Calm under pressure and kind to everyone.', quote: 'Brings calm into any room.', relationship: 'Colleague' } },
    { id: 'v3', token: 'vt3', invitee_name: 'Lena M.', status: 'pending', user_approved: null, created_at: iso(now - D), completed_at: null, vouch_response: null } ]; };
  var availability = function () { return { weeklyHours: [0, 1, 2, 3, 4, 5, 6].map(function (d) { return { dayOfWeek: d, isEnabled: d > 0 && d < 6 || d === 6, startTime: '18:00', endTime: '22:00' }; }), exceptionDates: [], exceptionWindows: [] }; };
  var chat = function () { return { messages: [{ id: 'c1', sender_user_ref_id: 'm1', message: 'Hi! Looking forward to it.', created_at: iso(now - 600e3) }].concat(state.chat), windowStatus: stage === 'during' ? 'open' : stage === 'after' ? 'closed' : 'not_open', opensAt: iso(dateAt - H), closesAt: iso(dateAt + 12 * H) }; };

  function route(method, path, body) {
    var m;
    if ((m = path.match(/^\/api\/web\/vouch\/([^/]+)/))) return { inviter_first_name: 'Maya', invitee_name: 'Friend', status: 'pending', user_approved: null };
    if (!(m = path.match(/^\/api\/web\/user\/[^/]+(\/.*)?$/))) return {};
    var sub = (m[1] || '').split('?')[0];
    if (sub === '') return user();
    if (sub === '/double-summary') return { first_name: 'Maya', agent_active: true, wings_balance: 3, match_count: 1, recent_activity: [], active_date_id: 'd1' };
    if (sub === '/insights') return ['You light up talking about the Lands End trail at 7am, before the city wakes up', 'You want someone who asks a second question, not someone who performs', 'You cook for friends every Sunday, and a date who helps chop counts for a lot', 'You grew up near Helsinki and still miss the sauna, so a cold plunge is a fair first date', 'You would rather hear "I\'m nervous" than a line. Honesty beats polish'];
    if (sub === '/intro') { if (body && body.audio_file_id) state.picked = body.audio_file_id; return {}; }
    if (sub === '/deploy') { state.deployed = true; return {}; }
    if (/^\/bio/.test(sub)) { if (/\/use$/.test(sub)) state.bioUsed = true; return bio(); }
    if (sub === '/matches') return { data: matches(), reveal_at: null };
    if (/\/matches\/[^/]+\/propose$/.test(sub)) { state.proposed.m1 = true; return { mutual_proposal: true, date_instance_id: 'd1' }; }
    if (sub === '/vouch-invites') return vouches();
    var vm = sub.match(/\/vouch-invites\/([^/]+)\/(approve|reject|restore)$/);
    if (vm) { state.vouchApproved[vm[1]] = vm[2] === 'approve' ? true : vm[2] === 'reject' ? false : null; return {}; }
    if (sub === '/availability') return availability();
    if (/\/ui-state$/.test(sub)) return dateState();
    if (/\/chat$/.test(sub)) { if (method === 'POST') { var msg = { id: 'c' + (state.chat.length + 2), sender_user_ref_id: 'sample-user', message: body.message, created_at: iso(Date.now()) }; state.chat.push(msg); return msg; } return chat(); }
    if (/\/date-prep$/.test(sub)) return { prep: ['Stop at Bi-Rite on the way \u2014 grab a charcuterie board', 'Your table at Foreign Cinema is under your name, courtyard side', 'If it runs long: Zeitgeist is a short walk up Valencia for a nightcap'], questions: ['What is a small thing that made your week?'], stores: [], isInitiator: true };
    if (/\/feedback$/.test(sub)) return method === 'POST' ? { status: 'second_date_scheduling' } : { partnerName: 'Theo Marchetti', venueName: 'Foreign Cinema', confirmedTime: iso(now - D), alreadySubmitted: false, doneStatus: null, callState: null };
    if (/\/partners\/[^/]+\/profile$/.test(sub)) return matches()[0];
    if (/\/time-selection$/.test(sub)) return { dateInstanceId: 'd1', suggestedTimes: [iso(now + 2 * D), iso(now + 3 * D), iso(now + 4 * D)], partnerName: 'Theo Marchetti', proposedTime: null };
    if (/\/time-confirm$/.test(sub)) return { dateInstanceId: 'd1', proposedTime: iso(now + 2 * D), suggestedTimes: [iso(now + 2 * D)], partnerName: 'Theo Marchetti' };
    if (/\/date-options$/.test(sub)) return { dateInstanceId: 'd1', options: [] };
    if (/\/feedback\/should-prompt/.test(m[1] || '')) return { should_prompt: false };
    (window.__unmatched = window.__unmatched || []).push(method + ' ' + path);
    return {};
  }
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : input.url;
    if (url.indexOf(HOST) !== 0) {
      if (/posthog|googleapis|elevenlabs|gstatic/.test(url) && !/fonts\./.test(url)) return Promise.resolve(new Response('{}', { status: 200 }));
      return realFetch(input, init);
    }
    var path = url.slice(HOST.length), method = ((init && init.method) || 'GET').toUpperCase(), body = null;
    try { body = init && init.body ? JSON.parse(init.body) : null; } catch (e) {}
    (window.__calls=window.__calls||[]).push(method+' '+path); var data = route(method, path, body);
    var out = /\/bio(\/|$)/.test(path.split('?')[0]) || /^\/api\/web\/vouch\//.test(path) ? data : data;
    var payload = { success: true, data: out };
    return new Promise(function (r) { setTimeout(function () { r(new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json' } })); }, 120); });
  };
})();
