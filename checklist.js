/* Ship-to-App-Store checklist. Progress is kept only in this browser (localStorage). */
(function () {
  'use strict';
  var KEY = 'shipdesk-checklist-v1';

  var STAGES = [
    { id: 'account', title: '1. Accounts and ownership', items: [
      ['acc-dev', 'You are enrolled in the Apple Developer Program under your own name or company.', 'Apple charges an annual fee for membership, paid to Apple. Publish from your own account so you keep control of the app.'],
      ['acc-org', 'If publishing as a company: you have a D-U-N-S number and enrolled as an organization.', 'Apple verifies organizations through D-U-N-S; allow extra days. An individual account shows your personal name as the seller.'],
      ['acc-agree', 'Account holder has accepted the latest agreements in App Store Connect (and the Paid Apps agreement, tax and banking if you sell anything).', 'Pending agreements block submission; an incomplete Paid Apps agreement stops in-app purchases loading for the reviewer.'],
      ['acc-bundle', 'You picked a permanent bundle ID (like com.yourname.appname) and app name.', 'The bundle ID cannot be changed after the first upload. App names are limited to 30 characters and must be unused on the store.']
    ]},
    { id: 'native', title: '2. More than a website (Guideline 4.2)', items: [
      ['nat-shell', 'The app uses native navigation (tab bar or similar), not your website header, footer and hamburger menu.', 'The most common rejection for wrapped web apps is "not sufficiently different from a mobile browsing experience".'],
      ['nat-feature', 'At least two features use the phone: push notifications, camera, share sheet, offline data, biometrics, haptics, widgets.', 'Pick features that fit the app. List them in your review notes.'],
      ['nat-offline', 'With no connection the app shows a clear offline screen, not a blank page or browser error.', 'Reviewers sometimes test on poor networks.'],
      ['nat-first-offline', 'Fresh install, first launch in airplane mode: the app shows a message and a retry, not a white screen.', 'A failed first fetch that leaves a blank screen looks like a crash to a reviewer. Two-minute test.'],
      ['nat-links', 'External links open in the in-app browser or Safari, and nothing says "download our app" or "open in browser".', ''],
      ['nat-web-only', 'Cookie banners, website footers and "made with" badges are hidden inside the app.', '']
    ]},
    { id: 'login', title: '3. Login and accounts', items: [
      ['log-demo', 'A reviewer account exists that works without email or SMS verification.', 'Missing or broken demo login is a frequent "Information Needed" hold (Guideline 2.1).'],
      ['log-apple', 'If you offer Google or another social sign-in, Sign in with Apple is offered too, with Apple\'s button style.', 'Guideline 4.8. Make sure the button is clearly visible on your background colour.'],
      ['log-new', 'Tested sign-in with an Apple ID that has never used the app, including "Hide My Email": the next screen appears without restarting.', 'We have seen a sign-in that succeeded but left the screen unchanged until relaunch. Apple reported it as "not responsive".'],
      ['log-delete', 'Users can delete their account inside the app (Settings > Account > Delete account), whichever way they signed up.', 'Guideline 5.1.1(v). Required for apps that allow account creation.'],
      ['log-browse', 'Features that do not need an account can be used without signing in.', 'Guideline 5.1.1. Forced sign-up for a simple browsing app can be rejected.']
    ]},
    { id: 'money', title: '4. Payments', items: [
      ['pay-type', 'You know which of your sales are digital (in-app features, credits, app subscriptions) and which are physical goods or real-world services.', 'Digital content used in the app generally needs Apple In-App Purchase (Guideline 3.1.1). Rules on outside payment links vary by storefront and changed for the US in 2025; check the current guideline text.'],
      ['pay-noext', 'The iOS app has no Stripe checkout or "upgrade on our website" button for digital features, unless you have confirmed an exception applies.', 'Web builders often copy the website pricing page into the app.'],
      ['pay-ids', 'If you use In-App Purchase: product IDs match exactly between App Store Connect and your code or billing service, and the products are attached to this version.', 'A mismatch makes the paywall empty for the reviewer.'],
      ['pay-sandbox', 'One sandbox purchase completed on a real device.', ''],
      ['pay-terms', 'Subscription screen shows plan name, length, price and links to Terms of Use and Privacy Policy.', 'Guideline 3.1.2.']
    ]},
    { id: 'privacy', title: '5. Privacy', items: [
      ['prv-policy', 'Privacy policy is live at a public URL and linked inside the app.', 'It should list what you collect, why, which services receive it (database, analytics, payments, AI APIs) and how to request deletion.'],
      ['prv-labels', 'App Privacy answers in App Store Connect match what the app and its services actually collect.', 'Check every SDK and backend your builder added.'],
      ['prv-strings', 'Every permission prompt (camera, photos, location, microphone, contacts) explains the purpose in a full sentence.', 'Example: "Used to attach photos you choose to your notes." Ask only when the user reaches the feature.'],
      ['prv-manifest', 'The iOS project includes a privacy manifest (PrivacyInfo.xcprivacy), and wrapper plugins are current.', 'Without it, uploads can trigger ITMS-91053 "Missing API declaration".'],
      ['prv-att', 'If any SDK tracks users across other companies\' apps or sites, the App Tracking Transparency prompt appears first. Otherwise, no tracking SDKs.', 'Guideline 5.1.2.']
    ]},
    { id: 'quality', title: '6. Finish and stability', items: [
      ['q-iphone', 'Tested on a real iPhone with a fresh install and a new account.', ''],
      ['q-ipad', 'Tested on an iPad (or iPad simulator), both orientations.', 'Reviews often run on an iPad even for iPhone-first apps.'],
      ['q-placeholder', 'No placeholder text, sample data, "lorem ipsum", "coming soon", "beta" labels or dead buttons anywhere the reviewer can reach.', 'Guidelines 2.1 and 2.2.'],
      ['q-prod', 'The release build points at your production backend with production keys.', 'A build that silently falls back to test settings can look broken only in review.'],
      ['q-contrast', 'Key buttons are clearly visible against their background (aim for 3:1 contrast or more).', 'A dark button on a dark background can look like floating text. We measured one at 1.04:1.']
    ]},
    { id: 'listing', title: '7. Store listing', items: [
      ['l-icon', 'App icon 1024 x 1024 PNG, no transparency, no rounded corners added by you.', ''],
      ['l-shots', 'Screenshots of the real app in use, at least the 6.9-inch iPhone size (1320 x 2868 or 1290 x 2796); 13-inch iPad too if the app runs on iPad.', 'Guideline 2.3.3. Splash or login-only screenshots get rejected.'],
      ['l-text', 'Name (30), subtitle (30), keywords (100 characters) describe the app accurately with no competitor brands.', 'Guideline 2.3.7.'],
      ['l-platform', 'No mention of Android, Google Play or "web version" in the app, description or screenshots.', 'Guideline 2.3.10.'],
      ['l-urls', 'Support URL and privacy policy URL both load and show a contact method.', 'Guideline 1.5.'],
      ['l-age', 'Age rating questionnaire answered honestly, category chosen, copyright line filled.', '']
    ]},
    { id: 'build', title: '8. Build and TestFlight', items: [
      ['b-version', 'Version and build numbers set; each new upload has a higher build number.', ''],
      ['b-export', 'Export compliance answered (apps using only standard HTTPS usually qualify as exempt; set ITSAppUsesNonExemptEncryption in Info.plist to skip the question each upload).', 'Confirm this applies to your app before setting it.'],
      ['b-testflight', 'The uploaded build was installed from TestFlight and walked through once.', 'This catches release-only problems that do not appear in development.']
    ]},
    { id: 'submit', title: '9. Submit and respond', items: [
      ['s-notes', 'App Review Information filled: demo login, 3 to 5 lines on where to look, contact details that you will actually answer.', ''],
      ['s-release', 'Release option chosen (manual release lets you pick the day after approval).', ''],
      ['s-read', 'If rejected: read the full message first, then fix only what it says. Guideline numbers are categories, not reasons.', 'Our free decoder explains each guideline.'],
      ['s-reply', 'Reply per citation in the Resolution Center, naming the concrete change and how you tested it. Ask for steps if you cannot reproduce.', '']
    ]}
  ];

  function load() {
    try { var raw = window.localStorage.getItem(KEY); return raw ? JSON.parse(raw) || {} : {}; } catch (e) { return {}; }
  }
  function save(state) {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (e) { return false; }
  }

  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', function () {
    var host = document.getElementById('stages');
    var overall = document.getElementById('overall-bar');
    var overallText = document.getElementById('overall-text');
    var storeNote = document.getElementById('store-note');
    if (!host) return;
    var state = load();
    var total = 0;

    function update() {
      var doneAll = 0;
      STAGES.forEach(function (s) {
        var d = s.items.filter(function (it) { return state[it[0]]; }).length;
        doneAll += d;
        var c = document.getElementById('count-' + s.id);
        if (c) c.textContent = d + ' / ' + s.items.length;
      });
      var pct = total ? Math.round(doneAll / total * 100) : 0;
      overall.style.width = pct + '%';
      overall.parentNode.setAttribute('aria-valuenow', String(pct));
      overallText.textContent = doneAll + ' of ' + total + ' done (' + pct + '%)';
    }

    STAGES.forEach(function (s) {
      var card = document.createElement('section');
      card.className = 'card';
      var head = document.createElement('div');
      head.className = 'stage-head';
      var h = document.createElement('h2'); h.style.marginTop = '0'; h.textContent = s.title;
      var cnt = document.createElement('span'); cnt.className = 'tag'; cnt.id = 'count-' + s.id;
      head.appendChild(h); head.appendChild(cnt); card.appendChild(head);
      s.items.forEach(function (it) {
        total++;
        var row = document.createElement('div'); row.className = 'item' + (state[it[0]] ? ' done' : '');
        var lab = document.createElement('label'); lab.className = 'check';
        var cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = 'c-' + it[0]; cb.checked = !!state[it[0]];
        var span = document.createElement('span'); span.className = 'text'; span.textContent = it[1];
        lab.appendChild(cb); lab.appendChild(span); row.appendChild(lab);
        if (it[2]) { var why = document.createElement('p'); why.className = 'why'; why.textContent = it[2]; row.appendChild(why); }
        cb.addEventListener('change', function () {
          if (cb.checked) state[it[0]] = 1; else delete state[it[0]];
          row.classList.toggle('done', cb.checked);
          if (!save(state) && storeNote) storeNote.hidden = false;
          update();
        });
        card.appendChild(row);
      });
      host.appendChild(card);
    });
    update();

    var reset = document.getElementById('reset');
    if (reset) reset.addEventListener('click', function () {
      if (!window.confirm('Clear all checkmarks?')) return;
      state = {}; save(state);
      Array.prototype.forEach.call(host.querySelectorAll('input[type=checkbox]'), function (cb) { cb.checked = false; cb.closest('.item').classList.remove('done'); });
      update();
    });

    var copy = document.getElementById('copy-open');
    var out = document.getElementById('open-items');
    if (copy && out) copy.addEventListener('click', function () {
      var lines = [];
      STAGES.forEach(function (s) {
        var open = s.items.filter(function (it) { return !state[it[0]]; });
        if (open.length) { lines.push(s.title); open.forEach(function (it) { lines.push('- ' + it[1]); }); lines.push(''); }
      });
      var text = lines.length ? lines.join('\n').trim() : 'All items checked.';
      out.value = text; out.hidden = false;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { copy.textContent = 'Copied'; }, function () { out.select(); });
        } else out.select();
      } catch (e) { out.select(); }
    });
  });

  if (typeof module !== 'undefined' && module.exports) module.exports = { STAGES: STAGES };
})();
