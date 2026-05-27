
export function calculateHeatLevel(points: number): number {
    if (points < 0) return 0;
    
    const baseMultiplier = 120;
    
    const rawLevel = Math.sqrt(points / baseMultiplier);
    
    return Math.floor(rawLevel);
  }
  
  export function pointsForNextLevel(currentPoints: number): number {
    const currentLevel = calculateHeatLevel(currentPoints);
    const nextLevel = currentLevel + 1;
    

    return 120 * Math.pow(nextLevel, 2);
  }