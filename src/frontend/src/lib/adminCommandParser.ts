export interface ParsedCommand {
  action: string;
  itemType?: string;
  params: Record<string, any>;
  isValid: boolean;
  error?: string;
}

export function parseAdminCommand(input: string): ParsedCommand {
  const trimmed = input.trim().toLowerCase();
  
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
    error: 'Command not recognized. Try: "Create a title called \'X\' rarity Y price Z", "Set MOTD to \'message\'", "Add text: \'content\' category: X", "Grant 1000 TRP coins to user"',
  };
}
