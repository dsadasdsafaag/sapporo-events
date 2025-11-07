import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 既に /ja, /en, /zh-hant, /ko, /es のいずれかで始まっていれば通す
  if (/^\/(ja|en|zh-hant|ko|es)(\/|$)/.test(pathname)) {
    return NextResponse.next();
  }

  // それ以外（ルート含む）は /ja/ にリダイレクト
  url.pathname = "/ja/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
