import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json();
  const { drivingStyle, environment, preferredTimeSlots } = body;

  if (
    drivingStyle == null &&
    environment == null &&
    (preferredTimeSlots == null || !Array.isArray(preferredTimeSlots))
  ) {
    return NextResponse.json({ error: 'At least one field must be provided' }, { status: 400 });
  }

  const updateData: any = {};
  if (drivingStyle !== undefined) updateData.drivingStyle = drivingStyle;
  if (environment !== undefined) updateData.environment = environment;
  if (preferredTimeSlots !== undefined) updateData.preferredTimeSlots = preferredTimeSlots.join(',');

  try {
    const preference = await prisma.preference.upsert({
      where: { userId: decoded.userId },
      update: updateData,
      create: {
        drivingStyle: drivingStyle || '',
        environment: environment || '',
        preferredTimeSlots: preferredTimeSlots?.join(',') || '',
        userId: decoded.userId,
      },
    });

    return NextResponse.json({ message: 'Preferences saved', preference }, { status: 200 });
  } catch (err) {
    console.error('Error saving preferences:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
