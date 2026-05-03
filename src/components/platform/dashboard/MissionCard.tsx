import { Timer, Star, ArrowRight } from 'lucide-react';

interface MissionProps {
  title: string;
  description: string;
  duration: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lang: 'JS' | 'Py' | 'Rs';
}

const MissionCard = ({ title, description, duration, points, difficulty, lang }: MissionProps) => {
  // Map difficulty to your AI Heat colors
  const difficultyStyles = {
    Easy: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-primary/10 text-primary border-primary/20", // Branding Orange
    Hard: "bg-ai-glow/10 text-ai-glow border-ai-glow/20",   // Deep Red
  };

  return (
    <div className="group relative bg-surface border border-border hover:border-primary/50 transition-all duration-300 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Language Icon Wrapper */}
        <div className="h-12 w-12 rounded-lg bg-background border border-border flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:text-primary transition-colors">
          {lang}
        </div>

        {/* Text Content */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h4 className="text-content font-bold text-sm tracking-tight">{title}</h4>
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${difficultyStyles[difficulty]}`}>
              {difficulty}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">{description}</p>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
              <Timer size={12} />
              {duration}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
              <Star size={12} className="text-primary" />
              {points} pts
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button className="flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
        Start
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default MissionCard;