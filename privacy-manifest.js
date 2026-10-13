/* Ship Desk — PrivacyInfo.xcprivacy generator. Runs only in the browser; nothing is sent anywhere.
   Reason codes: Apple Developer Documentation, NSPrivacyAccessedAPIType possible values
   (developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacyaccessedapitypes/nsprivacyaccessedapitype),
   read 2026-09-29. Explanations are our own plain-English summaries, not Apple's wording. */
(function () {
  'use strict';

  var CATS = [
    {
      key: 'NSPrivacyAccessedAPICategoryUserDefaults',
      label: 'User defaults',
      apis: 'UserDefaults (the small key-value store most apps use for settings).',
      common: 'CA92.1',
      plugins: 'Usually triggered by storage plugins: @capacitor/preferences, Flutter shared_preferences, React Native AsyncStorage, and the frameworks themselves. If the app only stores its own settings, CA92.1 is the usual fit.',
      reasons: [
        { code: 'CA92.1', text: 'Read and write data that only this app can access.', detail: 'Cannot be used to read what other apps or the system wrote, or to write data other apps can read.' },
        { code: '1C8F.1', text: 'Read and write data shared only within your App Group (your app, its extensions, App Clips).', detail: 'Pick this if you share settings with a widget or extension through an App Group.' },
        { code: 'AC6B.1', text: 'Read the managed app configuration set by MDM, or store feedback for MDM.', detail: 'Only for apps deployed and configured by an organisation through device management.' },
        { code: 'C56D.1', sdk: true, text: 'Third-party SDK only: a wrapper function the app calls to use user defaults.', detail: 'Not for an app’s own manifest.' }
      ]
    },
    {
      key: 'NSPrivacyAccessedAPICategoryFileTimestamp',
      label: 'File timestamp',
      apis: 'Creation and modification dates of files, and stat-family calls.',
      common: 'C617.1',
      plugins: 'Usually triggered by file and cache plugins: @capacitor/filesystem, Flutter path_provider, sqflite, image caches. If they only look at files inside the app’s own container, C617.1 is the usual fit. If users pick files with a document picker, add 3B52.1.',
      reasons: [
        { code: 'C617.1', text: 'Read timestamps, size or other metadata of files inside the app’s own container, app group container or CloudKit container.', detail: 'The common case: caches, downloads and databases the app itself created.' },
        { code: '3B52.1', text: 'Read metadata of files or folders the user specifically gave access to, for example through a document picker.', detail: 'Add this if the app opens files the user chooses from Files or iCloud Drive.' },
        { code: 'DDA9.1', text: 'Show file timestamps to the person using the device.', detail: 'The information, or anything derived from it, may not leave the device.' },
        { code: '0A2A.1', sdk: true, text: 'Third-party SDK only: a wrapper function the app calls to read file timestamps.', detail: 'Not for an app’s own manifest.' }
      ]
    },
    {
      key: 'NSPrivacyAccessedAPICategorySystemBootTime',
      label: 'System boot time',
      apis: 'systemUptime and mach_absolute_time(), often used for timers and measuring durations.',
      common: '35F9.1',
      plugins: 'Usually triggered by frameworks and SDKs measuring elapsed time (animations, timers, performance or analytics SDKs). If the code only measures time between events in the app, 35F9.1 is the usual fit.',
      reasons: [
        { code: '35F9.1', text: 'Measure time elapsed between events inside the app, or run timers.', detail: 'Boot time may not leave the device; the elapsed durations may.' },
        { code: '8FFB.1', text: 'Calculate absolute timestamps for events inside the app (for example UIKit or audio events).', detail: 'The resulting event timestamps may leave the device; boot time itself may not.' },
        { code: '3D61.1', text: 'Include boot time in an optional bug report the user chooses to send.', detail: 'Must be shown prominently in the report, and sent only when the user submits it.' }
      ]
    },
    {
      key: 'NSPrivacyAccessedAPICategoryDiskSpace',
      label: 'Disk space',
      apis: 'Available and total storage capacity (volume capacity keys, statfs and similar).',
      common: 'E174.1',
      plugins: 'Usually triggered by plugins that download, cache or record, and by device-info plugins (for example @capacitor/device, Flutter device_info_plus). If the code checks free space before writing or to clean up, E174.1 fits. If the app shows free space to the user, 85F4.1 fits. Neither allows sending disk space to your server or analytics.',
      reasons: [
        { code: 'E174.1', text: 'Check there is enough space before writing files, or detect low space and delete files.', detail: 'The app must behave differently in a way users can see. May not leave the device, except to skip a download when space is short.' },
        { code: '85F4.1', text: 'Show disk space to the person using the device.', detail: 'May not leave the device (narrow exception for showing it on the same person’s other device over the local network, with permission).' },
        { code: '7D9E.1', text: 'Include disk space in an optional bug report the user chooses to send.', detail: 'Must be shown prominently in the report, and sent only when the user submits it.' },
        { code: 'B728.1', text: 'Health research apps only: warn participants that low space affects research data collection.', detail: 'Only for apps whose sole purpose is health research under Guideline 5.1.3.' }
      ]
    },
    {
      key: 'NSPrivacyAccessedAPICategoryActiveKeyboards',
      label: 'Active keyboards',
      apis: 'The list of keyboards active on the device (activeInputModes).',
      common: '54BD.1',
      plugins: 'Rare in wrapped apps. Some text-input or keyboard-handling plugins read it. If the app changes its interface based on the active keyboard, 54BD.1 fits; if nothing visibly changes, find which plugin uses it and update it before declaring anything.',
      reasons: [
        { code: '54BD.1', text: 'Show the correct customised interface for the active keyboard.', detail: 'The app must have text fields and visibly behave differently depending on the keyboard. May not leave the device.' },
        { code: '3EC4.1', text: 'Custom keyboard apps only: find which keyboards are active.', detail: 'Only if providing a system-wide keyboard is the app’s main purpose.' }
      ]
    }
  ];

  var DATATYPES = [
    ['NSPrivacyCollectedDataTypeEmailAddress', 'Email address'],
    ['NSPrivacyCollectedDataTypeName', 'Name'],
    ['NSPrivacyCollectedDataTypePhoneNumber', 'Phone number'],
    ['NSPrivacyCollectedDataTypeUserID', 'User ID (account ID)'],
    ['NSPrivacyCollectedDataTypeDeviceID', 'Device ID (for example a push token or advertising ID)'],
    ['NSPrivacyCollectedDataTypePurchaseHistory', 'Purchase history'],
    ['NSPrivacyCollectedDataTypePaymentInfo', 'Payment info'],
    ['NSPrivacyCollectedDataTypePreciseLocation', 'Precise location'],
    ['NSPrivacyCollectedDataTypeCoarseLocation', 'Coarse location'],
    ['NSPrivacyCollectedDataTypePhotosorVideos', 'Photos or videos'],
    ['NSPrivacyCollectedDataTypeOtherUserContent', 'Other user content (posts, notes, uploads)'],
    ['NSPrivacyCollectedDataTypeProductInteraction', 'Product interaction (taps, screens viewed)'],
    ['NSPrivacyCollectedDataTypeCrashData', 'Crash data'],
    ['NSPrivacyCollectedDataTypePerformanceData', 'Performance data']
  ];
  var PURPOSES = [
    ['NSPrivacyCollectedDataTypePurposeAppFunctionality', 'App functionality'],
    ['NSPrivacyCollectedDataTypePurposeAnalytics', 'Analytics'],
    ['NSPrivacyCollectedDataTypePurposeProductPersonalization', 'Product personalisation'],
    ['NSPrivacyCollectedDataTypePurposeDeveloperAdvertising', 'Your own advertising or marketing'],
    ['NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising', 'Third-party advertising'],
    ['NSPrivacyCollectedDataTypePurposeOther', 'Other']
  ];

  var SAMPLE = 'ITMS-91053: Missing API declaration - Your app’s code in the “App” file references one or more APIs that require reasons, including the following API categories: NSPrivacyAccessedAPICategoryUserDefaults. While no action is required at this time, starting May 1, 2024, when you upload a new app or app update, you must include a NSPrivacyAccessedAPITypes array in your app’s privacy manifest to provide approved reasons for these APIs used by your app’s code.\n\n' +
    'ITMS-91053: Missing API declaration - Your app’s code in the “Frameworks/Capacitor.framework/Capacitor” file references one or more APIs that require reasons, including the following API categories: NSPrivacyAccessedAPICategoryFileTimestamp.\n\n' +
    'ITMS-91053: Missing API declaration - Your app’s code in the “App” file references one or more APIs that require reasons, including the following API categories: NSPrivacyAccessedAPICategoryDiskSpace.';

  // Known framework names -> plain hint. Everything else gets the generic framework note.
  var KNOWN = [
    [/^capacitor(cordova)?$/i, 'Capacitor core. Update @capacitor/ios (at least 4.8.2, 5.7.4, 6.0.0 or 7.0.0 by major version, per Capacitor’s docs), then run npx cap sync ios.'],
    [/^capacitor/i, 'A Capacitor plugin. Update the matching @capacitor/* or community package, then run npx cap sync ios.'],
    [/^(flutter|app)$/i, 'The Flutter engine or your compiled Dart code. Update Flutter to a current stable release.'],
    [/_foundation$|_ios$|_darwin$|_plus$|^sqflite/i, 'A Flutter plugin. Update it in pubspec.yaml (flutter pub upgrade), then pod install in ios/.'],
    [/^(react|hermes|rnc|rn|yoga)/i, 'React Native or one of its packages. Update React Native and the named package, then pod install in ios/.'],
    [/^(firebase|google|fbl|fbsdk|nanopb|grpc|promises)/i, 'A Google/Firebase or Facebook SDK. Update it to a current version that ships its own manifest.']
  ];

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'text') n.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- Build the form ---------- */
  function buildCats() {
    var host = $('cats');
    CATS.forEach(function (c) {
      var catBox = el('input', { type: 'checkbox', id: 'cat-' + c.key, 'data-cat': c.key });
      var reasons = el('div', { 'class': 'reason-list' });
      c.reasons.forEach(function (r) {
        var box = el('input', { type: 'checkbox', id: 'r-' + c.key + '-' + r.code, 'data-reason': r.code, 'data-cat': c.key });
        if (r.sdk) box.disabled = true;
        var tags = [];
        if (r.code === c.common) tags.push(el('span', { 'class': 'tag accent', text: 'Common for wrapped apps' }));
        if (r.sdk) tags.push(el('span', { 'class': 'tag', text: 'SDK only' }));
        var label = el('label', { 'class': 'check', 'for': box.id }, [box, el('span', null, [
          el('code', { text: r.code }), ' ', r.text, ' '
        ].concat(tags))]);
        reasons.appendChild(el('div', { 'class': 'reason' + (r.sdk ? ' sdk-only' : '') }, [label, el('p', { 'class': 'why', text: r.detail })]));
      });
      var card = el('div', { 'class': 'card cat', 'data-on': 'false', id: 'card-' + c.key }, [
        el('div', { 'class': 'cat-head' }, [
          el('label', { 'class': 'check', 'for': catBox.id, style: 'margin:0' }, [catBox, el('span', null, [
            el('strong', { text: c.label }), el('span', { 'class': 'hint' }, [el('code', { text: c.key })])
          ])])
        ]),
        el('p', { 'class': 'apis', text: 'Covers: ' + c.apis }),
        el('div', { 'class': 'reasons' }, [
          reasons,
          el('p', { 'class': 'plugin-hint' }, [el('strong', { text: 'Which to pick: ' }), c.plugins])
        ])
      ]);
      host.appendChild(card);
      catBox.addEventListener('change', function () {
        setCat(c.key, catBox.checked, false);
        render();
      });
      reasons.addEventListener('change', render);
    });
  }

  function setCat(key, on, preselect) {
    var box = $('cat-' + key);
    box.checked = on;
    $('card-' + key).setAttribute('data-on', on ? 'true' : 'false');
    if (on && preselect) {
      var c = CATS.filter(function (x) { return x.key === key; })[0];
      var anyChecked = document.querySelectorAll('input[data-reason][data-cat="' + key + '"]:checked').length > 0;
      if (!anyChecked) $('r-' + key + '-' + c.common).checked = true;
    }
  }

  function buildDataTypes() {
    var host = $('datatypes');
    DATATYPES.forEach(function (d) {
      var id = 'dt-' + d[0];
      var box = el('input', { type: 'checkbox', id: id, 'data-dt': d[0] });
      var linked = el('input', { type: 'checkbox', id: id + '-linked', checked: 'checked' });
      var tracking = el('input', { type: 'checkbox', id: id + '-tracking' });
      var purposes = el('div', { 'class': 'purposes' });
      PURPOSES.forEach(function (p, i) {
        var pb = el('input', { type: 'checkbox', id: id + '-p-' + i, 'data-purpose': p[0] });
        if (i === 0) pb.checked = true;
        purposes.appendChild(el('label', { 'class': 'check', 'for': pb.id }, [pb, el('span', { text: p[1] })]));
      });
      var row = el('div', { 'class': 'dt-row', 'data-on': 'false', id: 'row-' + d[0] }, [
        el('label', { 'class': 'check', 'for': id }, [box, el('span', { text: d[1] })]),
        el('div', { 'class': 'dt-opts' }, [
          el('label', { 'class': 'check', 'for': linked.id }, [linked, el('span', { text: 'Linked to the user’s identity (account, email, device ID)' })]),
          el('label', { 'class': 'check', 'for': tracking.id }, [tracking, el('span', { text: 'Used for tracking (see section 2)' })]),
          el('p', { 'class': 'hint', text: 'Purposes (at least one):', style: 'margin:6px 0 0' }),
          purposes
        ])
      ]);
      row.addEventListener('change', function () {
        row.setAttribute('data-on', box.checked ? 'true' : 'false');
        render();
      });
      host.appendChild(row);
    });
  }

  /* ---------- Parse the email ---------- */
  function parseEmail(text) {
    var result = { cats: {}, files: [] };
    var norm = text.replace(/[“”″]/g, '"').replace(/[‘’]/g, "'");
    var blocks = norm.split(/ITMS-91053/i);
    if (blocks.length < 2) blocks = ['', norm];
    blocks.slice(1).forEach(function (b) {
      var fm = b.match(/code in the\s+"([^"]+)"\s+file/i);
      var file = fm ? fm[1].trim() : null;
      var found = [];
      CATS.forEach(function (c) {
        var short = c.key.replace('NSPrivacyAccessedAPICategory', '');
        var re = new RegExp('NSPrivacyAccessedAPICategory' + short + '\\b', 'i');
        if (re.test(b)) { found.push(c.key); result.cats[c.key] = true; }
      });
      if (file && found.length) result.files.push({ file: file, cats: found });
    });
    // Fallback: categories mentioned anywhere (for example a partial paste without ITMS lines).
    CATS.forEach(function (c) {
      if (new RegExp(c.key + '\\b', 'i').test(norm)) result.cats[c.key] = true;
    });
    // Unknown category names Apple may add later.
    var unknown = {};
    (norm.match(/NSPrivacyAccessedAPICategory[A-Za-z]+/g) || []).forEach(function (k) {
      if (!CATS.some(function (c) { return c.key.toLowerCase() === k.toLowerCase(); })) unknown[k] = true;
    });
    result.unknown = Object.keys(unknown);
    return result;
  }

  function hintForFile(file) {
    var m = file.match(/Frameworks\/([^\/]+?)\.framework/i);
    if (!m) {
      return { kind: 'app', text: 'This is your app’s own binary, which includes statically linked plugins. Declare these categories in your app’s PrivacyInfo.xcprivacy (this file), and also update the plugins that use them.' };
    }
    var name = m[1];
    for (var i = 0; i < KNOWN.length; i++) {
      if (KNOWN[i][0].test(name)) return { kind: 'fw', name: name, text: KNOWN[i][1] + ' A framework needs its own privacy manifest; your app’s file does not cover it.' };
    }
    return { kind: 'fw', name: name, text: 'A third-party framework. Update it to a version that ships its own PrivacyInfo.xcprivacy. A framework needs its own manifest; your app’s file does not cover it. If no updated version exists, ask its maintainer or replace it.' };
  }

  function catLabel(key) {
    var c = CATS.filter(function (x) { return x.key === key; })[0];
    return c ? c.label : key;
  }

  function showFound(res) {
    var host = $('found');
    host.textContent = '';
    var keys = Object.keys(res.cats);
    if (!keys.length && !res.unknown.length) {
      $('parse-status').textContent = 'No API category names found. Check you copied the lines starting with ITMS-91053, or tick categories below.';
      $('parse-status').className = 'status err';
      return;
    }
    $('parse-status').className = 'status ok';
    $('parse-status').textContent = 'Found ' + keys.length + ' categor' + (keys.length === 1 ? 'y' : 'ies') + '. Pre-selected the common reason for each; confirm each one below.';
    var card = el('div', { 'class': 'card' }, [el('h2', { text: 'What the email says', style: 'margin-top:0' })]);
    if (res.files.length) {
      var ul = el('ul', { 'class': 'plain' });
      res.files.forEach(function (f) {
        var h = hintForFile(f.file);
        ul.appendChild(el('li', null, [
          el('code', { text: f.file }), ': ', f.cats.map(catLabel).join(', '), '. ',
          el('span', { 'class': 'muted', text: h.text })
        ]));
      });
      card.appendChild(ul);
    } else {
      card.appendChild(el('p', { text: 'Categories: ' + keys.map(catLabel).join(', ') + '. The file names were not in the pasted text, so we cannot tell which plugin uses them.' }));
    }
    if (res.unknown.length) {
      card.appendChild(el('p', { 'class': 'note' }, ['Not in our list: ', el('code', { text: res.unknown.join(', ') }), '. Apple may have added a category after 2026-09-29. Look it up in Apple’s "Describing use of required reason API" page and add it to the file by hand.']));
    }
    host.appendChild(card);
  }

  /* ---------- Generate plist ---------- */
  function collect() {
    var state = { apis: [], missing: [], tracking: $('tracking').checked, domains: [], data: [], dataWarn: [] };
    CATS.forEach(function (c) {
      if (!$('cat-' + c.key).checked) return;
      var codes = [];
      document.querySelectorAll('input[data-reason][data-cat="' + c.key + '"]').forEach(function (b) {
        if (b.checked && !b.disabled) codes.push(b.getAttribute('data-reason'));
      });
      if (codes.length) state.apis.push({ key: c.key, codes: codes });
      else state.missing.push(c.label);
    });
    if (state.tracking) {
      state.domains = $('domains').value.split(/[\s,]+/).map(function (s) {
        return s.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
      }).filter(function (s) { return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(s); });
    }
    DATATYPES.forEach(function (d) {
      var id = 'dt-' + d[0];
      if (!$(id).checked) return;
      var purposes = [];
      document.querySelectorAll('#row-' + d[0] + ' input[data-purpose]').forEach(function (p) { if (p.checked) purposes.push(p.getAttribute('data-purpose')); });
      if (!purposes.length) state.dataWarn.push(d[1]);
      var tr = $(id + '-tracking').checked;
      state.data.push({ type: d[0], linked: $(id + '-linked').checked, tracking: tr, purposes: purposes });
    });
    return state;
  }

  function plist(state) {
    var L = [];
    L.push('<?xml version="1.0" encoding="UTF-8"?>');
    L.push('<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">');
    L.push('<plist version="1.0">');
    L.push('<dict>');
    L.push('\t<key>NSPrivacyTracking</key>');
    L.push('\t<' + (state.tracking ? 'true' : 'false') + '/>');
    L.push('\t<key>NSPrivacyTrackingDomains</key>');
    if (state.domains.length) {
      L.push('\t<array>');
      state.domains.forEach(function (d) { L.push('\t\t<string>' + esc(d) + '</string>'); });
      L.push('\t</array>');
    } else L.push('\t<array/>');
    L.push('\t<key>NSPrivacyCollectedDataTypes</key>');
    var data = state.data.filter(function (d) { return d.purposes.length; });
    if (data.length) {
      L.push('\t<array>');
      data.forEach(function (d) {
        L.push('\t\t<dict>');
        L.push('\t\t\t<key>NSPrivacyCollectedDataType</key>');
        L.push('\t\t\t<string>' + d.type + '</string>');
        L.push('\t\t\t<key>NSPrivacyCollectedDataTypeLinked</key>');
        L.push('\t\t\t<' + (d.linked ? 'true' : 'false') + '/>');
        L.push('\t\t\t<key>NSPrivacyCollectedDataTypeTracking</key>');
        L.push('\t\t\t<' + (d.tracking ? 'true' : 'false') + '/>');
        L.push('\t\t\t<key>NSPrivacyCollectedDataTypePurposes</key>');
        L.push('\t\t\t<array>');
        d.purposes.forEach(function (p) { L.push('\t\t\t\t<string>' + p + '</string>'); });
        L.push('\t\t\t</array>');
        L.push('\t\t</dict>');
      });
      L.push('\t</array>');
    } else L.push('\t<array/>');
    L.push('\t<key>NSPrivacyAccessedAPITypes</key>');
    if (state.apis.length) {
      L.push('\t<array>');
      state.apis.forEach(function (a) {
        L.push('\t\t<dict>');
        L.push('\t\t\t<key>NSPrivacyAccessedAPIType</key>');
        L.push('\t\t\t<string>' + a.key + '</string>');
        L.push('\t\t\t<key>NSPrivacyAccessedAPITypeReasons</key>');
        L.push('\t\t\t<array>');
        a.codes.forEach(function (c) { L.push('\t\t\t\t<string>' + c + '</string>'); });
        L.push('\t\t\t</array>');
        L.push('\t\t</dict>');
      });
      L.push('\t</array>');
    } else L.push('\t<array/>');
    L.push('</dict>');
    L.push('</plist>');
    return L.join('\n') + '\n';
  }

  var current = '';
  function render() {
    var state = collect();
    current = plist(state);
    $('plist').textContent = current;
    var warns = [];
    if (state.missing.length) warns.push('No reason ticked for: ' + state.missing.join(', ') + '. Left out of the file; Apple needs at least one reason per category.');
    if (state.dataWarn.length) warns.push('No purpose ticked for: ' + state.dataWarn.join(', ') + '. Left out of the file.');
    var trackedData = state.data.some(function (d) { return d.tracking; });
    if (trackedData && !state.tracking) warns.push('A data type is marked as used for tracking, but "This app tracks users" is off. Make them consistent.');
    if (state.tracking && !state.domains.length) warns.push('Tracking is on but no tracking domains are listed. Add the domains your tracking SDKs contact, if you know them.');
    if (!state.apis.length) warns.push('No API categories selected yet. Paste the email above or tick the categories it lists.');
    var w = $('out-warn');
    w.hidden = !warns.length;
    w.textContent = warns.join(' ');
  }

  /* ---------- Wire up ---------- */
  function flash(btn, label) {
    var old = btn.textContent;
    btn.textContent = label;
    setTimeout(function () { btn.textContent = old; }, 1600);
  }
  function selectPre() {
    var r = document.createRange();
    r.selectNodeContents($('plist'));
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  function init() {
    buildCats();
    buildDataTypes();

    $('parse-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var res = parseEmail($('email').value || '');
      Object.keys(res.cats).forEach(function (k) { setCat(k, true, true); });
      showFound(res);
      render();
      if (Object.keys(res.cats).length) $('found').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('sample').addEventListener('click', function () {
      $('email').value = SAMPLE;
      $('parse-form').requestSubmit ? $('parse-form').requestSubmit() : $('parse-form').dispatchEvent(new Event('submit', { cancelable: true }));
    });
    $('clear').addEventListener('click', function () {
      $('email').value = '';
      document.querySelectorAll('main input[type="checkbox"]').forEach(function (b) { b.checked = false; });
      document.querySelectorAll('input[data-purpose]').forEach(function (b, i) { b.checked = /AppFunctionality$/.test(b.getAttribute('data-purpose')); });
      document.querySelectorAll('[id^="dt-"][id$="-linked"]').forEach(function (b) { b.checked = true; });
      document.querySelectorAll('.cat').forEach(function (c) { c.setAttribute('data-on', 'false'); });
      document.querySelectorAll('.dt-row').forEach(function (c) { c.setAttribute('data-on', 'false'); });
      $('domains').value = '';
      $('domains-field').hidden = true;
      $('found').textContent = '';
      $('parse-status').textContent = '';
      render();
    });
    $('tracking').addEventListener('change', function () {
      $('domains-field').hidden = !$('tracking').checked;
      render();
    });
    $('domains').addEventListener('input', render);

    $('copy').addEventListener('click', function () {
      var btn = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(current).then(function () { flash(btn, 'Copied'); }, function () { selectPre(); flash(btn, 'Press Cmd/Ctrl+C'); });
      } else { selectPre(); flash(btn, 'Press Cmd/Ctrl+C'); }
    });
    $('download').addEventListener('click', function () {
      var blob = new Blob([current], { type: 'application/xml' });
      var url = URL.createObjectURL(blob);
      var a = el('a', { href: url, download: 'PrivacyInfo.xcprivacy' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });

    render();
  }

  // Exposed for automated checks only (no network use).
  window.ShipDeskPrivacy = { parseEmail: parseEmail, plist: plist, CATS: CATS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
