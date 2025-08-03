import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ hasPreferences: false }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded?.userId) {
    return NextResponse.json({ hasPreferences: false }, { status: 401 });
  }

  const pref = await prisma.preference.findUnique({
    where: { userId: decoded.userId },
  });

  return NextResponse.json({ hasPreferences: !!pref }, { status: 200 });
}
