import { Message } from '@/types/chat';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from 'next-auth/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MessageInput from '../message-input';
import { getSolution } from '../solution-actions';

// ============================================
// 외부 의존성 모킹
// ============================================
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));
vi.mock('next-auth/react');
vi.mock('../solution-actions');
vi.mock('@/components/modal-provider', () => ({
  useModal: () => ({
    showModal: vi.fn(),
  }),
}));

global.alert = vi.fn();

// ============================================
// 헬퍼 함수: 공통 Props 생성
// ============================================
const createMockProps = (overrides = {}) => ({
  onSubmit: vi.fn(),
  isLoading: false,
  disabled: false,
  textareaRef: { current: null },
  messages: [],
  resetChatState: vi.fn(),
  getConsultationList: vi.fn(),
  ...overrides,
});

// ============================================
// submitSolution 비즈니스 로직 테스트
// ============================================
describe('submitSolution 비즈니스 로직', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('인증되지 않은 사용자는 getSolution 호출을 차단한다', async () => {
    // Arrange: 비인증 사용자 설정
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const props = createMockProps({
      messages: [{ id: '1', sender: 'user', content: '테스트', timestamp: new Date() }],
    });

    render(<MessageInput {...props} />);

    // Act: 솔루션받기 버튼 클릭
    const button = screen.getByRole('button', { name: /솔루션받기/i });
    await userEvent.click(button);

    // Assert: API 호출 되지 않음
    expect(getSolution).not.toHaveBeenCalled();
  });

  it('사용자 메시지가 없으면 경고 후 처리를 중단한다', async () => {
    // Arrange: 인증된 사용자 + 사용자 메시지 없음
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: '1', name: 'Test' }, expires: '2025-12-31' },
      status: 'authenticated',
      update: vi.fn(),
    });

    const props = createMockProps({
      messages: [{ id: '1', sender: 'model', content: '안녕하세요', timestamp: new Date() }],
    });

    render(<MessageInput {...props} />);

    // Act: 솔루션받기 버튼 클릭
    const button = screen.getByRole('button', { name: /솔루션받기/i });
    await userEvent.click(button);

    // Assert: 경고 표시 및 API 호출 차단
    expect(global.alert).toHaveBeenCalledWith('사용자 메시지가 충분하지 않습니다.');
    expect(getSolution).not.toHaveBeenCalled();
  });

  it('솔루션 생성 성공 시 상태를 초기화한다', async () => {
    // Arrange: 정상적인 시나리오
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: '1', name: 'Test' }, expires: '2025-12-31' },
      status: 'authenticated',
      update: vi.fn(),
    });

    const messages: Message[] = [
      { id: '1', sender: 'model', content: '안녕하세요', timestamp: new Date() },
      { id: '2', sender: 'user', content: '상담 필요해요', timestamp: new Date() },
    ];

    vi.mocked(getSolution).mockResolvedValue({
      success: true,
      data: {
        summaryTitle: '테스트 제목',
        summaryContent: '테스트 내용',
        solution: '테스트 솔루션',
      },
      id: '123',
      date: '2024-11-02T00:00:00.000Z',
    });

    const mockReset = vi.fn();
    const mockGetList = vi.fn();

    const props = createMockProps({
      messages,
      resetChatState: mockReset,
      getConsultationList: mockGetList,
    });

    render(<MessageInput {...props} />);

    // Act: 솔루션받기 버튼 클릭
    const button = screen.getByRole('button', { name: /솔루션받기/i });
    await userEvent.click(button);

    // Assert: API 호출 및 상태 초기화
    await waitFor(() => {
      // messages를 인자로 전달하는지 확인
      expect(getSolution).toHaveBeenCalledWith(messages);
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockGetList).toHaveBeenCalledTimes(1);
    });
  });

  it('솔루션 생성 실패 시 에러를 표시하고 상태를 유지한다', async () => {
    // Arrange: 실패 시나리오
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: '1', name: 'Test' }, expires: '2025-12-31' },
      status: 'authenticated',
      update: vi.fn(),
    });

    const messages: Message[] = [
      { id: '1', sender: 'user', content: '상담 요청', timestamp: new Date() },
    ];

    vi.mocked(getSolution).mockResolvedValue({
      success: false,
      error: '솔루션 생성 중 오류가 발생했습니다.',
    });

    const mockReset = vi.fn();
    const mockGetList = vi.fn();

    const props = createMockProps({
      messages,
      resetChatState: mockReset,
      getConsultationList: mockGetList,
    });

    render(<MessageInput {...props} />);

    // Act: 솔루션받기 버튼 클릭
    const button = screen.getByRole('button', { name: /솔루션받기/i });
    await userEvent.click(button);

    // Assert: 에러 표시 및 상태 초기화 안됨
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('솔루션 생성 중 오류가 발생했습니다.');
      expect(mockReset).not.toHaveBeenCalled();
      expect(mockGetList).not.toHaveBeenCalled();
    });
  });
});
