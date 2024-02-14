import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from './services/jwtToken';

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    const cookie = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

    const login = process.env.basicLogin;
    const password = process.env.basicPassword;

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        if (user === login && pwd === password) {
            if (!cookie) {
                return NextResponse.redirect(new URL('/', req.url));
            }

            return NextResponse.next();
        }
    }

    url.pathname = '/api/basicauth';

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: ['/profile', '/catalog', '/contract/:path*'],
};
