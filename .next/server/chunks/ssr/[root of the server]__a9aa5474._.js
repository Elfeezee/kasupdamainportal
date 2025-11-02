module.exports = {

"[externals]/firebase-admin [external] (firebase-admin, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}}),
"[project]/src/lib/firebase/admin.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/lib/firebase/admin.ts
__turbopack_context__.s({
    "initializeFirebaseAdmin": (()=>initializeFirebaseAdmin)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// Define the service account credentials as a proper object.
// Use a template literal (backticks ``) for the private_key to preserve newline characters.
const serviceAccount = {
    type: "service_account",
    project_id: "kasupdaportalpro",
    private_key_id: "b3e348e3e3e0b4028045129c5c8227f7a79f04ab",
    private_key: `-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAPa+xgsQ5b8d23pF\n9i5GdvpCEp67J2V6ctp2x+5iG8lEeJJzMHa+2XmG31nN9q2t3ZvqJ5g1+t6e3f6v\nt4a6yG+2x3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d\n5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c\n3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r\n5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d\n5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c\n3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r\n5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d\n5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c\n3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r\n5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d\n5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c\n3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r5y5c3z3d5yG7r\n-----END PRIVATE KEY-----\n`,
    client_email: "firebase-adminsdk-p7k08@kasupdaportalpro.iam.gserviceaccount.com",
    client_id: "116521503387870932095",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p7k08%40kasupdaportalpro.iam.gserviceaccount.com"
};
// This function correctly initializes the Firebase Admin SDK.
// It ensures that initialization only happens once.
function getFirebaseAdminApp() {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"].length > 0) {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"][0];
    }
    try {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"])({
            // Cast to any to satisfy TypeScript, as the SDK expects a specific type
            // but our object structure is correct.
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["credential"].cert(serviceAccount)
        });
    } catch (error) {
        console.error('Firebase admin initialization error:', error.stack);
        // Throw a more specific error to help with debugging.
        throw new Error('Firebase admin initialization failed. Please check the service account credentials provided.');
    }
}
// A single function to get the initialized services.
function initializeFirebaseAdmin() {
    const app = getFirebaseAdminApp();
    return {
        auth: app.auth(),
        db: app.firestore()
    };
}
;
}}),
"[project]/src/app/admin/layout.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AdminLayout),
    "metadata": (()=>metadata)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/admin.ts [app-rsc] (ecmascript)");
;
;
;
;
async function verifyAdmin() {
    const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const sessionCookie = cookieStore.get('__session')?.value;
    if (!sessionCookie) {
        return false;
    }
    try {
        const { auth, db } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initializeFirebaseAdmin"])();
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        // Check for custom admin claim OR role in Firestore
        if (decodedClaims.admin) {
            return true;
        }
        const userDoc = await db.collection('users').doc(decodedClaims.uid).get();
        if (userDoc.exists && userDoc.data()?.role === 'Admin') {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Admin verification failed:", error);
        return false;
    }
}
const metadata = {
    title: 'KASUPDA Admin',
    description: 'KASUPDA Administration Portal'
};
async function AdminLayout({ children }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        // In a real app, you might want to redirect to a specific "access-denied" page
        // or back to the main login with a query param.
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/login?error=access-denied');
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__a9aa5474._.js.map