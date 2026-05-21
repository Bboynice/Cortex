import { Timer, Star, ArrowRight } from 'lucide-react';

interface MissionProps {
  title: string;
  description: string;
  duration: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lang: 'JS' | 'Py' | 'Rs';
  onStart?: () => void;
}

const difficultyStyles = {
  Easy: "bg-green-500/10 text-content border-green-500/30",
  Medium: "bg-primary/10 text-content border-primary/30",
  Hard: "bg-ai-glow/10 text-content border-ai-glow/30",
} as const;

const MissionCard = ({ title, description, duration, points, difficulty, lang, onStart }: MissionProps) => {
  return (
    <div className="theme-sync group relative flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-background font-mono text-xs font-bold text-muted-foreground group-hover:text-primary">
          {lang}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-medium tracking-tight text-content">{title}</h4>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${difficultyStyles[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">{description}</p>

          <div className="flex items-center gap-4 pt-1.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Timer size={12} aria-hidden="true" />
              {duration}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Star size={12} className="text-primary" aria-hidden="true" />
              {points} pts
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10"
        aria-label={`Start ${title}`}
      >
        Start
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </div>
  );
};

export default MissionCard;
