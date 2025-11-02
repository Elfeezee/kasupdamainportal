module.exports = {

"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[project]/.firebase/kasupda-portal-service-account.json (json)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.v(JSON.parse("{\"type\":\"service_account\",\"project_id\":\"kasupdaportal\",\"private_key_id\":\"1623bb9bf6ba032898226fc55f7e708b446e4d89\",\"private_key\":\"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC51B5xTWqyChmH\\n2UQx88PC35UoqjcqsVnZCqGA+S5ATFXNue+V0i/+6LIpb7JGW2HWyU0AWnjMk0Mm\\n2D1zQho4FKyHCiRw5P5ujdm+1W/JGmJJDKq/ZeBLMRC3+YkRNL5eaw8pzJMzieNn\\nzo0YiHnEIEM1znBmtwKhsatJYbOkX7iKRduGmqLzbj7hL9qnKdeTaytg1fLRX1wC\\nmLLx2pCcjlhSzqH5lA3r1sg3rk1w13ibDX6TKBnBDMVBOGepe6Jxo1l4sTvgiQ1e\\ngr0w1Xyb/x8fuxebwwXurUSFjnlzOWVAo0lrp0jTjpBEoSkBO6dSGBYNoXb+U1jH\\nFoKLhjwvAgMBAAECggEAG/x0MUAlh3a57ZmtCZDatKiTgDJSaJ2ZGHTfadsdOhXE\\n/ly4Vmn3TH6jBlaKFMqCa6SZciot8zFidaEvcAJOjI+ghB3k6xOxtdirKHBgi3rr\\nvnCn7ndbVjeneu2b1PmKihG5kOP8b1Ce7O1QlpdHL2Bkft/+UZnSTaPCViTetyxp\\nNo7HGSp9doTsYW3XGVgZ2bD+prJja0fyzS3KOncP6AW3jlf+n9K8r9Edznsl21KB\\nkCcLm+iALYLhTOk1kqcnXN7fDK+XT8WckhPKi3oABrv/kIz1oZAoEfs7w7Ika+ee\\n6ydJc0+PcyAQNkGocB/ZpuEPCuHO0rMXAE3o1qnBgQKBgQDzsieMO52wHgr/3k0k\\niJXzVw3DJgtgTClTiaPhxZioU7JcxaRJoptJsVeq+NJYk4ynHZzHYUlM9pyN0jkL\\n0wcBYAz/rwo/e5FrxXl7XV98qn2q5ITRr2zvp0zbvp51UiZvUMsMtYeMiBcI/fwQ\\nD687BZ4vAWyypDwCEWVKvJo0jwKBgQDDNgLgiuhxHxdUojzoQFEZJy2fOXeskeKD\\nYq/W7KBB1/BGxIbqbDR174sOG9G6flpOSFtmw8pBZ29DAcnqZF1w4HTKQ0fzv3bR\\nfGRiXsgGqwH9ryM7BBmps8KdMq7b35uGSH4dn4hLZfzCTPoZ/JcdbkejZ7DBH18j\\n/giLd3+OYQKBgEI+gH+fSQsx732EWWX/9vsSA/yzX85KhcVemfzqcMf5EHglhbY6\\njInoulMQlmVbnpVi+FY+fOV9+CqZJcawE6xtBruOQnPlTC+Gm7JMPIOv+L82pWA2\\nlp9C1CK722k67pW92aRXyEQMTm60VAutp82chlZyxbB98o4BWo6JXEXDAoGBAJln\\n4o7u2oe7NSxvaonhsVmg7jtIgAF/i5BQh3rQ7YeQ2OPkIVorunZLzu1Bc2mpTfJi\\n7mEtz83iKQ9xYmnugXfpDB6/DNZCSm+J36Fmdq62yJPBhGAmcrxn5bJ/V+a2LJQ0\\nd9dzvTnzZdSThZ/SXjbkqSuCmubJbozsX26qc/VBAoGBAKm3yJOAnaSm2+dx7xs7\\n1G0endCOtWJ4i0pSCuv4b38BDI94nDtMcmSB78qtUyDXDky+JcmHcZ8LSrOb0u2s\\nGdH4YWhVL4OYx7vjTplUt51CnYf3My45qMsUgA5Ed0C+zh65Y0Ii7K0eKwv7xaRc\\nEo7q3wgO0bcdnRm3KIWYdX+p\\n-----END PRIVATE KEY-----\\n\",\"client_email\":\"firebase-adminsdk-fbsvc@kasupdaportal.iam.gserviceaccount.com\",\"client_id\":\"110375448122908584986\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\":\"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\":\"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kasupdaportal.iam.gserviceaccount.com\",\"universe_domain\":\"googleapis.com\"}"));}}),
"[project]/src/lib/firebase/admin.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/firebase/admin.ts
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// Use require for the JSON file to ensure it's loaded correctly on the server.
const serviceAccount = __turbopack_context__.r("[project]/.firebase/kasupda-portal-service-account.json (json)");
const initializeFirebaseAdmin = ()=>{
    // Check if the app is already initialized to prevent errors.
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"].length > 0) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["app"])();
    }
    // Initialize the app with the service account credentials.
    try {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"])({
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["credential"].cert(serviceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error.stack);
        // Throw a more specific error to help with debugging.
        throw new Error(`Firebase admin initialization failed: ${error.message}`);
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["app"])();
};
// Helper function to get the auth service
function getFirebaseAuth() {
    initializeFirebaseAdmin();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["auth"])();
}
// Helper function to get the firestore service
function getFirestoreDB() {
    initializeFirebaseAdmin();
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"])();
}
const auth = getFirebaseAuth();
const db = getFirestoreDB();
}}),
"[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"6016c63baa0e5f092c0207f11e52b391be91659d31":"loginWithEmail","60dfe48a7153b5ebf7967c34d57ee3466e494dd564":"signUpWithEmail"} */ __turbopack_context__.s({
    "loginWithEmail": (()=>loginWithEmail),
    "signUpWithEmail": (()=>signUpWithEmail)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const SignUpSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
    applicantName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(2, {
        message: 'Name must be at least 2 characters.'
    }),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Invalid email address.'
    }),
    phone: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(10, {
        message: 'Phone number must be at least 10 digits.'
    }).regex(/^\+?[0-9\s-()]+$/, {
        message: 'Invalid phone number format.'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(6, {
        message: 'Password must be at least 6 characters.'
    })
});
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ signUpWithEmail(prevState, formData) {
    const validatedFields = SignUpSchema.safeParse({
        applicantName: formData.get('applicantName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password')
    });
    if (!validatedFields.success) {
        return {
            message: 'Invalid form data. Please check the fields below.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false
        };
    }
    const { applicantName, email, phone, password } = validatedFields.data;
    try {
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].createUser({
            email,
            password,
            displayName: applicantName,
            phoneNumber: phone,
            emailVerified: false
        });
        // This is a simplified approach. In a production app, you would not pass the user's name
        // in the URL. You would use session cookies or a similar mechanism to manage auth state.
        const redirectName = userRecord.displayName || email.split('@')[0];
        return {
            message: 'Sign up successful! You can now log in.',
            success: true,
            redirectTo: `/login?name=${encodeURIComponent(redirectName)}`,
            errors: null
        };
    } catch (error) {
        let errorMessage = 'Could not sign up. Please try again.';
        if (error.code === 'auth/email-already-exists') {
            errorMessage = 'An account with this email address already exists.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        return {
            message: errorMessage,
            errors: {
                general: [
                    errorMessage
                ]
            },
            success: false
        };
    }
}
const LoginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().email({
        message: 'Invalid email address.'
    }),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["z"].string().min(1, {
        message: 'Password cannot be empty.'
    })
});
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ loginWithEmail(prevState, formData) {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    });
    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            errors: validatedFields.error.flatten().fieldErrors,
            success: false
        };
    }
    const { email } = validatedFields.data;
    try {
        // In a real app, you would verify the password here.
        // For this prototype, we'll fetch the user by email to confirm they exist.
        const userRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["auth"].getUserByEmail(email);
        const redirectName = userRecord.displayName || email.split('@')[0];
        return {
            message: 'Login Successful!',
            success: true,
            redirectTo: `/dashboard?name=${encodeURIComponent(redirectName)}`,
            errors: null
        };
    } catch (error) {
        let errorMessage = 'Login failed. Please check your credentials.';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email address.';
        } else if (error.code === 'auth/wrong-password') {
            // Note: Admin SDK cannot verify passwords directly. This is a conceptual error message.
            // Client-side SDK should be used for the actual sign-in flow to check passwords.
            errorMessage = 'Incorrect password. Please try again.';
        }
        return {
            message: errorMessage,
            errors: {
                general: [
                    errorMessage
                ]
            },
            success: false
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUpWithEmail,
    loginWithEmail
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUpWithEmail, "60dfe48a7153b5ebf7967c34d57ee3466e494dd564", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginWithEmail, "6016c63baa0e5f092c0207f11e52b391be91659d31", null);
}}),
"[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
}}),
"[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "6016c63baa0e5f092c0207f11e52b391be91659d31": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginWithEmail"]),
    "60dfe48a7153b5ebf7967c34d57ee3466e494dd564": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signUpWithEmail"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "6016c63baa0e5f092c0207f11e52b391be91659d31": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["6016c63baa0e5f092c0207f11e52b391be91659d31"]),
    "60dfe48a7153b5ebf7967c34d57ee3466e494dd564": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60dfe48a7153b5ebf7967c34d57ee3466e494dd564"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$apply$2d$for$2d$permit$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$authActions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/apply-for-permit/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/authActions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/apply-for-permit/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/apply-for-permit/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/apply-for-permit/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/apply-for-permit/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/apply-for-permit/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/apply-for-permit/page.tsx", "default");
}}),
"[project]/src/app/apply-for-permit/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$apply$2d$for$2d$permit$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/apply-for-permit/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$apply$2d$for$2d$permit$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/apply-for-permit/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$apply$2d$for$2d$permit$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/apply-for-permit/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/apply-for-permit/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__ab18b42e._.js.map