import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `
User-agent: *
Disallow: /
  `;


  // const robotsTxt = `
  // User-agent: *
  // Allow: /public/
  // Sitemap: https://psyconica.vercel.app/api/sitemap
  //   `;


  // Disallow: /admin/ as example

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
