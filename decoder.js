/* App Review Rejection Decoder — runs entirely in the browser. Nothing is sent anywhere. */
(function (root) {
  'use strict';

  // Each rule: key (guideline id as Apple prints it), title, phrases (regexes that
  // identify the issue even when the number is missing), meaning, causes (typical in
  // apps built with AI app builders), fix (steps), reply (template), suppresses (keys
  // this more specific rule makes redundant).
  var RULES = [
    {
      key: '2.1', title: 'App Completeness (bugs, crashes, broken flows)',
      phrases: [/app completeness/i, /\bcrash(ed|es)?\b/i, /not responsive|unresponsive|did not respond/i, /\bbugs?\b/i],
      meaning: 'The reviewer hit something that did not work: a crash, a button that did nothing, an endless spinner, a blank screen, or a link that went nowhere. Apple reviews on current devices, often an iPad, even if you only designed for iPhone.',
      causes: [
        'The build points at a development backend, or an API key was left out of the release build.',
        'A login or sign-up path works on your phone but not for a brand-new account.',
        'The layout breaks on iPad, so a button is off-screen or covered.',
        'Placeholder text, "coming soon" buttons or test data are still reachable.'
      ],
      fix: [
        'Copy the exact device and OS from the rejection (for example "iPad Air, iPadOS ...") and test on that class of device.',
        'Walk the path the reviewer describes with a brand-new account, not your own logged-in one.',
        'If you cannot reproduce it, do not guess and resubmit. Reply and ask for the exact steps: Apple\'s answer often names the real cause in one sentence.',
        'Remove or finish every placeholder, "beta" label and dead button the reviewer could reach.',
        'Fix, build a new version number, upload, and test the TestFlight build before you resubmit.'
      ],
      reply: 'Hello,\n\nThank you for the details. Regarding Guideline 2.1: [describe in one or two sentences what was actually wrong, e.g. "after signing in, the app did not move to the next screen until it was relaunched"]. We fixed this in build [version (build)] by [the concrete change]. We tested the fix on [device + OS].\n\n[If you could not reproduce it, use this instead: "We were not able to reproduce this on [devices tested]. Could you share the steps and the screen where it happened? We want to fix the real cause rather than guess."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.1-info', standalone: true, title: 'Information Needed (demo account or explanation)',
      phrases: [/information needed/i, /demo account/i, /(unable|not able) to (sign|log) ?in/i, /provide (us with )?(a |the )?(user ?name|credentials|login)/i],
      suppresses: ['2.1'],
      meaning: 'This is often a question, not a verdict. The reviewer could not get far enough into the app to judge it, usually because it needs a login and no working test account was provided, or because a feature needs hardware, a location or an invite code.',
      causes: [
        'The "Sign-in required" box in App Review Information was left empty, or the demo password expired.',
        'The demo account needs email verification or a code sent to your phone.',
        'Apple asked for a specific account state (for example "an account with an expired subscription") and none exists.'
      ],
      fix: [
        'Create a dedicated reviewer account that works without email or SMS verification.',
        'Fill in App Store Connect > your version > App Review Information > Sign-in required, with user name and password.',
        'In Notes, tell the reviewer in 3 to 5 lines where to tap to see the main features.',
        'If Apple asked for a special account state, create exactly that state. Do not change your normal demo so it opens on a paywall.',
        'Reply in the Resolution Center. A new build is often not needed for this one.'
      ],
      reply: 'Hello,\n\nThank you for letting us know. We have added a demo account to App Review Information:\n\nUser name: [user]\nPassword: [password]\n\nAfter signing in, [one line on where to start, e.g. "tap Projects to see the main feature"]. [If Apple asked for a specific state: "This account is in the [expired subscription / free] state you asked for."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.1(b)', standalone: true, title: 'In-app purchases not complete or not reachable',
      phrases: [/(unable|not able) to (access|locate|find) (the )?in[- ]app purchase/i, /in[- ]app purchase products? (have not been|were not) submitted/i],
      suppresses: ['2.1'],
      meaning: 'The reviewer could not find or complete a purchase. Either the products are not attached to this version in App Store Connect, or the app could not load them, so the paywall showed an error or nothing.',
      causes: [
        'Product IDs in the app (or in RevenueCat or another billing service) do not match the IDs in App Store Connect.',
        'The subscription products were created but never attached to this app version for review.',
        'The Paid Apps agreement, tax or banking section in App Store Connect is not complete, so products cannot load.',
        'The purchase button is only visible on some plans or screens.'
      ],
      fix: [
        'Compare every product ID character by character between App Store Connect and your billing setup.',
        'Open the version page and make sure the in-app purchases are attached under "In-App Purchases and Subscriptions".',
        'Account holder: confirm Agreements, Tax, and Banking shows the Paid Apps agreement as active.',
        'Complete one sandbox purchase on a real device before you reply.',
        'First-time in-app purchases are reviewed together with a version. If you remove the build from review, check they are still attached before resubmitting.'
      ],
      reply: 'Hello,\n\nThank you. The in-app purchases could not load because [the concrete cause, e.g. "the product identifiers in our billing configuration did not match those in App Store Connect"]. We corrected this and confirmed a sandbox purchase completes on [device]. The purchase screen is reached by [path, e.g. "Settings > Upgrade"].\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.2', title: 'Beta or trial versions',
      phrases: [/\bbeta\b.*(version|label|build)/i, /demo, beta, or trial/i],
      meaning: 'The app presents itself as unfinished: a "Beta" badge, "test version" text, or features marked as not yet available. Pre-release builds belong in TestFlight, not on the App Store.',
      causes: ['The builder template shows a "Beta" badge.', 'Menu items say "coming soon".'],
      fix: ['Remove "beta", "preview" and "coming soon" wording from the app and from screenshots.', 'Hide unfinished features entirely instead of showing them disabled.', 'Upload a new build.'],
      reply: 'Hello,\n\nWe removed the pre-release wording ([where it appeared]) and hid the unfinished [feature] in build [version]. The app now only shows complete features.\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.3', title: 'Accurate Metadata',
      phrases: [/accurate metadata/i],
      meaning: 'Something in your App Store listing (name, description, screenshots, preview, keywords, category) does not match what the app actually does.',
      causes: ['The description promises features the build does not have yet.', 'Screenshots are marketing mockups rather than the real app.'],
      fix: ['Read the specific sub-guideline in the message (2.3.3, 2.3.7, 2.3.10 and so on) and fix only what it names.', 'Edit the listing in App Store Connect. Many metadata-only issues do not need a new build.', 'Reply in the Resolution Center saying what you changed.'],
      reply: 'Hello,\n\nWe updated the [description / screenshots / name] so it matches the app: [what changed]. [If no new build: "No binary change was needed."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.3.3', title: 'Screenshots do not show the app in use',
      phrases: [/screenshots? (do not|don\'t) (sufficiently )?(reflect|show)/i, /splash screen|login screen.*screenshot/i],
      suppresses: ['2.3'],
      meaning: 'Your screenshots are mostly title art, a splash or login screen, or device frames with little of the real app. Apple wants to see the app being used.',
      causes: ['Screenshots made from a marketing page, not the app.', 'Only the sign-in screen was captured.', 'iPad screenshots are stretched iPhone images.'],
      fix: ['Capture real screens with realistic sample data (at least the 6.9-inch iPhone size; 13-inch iPad if the app runs on iPad).', 'Show the main feature in the first two screenshots.', 'Captions are fine, but the app must be the main content.', 'Upload in App Store Connect > your version > Previews and Screenshots.'],
      reply: 'Hello,\n\nWe replaced the screenshots with captures of the app in use, showing [main features]. No binary change was needed.\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.3.7', title: 'Name, subtitle or keywords misleading or stuffed',
      phrases: [/keywords?.*(irrelevant|misleading|competitor)/i, /app name.*(keyword|descriptive terms)/i],
      suppresses: ['2.3'],
      meaning: 'The app name or subtitle is packed with search terms, uses another company\'s brand, or claims something the app is not.',
      causes: ['Name like "Budget Planner - Money, Finance, Expense Tracker".', 'Keywords include competitor or famous brand names.'],
      fix: ['Use a short, distinct name (30 characters max) and move descriptive words to the subtitle.', 'Remove other brands from name, subtitle and keywords.', 'Update the listing and reply.'],
      reply: 'Hello,\n\nWe changed the app name to "[new name]" and removed [terms] from the keywords.\n\nBest regards,\n[Your name]'
    },
    {
      key: '2.3.10', title: 'Mentions of other platforms (Android, Google Play, web)',
      phrases: [/android|google play|other (mobile )?platforms?/i],
      suppresses: ['2.3'],
      meaning: 'The app or listing mentions Android, Google Play or another platform. Apple does not allow that in the app or its metadata.',
      causes: ['Screenshots or text copied from a web or Android version.', 'A footer that says "Get it on Google Play".', 'Help text that says "on Android, tap..."'],
      fix: ['Search the app, description, What\'s New and screenshots for "Android", "Google", "Play Store", "Chrome".', 'Remove them, or hide them on iOS only.', 'If the words were in the app, upload a new build.'],
      reply: 'Hello,\n\nWe removed references to other platforms from [the app / description / screenshots].\n\nBest regards,\n[Your name]'
    },
    {
      key: '1.5', title: 'Developer information (support URL, contact)',
      phrases: [/support url/i, /contact information.*(not|missing|incomplete)/i],
      meaning: 'The Support URL does not load, or it does not give users a way to reach you.',
      causes: ['Support URL points to the app\'s home page with no contact method.', 'The domain is not live yet.'],
      fix: ['Publish a simple support page with a contact email or form.', 'Update Support URL in App Store Connect > App Information.', 'Reply; usually no new build is needed.'],
      reply: 'Hello,\n\nThe Support URL now points to [URL], which lists how to contact us.\n\nBest regards,\n[Your name]'
    },
    {
      key: '3', standalone: true, title: 'Business: price confirmation question',
      phrases: [/(confirm|verify).{0,60}(price|pricing)/i, /pricing.{0,40}intended/i],
      meaning: 'Often not a defect. Apple sometimes asks you to confirm an unusually high or unusual price is intentional. It still blocks review until you answer.',
      causes: ['A subscription priced far above consumer norms (for example a business tool).'],
      fix: ['Do not change anything in the build.', 'Reply confirming each price, who it is for, and what it includes.'],
      reply: 'Hello,\n\nYes, we confirm the prices are intended:\n\n- [Product] — [price] / [period]\n\n[One or two sentences: who buys this and what it covers, e.g. "This is a business plan for teams of up to 25 users."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '3.1.1', title: 'In-App Purchase required for digital content',
      phrases: [/in[- ]app purchase.{0,80}(unlock|required|must use)/i, /external (purchase|payment)|payment mechanisms? other than in[- ]app purchase/i, /\bstripe\b/i],
      meaning: 'The app sells or unlocks digital features or content (premium features, credits, subscriptions to the app itself) with a payment method other than Apple\'s In-App Purchase, or links out to one.',
      causes: [
        'A Stripe checkout or "Upgrade on our website" button inside the app.',
        'A web-wrapped app that shows the same pricing page as the website.'
      ],
      fix: [
        'Decide what you sell. Digital features or content used in the app generally need In-App Purchase. Physical goods and real-world services (deliveries, bookings, coaching in person) can use your own payments.',
        'Either add In-App Purchase (StoreKit, or a service such as RevenueCat), or remove every purchase button, price and payment link from the iOS app.',
        'Rules on linking to outside payment differ by country storefront and changed for the United States in 2025. Read the current text of Guideline 3.1.1 and 3.1.3 before relying on an exception.',
        'Upload a new build and explain the change in your reply.'
      ],
      reply: 'Hello,\n\nWe [removed the external purchase button and pricing from the iOS app / added In-App Purchase for (product)] in build [version]. [If you sell physical goods or services: "The payments in our app are for (physical goods / in-person services), which are consumed outside the app."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '3.1.2', title: 'Subscription information missing',
      phrases: [/auto-renewable subscription/i, /terms of use|\bEULA\b/i, /functional link to the terms/i],
      meaning: 'Your subscription purchase screen or listing is missing required information: title, length, price, and working links to your Terms of Use (EULA) and Privacy Policy.',
      causes: ['A paywall that shows only a "Subscribe" button.', 'No Terms of Use link in the app or in the App Store description.'],
      fix: [
        'On the purchase screen, show plan name, length, price per period, and links to Terms of Use and Privacy Policy.',
        'Add the Terms of Use link to the App Store description, or use Apple\'s standard EULA and say so.',
        'Upload a new build if the paywall changed.'
      ],
      reply: 'Hello,\n\nThe subscription screen now shows the plan name, length and price, with links to our Terms of Use ([URL]) and Privacy Policy ([URL]). We also added the Terms of Use link to the App Store description.\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.0', title: 'Design (layout, readability, hard to use)',
      phrases: [/\bdesign\b.*(crowded|difficult|hard to|not optimized|iPad)/i, /(buttons?|text).{0,40}(hard to see|not visible|difficult to read|cut off)/i],
      meaning: 'Something looks broken or is hard to use: content cut off on iPad, text too small, controls that do not look like controls, or a required button that is barely visible.',
      causes: [
        'A web layout that assumes a desktop or a narrow phone and breaks on iPad.',
        'A dark button on a dark background. We have seen a sign-in button at 1.04:1 contrast, which is effectively invisible.',
        'Custom-drawn Sign in with Apple button instead of Apple\'s official one.'
      ],
      fix: [
        'Open the app on an iPad (or iPad simulator) in both orientations and fix anything cut off.',
        'Check contrast of key buttons against their background (aim for at least 3:1 for controls, 4.5:1 for text).',
        'Use Apple\'s official Sign in with Apple button style (black on light, white on dark).',
        'Upload a new build and name the measured change in your reply.'
      ],
      reply: 'Hello,\n\nThank you, this was accurate. [What was wrong, with a measurement if you have one, e.g. "the button contrast was 1.04:1 on the dark background"]. In build [version] we [the change, e.g. "switched to Apple\'s official white Sign in with Apple button (17:1 contrast)"].\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.2', title: 'Minimum Functionality (feels like a website)',
      phrases: [/minimum functionality/i, /repackaged website|web ?site.{0,40}(app|wrapper)|web ?view/i, /not (sufficiently )?different from a (mobile )?web/i],
      meaning: 'Apple thinks the app is a website in a wrapper and offers nothing a browser does not. This is the most common rejection for apps made with web-based AI builders and then wrapped.',
      causes: [
        'The app is a single web view of your site, with browser-style navigation and links opening inside the app.',
        'No offline behaviour: a blank white screen with no connection.',
        'Nothing uses the phone: no notifications, camera, sharing, haptics, widgets or saved data.'
      ],
      fix: [
        'Add real native value that fits your app: push notifications, camera or photo input, share sheet, offline screen with cached content, biometric unlock, home screen quick actions.',
        'Use a native tab bar and navigation, not the website\'s header and footer.',
        'Show a proper offline state instead of a blank page.',
        'Remove "download the app" banners, cookie banners and web-only links.',
        'In the reply, list the native features specifically. A vague "we improved the app" usually gets the same result.'
      ],
      reply: 'Hello,\n\nThank you for the feedback. Build [version] adds features that are specific to iOS:\n\n- [Feature 1, e.g. "Push notifications when a booking is confirmed"]\n- [Feature 2, e.g. "Offline access to saved items"]\n- [Feature 3, e.g. "Share sheet export of reports"]\n\nNavigation now uses a native tab bar, and [anything else]. To see these, [short path].\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.2.2', title: 'Mainly marketing material, links or content aggregation',
      phrases: [/marketing materials?|advertisements?|web clippings|content aggregators?|collections? of links/i],
      suppresses: ['4.2'],
      meaning: 'The app mostly advertises a business or lists links and content from elsewhere, without its own useful function.',
      causes: ['A company brochure turned into an app.', 'A list of articles or links that open in a browser.'],
      fix: ['Give the app a job users come back for (booking, tracking, a tool, saved content), then apply the 4.2 steps.', 'If the honest answer is "it is a brochure", a website may be the better home for it.'],
      reply: 'Hello,\n\nBuild [version] now lets users [the core task], which works [offline / with notifications / etc.]. [List features.]\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.2.3', title: 'App does not work on its own',
      phrases: [/requir(e|es|ing) (the )?(installation|use) of another app/i, /(does not|doesn't|cannot) (work|function) on its own/i],
      suppresses: ['4.2'],
      meaning: 'The app needs another app, a desktop login, or a separate purchase before it does anything useful for the reviewer.',
      causes: ['Users must first sign up on the website.', 'The app only mirrors content created elsewhere and is empty for a new account.'],
      fix: ['Allow sign-up inside the app, or provide a demo account with data.', 'Make sure a new user sees something useful without leaving the app.'],
      reply: 'Hello,\n\nUsers can now [sign up / start] inside the app, and a new account opens with [what they see]. Demo credentials are in App Review Information.\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.2.6', title: 'Made from a template or app-generation service',
      phrases: [/commercialized template|app generation service|template or app generation/i],
      suppresses: ['4.2'],
      meaning: 'Apple believes the app was produced by a template or app-generation service and published by someone other than the business it represents. Apple wants such apps submitted by the content owner, or consolidated into one container app by the service.',
      causes: ['A generic, lightly customized template (restaurant, church, salon) with no unique features.', 'The developer account name does not match the business in the app.', 'Many near-identical apps from one account (see also 4.3).'],
      fix: [
        'Submit from the developer account of the business the app is for (organization account, which needs a D-U-N-S number).',
        'Remove template leftovers: default names, sample images, unused tabs.',
        'Add features specific to this business and explain them in the reply.',
        'Being built with an AI tool is not itself the problem; being generic or published by a third party is.'
      ],
      reply: 'Hello,\n\nThis app is published by [business name], the owner of its content and services, from our own developer account. It provides [specific features unique to this business]. It is not a template published on behalf of others.\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.3', title: 'Spam (duplicate or near-duplicate apps)',
      phrases: [/\bspam\b|duplicate|similar (binary|app)|saturated category/i],
      meaning: 'Your app looks the same as other apps from your account or others, or it is in a category Apple considers crowded (for example simple flashlight, fortune, or dating clones) without something unique.',
      causes: ['Several apps from one template with only names changed.', 'A resubmitted copy of an app that was rejected before.'],
      fix: ['Combine variants into one app with in-app options.', 'Explain concretely what is different from other apps in the category.', 'This one is hard to reverse; think about whether a web app serves the goal better.'],
      reply: 'Hello,\n\nThis app differs from others in its category by [specific, verifiable differences]. We do not publish other versions of it.\n\nBest regards,\n[Your name]'
    },
    {
      key: '4.8', title: 'Login Services (Sign in with Apple or equivalent)',
      phrases: [/login services|sign in with apple/i, /third[- ]party (login|sign[- ]in)/i],
      meaning: 'The app offers sign-in with Google, Facebook or another third-party account, but not an option that meets Apple\'s privacy conditions (Sign in with Apple meets them). Or Sign in with Apple is present but broken.',
      causes: ['A "Continue with Google" button from the builder\'s auth template, with no Apple option.', 'Sign in with Apple works, but the screen does not change afterwards until the app is restarted.'],
      fix: [
        'Add Sign in with Apple (most auth providers such as Supabase and Firebase support it) and enable the capability in your App ID.',
        'Put it at the same size and position as the other sign-in buttons, using Apple\'s button style.',
        'Test with an Apple ID that has never used your app, including "Hide My Email", and confirm the next screen appears without restarting.',
        'If Apple says it is "not responsive", check the step after sign-in, not only the sign-in call: the user may be signed in but the screen was never told.'
      ],
      reply: 'Hello,\n\nBuild [version] offers Sign in with Apple alongside [other options], using Apple\'s standard button. We tested it with a new Apple ID [and with Hide My Email] on [devices]: after signing in, the app goes directly to [screen].\n\nBest regards,\n[Your name]'
    },
    {
      key: '5.1.1', title: 'Data Collection and Storage (privacy, permissions, login)',
      phrases: [/data collection and storage/i, /purpose string|usage description|NS\w+UsageDescription/i, /(requires?|require users to) (register|log ?in|sign ?in).{0,80}(not|non)[- ]account/i],
      meaning: 'A privacy problem: a permission request that does not clearly say why, a login required for features that do not need an account, or personal data asked for without a reason.',
      causes: ['Camera or location permission text like "This app needs camera access" with no reason.', 'Forcing sign-up before users can browse anything.', 'Asking for phone number or birthday without explaining why.'],
      fix: [
        'Rewrite each permission text to say what the feature does, e.g. "Used to scan receipts you choose to add."',
        'Only ask for permissions when the user reaches the feature that needs them.',
        'Let users browse features that do not need an account without signing in.',
        'Make optional fields optional.'
      ],
      reply: 'Hello,\n\nIn build [version] we [rewrote the camera/location usage descriptions to explain (purpose) / made (feature) available without an account / made (field) optional].\n\nBest regards,\n[Your name]'
    },
    {
      key: '5.1.1(i)', title: 'Privacy policy missing or unreachable',
      phrases: [/(no|missing|include a|does not (have|include) a) privacy policy|privacy policy.{0,60}(missing|not (functional|accessible|load)|does not|doesn't)/i],
      suppresses: ['5.1.1'],
      meaning: 'There is no privacy policy link, the link does not load, or the policy does not describe what the app collects and who it is shared with.',
      causes: ['The builder\'s default privacy page was never published.', 'Policy link only in the App Store listing, not inside the app.'],
      fix: ['Publish a privacy policy that lists the data you collect, why, which services receive it (analytics, database, payments), how long you keep it, and how to request deletion.', 'Link it in App Store Connect and inside the app (settings or sign-up screen).', 'Make sure App Privacy answers in App Store Connect match the policy.'],
      reply: 'Hello,\n\nOur privacy policy is at [URL] and is linked in the app at [location]. It describes the data collected, its purpose, the third parties that process it, retention, and how to request deletion.\n\nBest regards,\n[Your name]'
    },
    {
      key: '5.1.1(v)', title: 'Account deletion missing',
      phrases: [/account deletion|delete (their|the|an|your) account|initiate deletion/i],
      suppresses: ['5.1.1'],
      meaning: 'Users can create an account in the app but cannot delete it from inside the app. Apple has required in-app account deletion since 2022.',
      causes: ['Only "log out" exists.', 'Deletion is an email link or a website form only.', 'The delete option exists on one sign-in path but not another (for example social sign-in users never see settings).'],
      fix: [
        'Add Settings > Account > Delete account, reachable by every user type.',
        'Confirm once, then actually delete (or clearly start deletion) of the account and its data; say how long it takes.',
        'If you use Sign in with Apple, revoke the Apple token on deletion.',
        'Tell the reviewer the exact path in Notes.'
      ],
      reply: 'Hello,\n\nUsers can now delete their account in the app at [Settings > Account > Delete account]. This deletes [what] [immediately / within N days]. It is available to all users, including those who signed in with [Apple/Google].\n\nBest regards,\n[Your name]'
    },
    {
      key: '5.1.2', title: 'Data Use and Sharing (tracking permission)',
      phrases: [/app ?tracking ?transparency|\bATT\b|track(s|ing)? (users?|you)/i],
      meaning: 'The app, or an SDK inside it, collects data used for tracking across other companies\' apps or websites (often advertising or some analytics SDKs), without asking via Apple\'s tracking prompt. Or your App Privacy answers say you track but the app never asks.',
      causes: ['An ads or attribution SDK included by default.', 'App Privacy labels answered "used to track you" by mistake.'],
      fix: ['List every SDK in the build and what it collects.', 'Either remove tracking SDKs, or show the App Tracking Transparency prompt before any tracking and respect "Ask App Not to Track".', 'Make the App Privacy answers in App Store Connect match reality.'],
      reply: 'Hello,\n\n[Either: "We removed (SDK) and the app does not track users; we corrected our App Privacy answers." Or: "The app now requests permission via App Tracking Transparency before (SDK) collects any data."]\n\nBest regards,\n[Your name]'
    },
    {
      key: '5.2', title: 'Intellectual property (logos, brands, content you do not own)',
      phrases: [/intellectual property|trademark|copyright(ed)?|(documentation|evidence) (of|that) (your )?(rights|authori[sz]ation)/i],
      meaning: 'The app or listing uses someone else\'s brand, logo, characters or content without showing you have the right to.',
      causes: ['An AI-generated icon that resembles a known brand.', 'Using a company\'s name because the app works with their service.'],
      fix: ['Remove third-party logos and names you do not have permission to use, or attach written permission in App Review Information.', '"Works with X" wording in the description is usually safer than X in the name or icon.'],
      reply: 'Hello,\n\nWe removed [brand/logo] from the [icon/name/screenshots]. [Or: "We have attached documentation showing we are authorised to use (brand)."]\n\nBest regards,\n[Your name]'
    },
    {
      key: 'ITMS-91053', standalone: true, title: 'Missing API declaration (privacy manifest)',
      phrases: [/ITMS-91053|privacy manifest|PrivacyInfo\.xcprivacy|required reason api/i],
      meaning: 'An upload warning or rejection email: the build uses certain system APIs (for example file timestamps or user defaults) without declaring the reason in a privacy manifest. Common in wrapped apps because the wrapper and plugins use these APIs.',
      causes: ['The iOS project has no PrivacyInfo.xcprivacy file.', 'An old plugin or SDK version without its own manifest.'],
      fix: ['Add a PrivacyInfo.xcprivacy file to the app target that declares each API category named in the email with an approved reason code.', 'Update the wrapper and plugins to current versions, which usually include their own manifests.', 'Upload a new build and confirm the email does not return.'],
      reply: 'No reply is usually needed for the upload email. If it came with a rejection: "Build [version] includes a privacy manifest declaring [API categories] with reasons [codes]."'
    }
  ];

  var BY_KEY = {};
  RULES.forEach(function (r) { BY_KEY[r.key] = r; });

  // "Guideline 5.1.1(v) - ...", "Guideline 2.3.10", "Guidelines 2.1 and 4.0"
  var NUM_RE = /guidelines?\s+((?:\d+(?:\.\d+){0,3}(?:\s*\([a-z]+\))?(?:\s*(?:,|and|&)\s*)?)+)/gi;
  var ONE_RE = /(\d+(?:\.\d+){0,3})(?:\s*\(([a-z]+)\))?/gi;

  function lookup(num, suffix) {
    // Exact with suffix, then without, then walk up the parents: 2.3.12 -> 2.3 -> 2.
    if (suffix && BY_KEY[num + '(' + suffix.toLowerCase() + ')']) return BY_KEY[num + '(' + suffix.toLowerCase() + ')'];
    // Top-level rules ("3", "4.0") only answer for "3", "3.0", "4", "4.0" — never as a
    // fallback for 3.1.3, which would describe a different problem.
    var parts = num.split('.');
    var top = parts.length === 1 || (parts.length === 2 && parts[1] === '0');
    if (top) return BY_KEY[parts[0]] || BY_KEY[parts[0] + '.0'] || null;
    while (parts.length >= 2) {
      var k = parts.join('.');
      if (BY_KEY[k]) return BY_KEY[k];
      parts.pop();
    }
    return null;
  }

  function isRefinementOf(ruleKey, cited) {
    // Rule "5.1.1(v)" refines a citation of "5.1.1" or "5.1"; "2.1-info" refines "2.1".
    return cited.some(function (c) {
      var base = c.replace(/\(.*$/, '');
      return ruleKey === c || ruleKey.indexOf(base + '.') === 0 || ruleKey.indexOf(base + '(') === 0 || ruleKey.indexOf(base + '-') === 0;
    });
  }

  function decode(text) {
    var out = { cited: [], matches: [], device: null, unknown: [] };
    if (!text || !text.trim()) return out;
    var found = {}; var order = [];
    function add(rule, how, pos, isCite) {
      if (!rule) return;
      if (!found[rule.key]) { found[rule.key] = { rule: rule, how: [], pos: pos, cited: false }; order.push(rule.key); }
      var f = found[rule.key];
      if (f.how.indexOf(how) < 0) f.how.push(how);
      if (isCite) f.cited = true;
      if (pos < f.pos) f.pos = pos;
    }
    var m, one;
    NUM_RE.lastIndex = 0;
    while ((m = NUM_RE.exec(text))) {
      ONE_RE.lastIndex = 0;
      while ((one = ONE_RE.exec(m[1]))) {
        var label = one[1] + (one[2] ? '(' + one[2].toLowerCase() + ')' : '');
        if (out.cited.indexOf(label) < 0) out.cited.push(label);
        var r = lookup(one[1], one[2]);
        if (r) add(r, 'Apple cited Guideline ' + label, m.index, true);
        else if (out.unknown.indexOf(label) < 0) out.unknown.push(label);
      }
    }
    var haveCites = out.cited.length > 0;
    RULES.forEach(function (r) {
      // With guideline numbers present, wording only narrows a cited number down
      // (e.g. 4.2 -> 4.2.6). Rules flagged standalone have specific enough wording.
      if (haveCites && !r.standalone && !isRefinementOf(r.key, out.cited)) return;
      for (var i = 0; i < r.phrases.length; i++) {
        var pm = r.phrases[i].exec(text);
        if (pm) { add(r, 'wording "' + pm[0].slice(0, 60) + '"', pm.index, false); break; }
      }
    });
    // A more specific rule replaces its parent (4.2.6 replaces 4.2), cited or not.
    var suppressed = {};
    order.forEach(function (k) { (found[k].rule.suppresses || []).forEach(function (s) { suppressed[s] = true; }); });
    order.forEach(function (k) { if (!suppressed[k]) out.matches.push(found[k]); });
    out.matches.sort(function (a, b) { return a.pos - b.pos; });
    var dm = /(?:review )?device(?:s)?(?: type)?\s*:\s*([^\n]{3,80})/i.exec(text) || /\b(iPad[^\n,.;]{0,40}|iPhone[^\n,.;]{0,40})\b/.exec(text);
    if (dm) out.device = dm[1].trim();
    return out;
  }

  root.ShipDecoder = { RULES: RULES, decode: decode };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.ShipDecoder;

  // ---------------- UI ----------------
  if (typeof document === 'undefined') return;

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (a) {
      if (a === 'text') n.textContent = attrs[a]; else n.setAttribute(a, attrs[a]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function list(tag, items, cls) {
    return el(tag, cls ? { 'class': cls } : null, items.map(function (t) { return el('li', { text: t }); }));
  }

  function render(result, box) {
    box.textContent = '';
    if (!result.matches.length) {
      box.appendChild(el('div', { 'class': 'card' }, [
        el('h3', { text: 'No known guideline found' }),
        el('p', { text: 'Paste the full message from App Store Connect (App Review > the rejected submission), including the lines that start with "Guideline". If Apple cited a guideline we do not cover here, the general steps below still apply.' }),
        result.unknown.length ? el('p', { text: 'Cited but not in our list: ' + result.unknown.join(', ') }) : null
      ]));
      return;
    }
    var summary = el('div', { 'class': 'note info' }, [
      el('p', { text: 'Found ' + result.matches.length + ' issue' + (result.matches.length > 1 ? 's' : '') +
        (result.cited.length ? ' (Apple cited: ' + result.cited.join(', ') + ')' : ' (no guideline numbers found; matched by wording)') + '.' }),
      result.device ? el('p', { text: 'Review device mentioned: ' + result.device + '. Test your fix on this kind of device.' }) : null,
      el('p', { text: 'Reply to each issue separately, and claim only what you actually changed and tested.' })
    ]);
    box.appendChild(summary);

    result.matches.forEach(function (f, i) {
      var r = f.rule;
      var copyBtn = el('button', { type: 'button', 'class': 'btn secondary small' }, ['Copy reply draft']);
      var pre = el('pre', { 'class': 'reply', id: 'reply-' + i, text: r.reply });
      copyBtn.addEventListener('click', function () {
        var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy reply draft'; }, 1600); };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(r.reply).then(done, function () { selectText(pre); });
          else selectText(pre);
        } catch (e) { selectText(pre); }
      });
      box.appendChild(el('article', { 'class': 'card' }, [
        el('div', { 'class': 'result-head' }, [
          el('span', { 'class': 'tag accent', text: r.key.indexOf('-') > 0 ? r.key.split('-')[0] : r.key }),
          el('h3', { text: r.title })
        ]),
        el('p', { 'class': 'muted', text: 'Why this matched: ' + f.how.join('; ') }),
        el('h4', { text: 'What it means' }),
        el('p', { text: r.meaning }),
        el('h4', { text: 'Common causes in AI-built apps' }),
        list('ul', r.causes, 'plain'),
        el('h4', { text: 'How to fix it' }),
        list('ol', r.fix, 'steps'),
        el('h4', { text: 'Reply draft (Resolution Center)' }),
        el('p', { 'class': 'muted', text: 'Fill in the brackets. Delete anything you did not do.' }),
        pre,
        copyBtn
      ]));
    });
  }
  function selectText(node) {
    try { var r = document.createRange(); r.selectNodeContents(node); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) { /* ignore */ }
  }

  var SAMPLE = 'Guideline 4.2 - Design - Minimum Functionality\n\nYour app provides a limited user experience as it is not sufficiently different from a mobile browsing experience.\n\nGuideline 5.1.1(v) - Legal - Privacy - Data Collection and Storage\n\nThe app supports account creation but does not include an option to initiate account deletion.\n\nReview device: iPad Air 11-inch (M3)';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('decode-form');
    var input = document.getElementById('rejection');
    var box = document.getElementById('results');
    var sample = document.getElementById('sample');
    if (!form || !input || !box) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      render(decode(input.value), box);
      box.focus();
    });
    if (sample) sample.addEventListener('click', function () { input.value = SAMPLE; render(decode(SAMPLE), box); });
    var covered = document.getElementById('covered');
    if (covered) RULES.forEach(function (r) { covered.appendChild(el('li', null, [el('code', { text: r.key.replace('-info', ' (Information Needed)') }), ' ' + r.title])); });
  });
})(typeof window !== 'undefined' ? window : globalThis);
