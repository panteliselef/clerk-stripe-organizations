import { NextResponse } from "next/server"
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"

export default authMiddleware({
  ignoredRoutes: ["/api/webhooks/:path*"],
  publicRoutes: ["/login", "/register", "/"],

  afterAuth(auth, req) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    // redirect them to organization selection page
    if (
      auth.userId &&
      !auth.orgId &&
      !auth.isApiRoute &&
      req.nextUrl.pathname !== "/create-organization"
    ) {
      /**
       * TODO: This will not work because we want to return back to the new created URL
       * the orgId will still be empty even if we have just created an work. We need a way to set a new created org as active from the frontend
       */
      const orgSelection = new URL("/create-organization", req.url)
      return NextResponse.redirect(orgSelection)
    }
  },
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

// export default withAuth(
//   async function middleware(req) {
//     const token = await getToken({ req })
//     const isAuth = !!token
//     const isAuthPage =
//       req.nextUrl.pathname.startsWith("/login") ||
//       req.nextUrl.pathname.startsWith("/register")
//
//     if (isAuthPage) {
//       if (isAuth) {
//         return NextResponse.redirect(new URL("/dashboard", req.url))
//       }
//
//       return null
//     }
//
//     if (!isAuth) {
//       let from = req.nextUrl.pathname
//       if (req.nextUrl.search) {
//         from += req.nextUrl.search
//       }
//
//       return NextResponse.redirect(
//         new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
//       )
//     }
//   },
//   {
//     callbacks: {
//       async authorized() {
//         // This is a work-around for handling redirect on auth pages.
//         // We return true here so that the middleware function above
//         // is always called.
//         return true
//       },
//     },
//   }
// )

// export const config = {
//   matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register"],
// }
