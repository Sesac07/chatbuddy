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

/**
 * 상담 삭제
 */
export async function deleteConsultation(
  consultationId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    // 사용자 확인 및 해당 상담이 본인의 것인지 확인
    const user = await prisma.users.findFirst({
      where: {
        email: session.user.email,
      },
      select: {
        user_id: true,
      },
    });

    if (!user) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    const consultation = await prisma.consultations.findFirst({
      where: {
        consultation_id: BigInt(consultationId),
        user_id: user.user_id,
      },
    });

    if (!consultation) {
      return { success: false, error: '삭제할 상담을 찾을 수 없습니다.' };
    }

    await prisma.consultations.delete({
      where: {
        consultation_id: BigInt(consultationId),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('상담 삭제 실패:', error);
    return { success: false, error: '상담 삭제에 실패했습니다.' };
  }
}
