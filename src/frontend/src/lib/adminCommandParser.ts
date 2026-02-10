export interface ParsedCommand {
  action: string;
  itemType?: string;
  params: Record<string, any>;
  isValid: boolean;
  error?: string;
}

export function parseAdminCommand(input: string): ParsedCommand {
  const trimmed = input.trim().toLowerCase();
  
  // Set balance
  if (trimmed.includes('set') && trimmed.includes('balance')) {
    const amountMatch = input.match(/(\d+)/);
    const userMatch = input.match(/(?:for|to)\s+(?:user\s+)?(\S+)/i);
    
    if (!amountMatch) {
      return { action: 'setBalance', params: {}, isValid: false, error: 'Missing balance amount' };
    }
    
    if (!userMatch) {
      return { action: 'setBalance', params: {}, isValid: false, error: 'Missing user principal ID' };
    }
    
    return {
      action: 'setBalance',
      params: {
        amount: parseInt(amountMatch[1]),
        user: userMatch[1],
      },
      isValid: true,
    };
  }
  
  // Ban user
  if (trimmed.startsWith('ban') && trimmed.includes('user')) {
    const userMatch = input.match(/ban\s+(?:user\s+)?(\S+)/i);
    
    if (!userMatch) {
      return { action: 'banUser', params: {}, isValid: false, error: 'Missing user principal ID' };
    }
    
    return {
      action: 'banUser',
      params: { user: userMatch[1] },
      isValid: true,
    };
  }
  
  // Unban user
  if (trimmed.startsWith('unban') && trimmed.includes('user')) {
    const userMatch = input.match(/unban\s+(?:user\s+)?(\S+)/i);
    
    if (!userMatch) {
      return { action: 'unbanUser', params: {}, isValid: false, error: 'Missing user principal ID' };
    }
    
    return {
      action: 'unbanUser',
      params: { user: userMatch[1] },
      isValid: true,
    };
  }
  
  // Set season
  if (trimmed.includes('set') && trimmed.includes('season')) {
    const seasonMatch = input.match(/season\s+(?:to\s+)?(\w+)/i);
    
    if (!seasonMatch) {
      return { action: 'setSeason', params: {}, isValid: false, error: 'Missing season name' };
    }
    
    const season = seasonMatch[1].toLowerCase();
    if (!['winter', 'spring', 'summer', 'autumn', 'fall'].includes(season)) {
      return { action: 'setSeason', params: {}, isValid: false, error: 'Invalid season. Use: winter, spring, summer, autumn/fall' };
    }
    
    return {
      action: 'setSeason',
      params: { season },
      isValid: true,
    };
  }
  
  // Create title
  if (trimmed.startsWith('create') && trimmed.includes('title')) {
    const nameMatch = input.match(/called ['"]([^'"]+)['"]/i);
    const rarityMatch = input.match(/rarity\s+(\w+)/i);
    const priceMatch = input.match(/price\s+(\d+)/i);
    
    if (!nameMatch) {
      return { action: 'create', itemType: 'title', params: {}, isValid: false, error: 'Missing title name' };
    }
    
    return {
      action: 'create',
      itemType: 'title',
      params: {
        name: nameMatch[1],
        rarity: rarityMatch?.[1] || 'common',
        price: priceMatch ? parseInt(priceMatch[1]) : 100,
      },
      isValid: true,
    };
  }
  
  // Set MOTD
  if (trimmed.startsWith('set motd')) {
    const messageMatch = input.match(/set motd\s+(?:to\s+)?['"]([^'"]+)['"]/i);
    
    if (!messageMatch) {
      return { action: 'setMotd', params: {}, isValid: false, error: 'Missing MOTD message' };
    }
    
    return {
      action: 'setMotd',
      params: { message: messageMatch[1] },
      isValid: true,
    };
  }
  
  // Add text
  if (trimmed.startsWith('add text')) {
    const contentMatch = input.match(/add text[:\s]+['"]([^'"]+)['"]/i);
    const categoryMatch = input.match(/category[:\s]+(\w+)/i);
    
    if (!contentMatch) {
      return { action: 'addText', params: {}, isValid: false, error: 'Missing text content' };
    }
    
    return {
      action: 'addText',
      params: {
        content: contentMatch[1],
        category: categoryMatch?.[1] || 'general',
      },
      isValid: true,
    };
  }
  
  // Grant TRP Coins
  if (trimmed.startsWith('grant') && (trimmed.includes('trp') || trimmed.includes('coin'))) {
    const amountMatch = input.match(/(\d+)/);
    const userMatch = input.match(/to\s+(\S+)/i);
    
    if (!amountMatch) {
      return { action: 'grantTrpCoins', params: {}, isValid: false, error: 'Missing amount' };
    }
    
    return {
      action: 'grantTrpCoins',
      params: {
        amount: parseInt(amountMatch[1]),
        user: userMatch?.[1] || 'current',
      },
      isValid: true,
    };
  }
  
  return {
    action: 'unknown',
    params: {},
    isValid: false,
    error: 'Command not recognized. Try: "Set balance to 10000 for user [principal]", "Ban user [principal]", "Unban user [principal]", "Set season to winter"',
  };
}
