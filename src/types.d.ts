type MINING_LEVEL = 'WOOD' | 'STONE' | 'IRON' | 'DIAMOND' | 'COBALD';

interface Parts {
  head: {
    [key: string]: {
      durability: number;
      mining_level: MINING_LEVEL;
      mining_speed: number;
      attack_damage: number;
      overrides: any;
    };
  };
  handle: {
    [key: string]: {
      durability: number;
      attack_damage: number;
      attack_speed: number;
      mining_speed: number;
      overrides: any;
    };
  };
  extra: {
    [key: string]: {
      trait: string | string[];
      overrides: any;
    };
  };
}
