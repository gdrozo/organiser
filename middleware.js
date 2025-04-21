import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes - only "/sign-in" is public
const isPublicRoute = createRouteMatcher(['/sign-in'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  // Redirect to sign-in if the user is not authenticated and trying to access protected routes
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Apply middleware to all routes, including API routes and `/`
    '/',
    '/(api|trpc)(.*)',
  ],
}
