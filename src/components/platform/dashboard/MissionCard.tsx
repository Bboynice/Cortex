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

const MissionCard = ({ title, description, duration, points, difficulty, lang, onStart }: MissionProps) => {
  const difficultyStyles = {
    Easy: "dark:bg-green-500/10 dark:text-green-500 dark:border-green-500/30",
    Medium: "dark:bg-primary/10 dark:text-primary dark:border-primary/30",
    Hard: "dark:bg-ai-glow/10 dark:text-ai-glow dark:border-ai-glow/30",
  };

  return (
    <div className="group relative rounded-xl border dark:border-border dark:bg-card p-4 shadow-sm dark:hover:border-primary/50 transition-all duration-300 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg border dark:border-border dark:bg-foreground flex items-center justify-center font-mono font-bold text-xs dark:text-muted-foreground dark:group-hover:text-primary transition-colors">
          {lang}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h4 className="font-medium dark:text-content text-sm tracking-tight">{title}</h4>
            <span
              className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${difficultyStyles[difficulty]}`}
            >
              {difficulty}
            </span>
          </div>

          <p className="text-xs dark:text-muted-foreground">{description}</p>

          <div className="flex items-center gap-4 pt-1.5">
            <div className="flex items-center gap-1.5 dark:text-muted-foreground text-[11px]">
              <Timer size={12} aria-hidden="true" />
              {duration}
            </div>
            <div className="flex items-center gap-1.5 dark:text-muted-foreground text-[11px]">
              <Star size={12} className="dark:text-primary" aria-hidden="true" />
              {points} pts
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider dark:text-primary dark:hover:bg-primary/10 dark:hover:text-primary transition-colors"
        aria-label={`Start ${title}`}
      >
        Start
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </button>
    </div>
  );
};

export default MissionCard;
