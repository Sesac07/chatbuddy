'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface ConsultationItem {
  id: string;
  title: string;
  date: string;
  status: string;
}

/**
 * 현재 로그인한 유저의 상담 목록 조회
 */
export async function getConsultations(): Promise<ConsultationItem[]> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return [];
    }

    const user = await prisma.users.findFirst({
      where: {
        email: session.user.email,
      },
      select: {
        consultations: {
          orderBy: {
            created_at: 'desc',
          },
          select: {
            consultation_id: true,
            title: true,
            created_at: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const consultations = user.consultations;

    return consultations.map((consult) => ({
      id: consult.consultation_id.toString(),
      title: consult.title,
      date: consult.created_at?.toISOString().split('T')[0] || '',
      status: consult.status || 'active',
    }));
  } catch (error) {
    console.error('상담 목록 조회 실패:', error);
    return [];
  }
}
