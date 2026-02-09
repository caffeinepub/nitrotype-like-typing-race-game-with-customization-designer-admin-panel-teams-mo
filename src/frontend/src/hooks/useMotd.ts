import { useState } from 'react';

// Placeholder MOTD hook - backend support needed
export function useMotd() {
  const [motd] = useState('Welcome to TypeRacer Pro! Race to improve your typing speed!');
  
  return {
    motd,
    isLoading: false,
  };
}
