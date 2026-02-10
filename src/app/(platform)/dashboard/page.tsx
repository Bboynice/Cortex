'use client';

import { generateCodingChallenge } from './actions';
import { useState } from 'react';
import MyButton from '@/src/components/ui/GlowButton/GlowButton';
import DropdownMenu from '@/src/components/ui/dropdown';
import { Badge } from '@/src/components/ui/badge';

export default function AppHome() {
  const [challenge, setChallenge] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    
    // Call the server action directly
    const result = await generateCodingChallenge();
    
    if (result.success) {
      setChallenge(result.challenge ?? "No challenge found");
    } else {
      alert("Error generating challenge");
    }
    
    setLoading(false);
  }
  return (
   <div className="flex flex-col min-h-screen">
      <div className="container mx-auto  px-4 py-4 flex-1">
        <h1 className="text-2xl font-bold">Main App</h1>
        <p className="mt-4 text-gray-600">Welcome to the Cortex application.</p>
        <div className="h-[30em] w-[30em] bg-red-500 flex items-center justify-center"><MyButton  onClick={handleGenerate}>
          {loading ? "Generating..." : "Generate"}
        </MyButton>
        <DropdownMenu />
        <Badge variant="success">Success</Badge>
        </div>

        {challenge && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-gray-600">{challenge}</p>
            
          </div>
        )}

        
      </div>
   </div>
  );
}
