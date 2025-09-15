import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div
      className={cn(
        'transition-bg relative flex flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900',
        'h-[calc(100vh-4rem)]',
      )}>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            '[background-image:var(--white-gradient),var(--aurora)]',
            'dark:[background-image:var(--dark-gradient),var(--aurora)]',
            '[background-size:300%,_200%]',
            '[background-position:50%_50%,50%_50%]',

            'blur-[10px] invert filter dark:invert-0',
            'opacity-50 will-change-transform',

            'after:absolute after:inset-0 after:content-[""]',
            'after:[background-image:var(--white-gradient),var(--aurora)]',
            'after:dark:[background-image:var(--dark-gradient),var(--aurora)]',
            'after:[background-size:200%,_100%]',
            'after:[background-attachment:fixed]',
            'after:mix-blend-difference',
            'after:animate-aurora',

            'pointer-events-none absolute -inset-[10px]',

            '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]',
          )}></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
        <p className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          마음의 무게를 덜어주는 작은 대화
        </p>
        <p className="bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          지금 시작하세요
        </p>
        <p className="text-muted-foreground max-w-2xl text-center text-xl">
          당신의 성향에 맞는 방식으로 대화를 이어갑니다
        </p>
        <div className="mt-8 flex gap-4">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 transition-colors">
            T로 상담받기
          </button>
          <button className="border-border hover:bg-accent rounded-lg border px-6 py-3 transition-colors">
            F로 상담받기
          </button>
        </div>
      </div>
    </div>
  );
}
