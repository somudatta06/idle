import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Crown, Heart, Users, Building2, ScrollText, Settings,
  Sword, Wheat, TreePine, Mountain, Coins, BookOpen,
  Shield, Flame, ChevronRight, Skull, Baby, Gem,
  Clock, Zap, ArrowRight, Star, Home, Swords,
  HeartHandshake, Plus, Minus, RotateCcw, Lock,
  CircleDot, AlertTriangle, Trophy, Sparkles, X,
  FastForward, Play, ChevronsRight, Landmark, Receipt,
  TrendingUp, Banknote, PiggyBank, CircleDollarSign,
  Hammer, GraduationCap, Scroll, ChevronDown, ChevronUp,
  Map, Flag, Compass
} from "lucide-react";
import _ from "lodash";

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const NAMES = [
  "Aldric","Brynn","Cedric","Dorin","Elara","Fenric","Gwyn","Haldor",
  "Isolde","Jorik","Kael","Lyra","Morwen","Noric","Orin","Rhea",
  "Selvik","Thessa","Ulric","Vaela","Wren","Yara","Torvald","Sigrid",
  "Bjorn","Freya","Gunnar","Helga","Ingrid","Leif","Magnus","Sif",
  "Ragnar","Astrid","Einar","Thyra","Rowan","Mira","Calder","Eira"
];
const EPITHETS = [
  "the Bold","the Wise","the Fair","the Steady","the Bright","the Gentle",
  "the Fierce","the Silent","the Tall","the Red","the Elder","the Young",
  "the Unyielding","the Merciful","Ironhand","Goldheart","Stormborn",
  "Dawnbringer","Ashwalker","the Just","Copperblood","the Pious"
];

const ALL_TRAITS = [
  { name:"Brave", icon:"⚔️", effect:"military", bonus:0.15, desc:"+15% Military" },
  { name:"Wise", icon:"📖", effect:"knowledge", bonus:0.15, desc:"+15% Knowledge" },
  { name:"Charming", icon:"✨", effect:"kinship", bonus:0.2, desc:"+20% Kinship" },
  { name:"Sturdy", icon:"🛡️", effect:"stone", bonus:0.15, desc:"+15% Stone" },
  { name:"Patient", icon:"⏳", effect:"all", bonus:0.05, desc:"+5% All Resources" },
  { name:"Nurturing", icon:"🌿", effect:"food", bonus:0.15, desc:"+15% Food" },
  { name:"Shrewd", icon:"💎", effect:"gold", bonus:0.2, desc:"+20% Gold" },
  { name:"Fierce", icon:"🔥", effect:"military", bonus:0.2, desc:"+20% Military" },
  { name:"Enduring", icon:"🗻", effect:"lifespan", bonus:5, desc:"+5yr Lifespan" },
  { name:"Curious", icon:"🔮", effect:"knowledge", bonus:0.2, desc:"+20% Knowledge" },
  { name:"Frugal", icon:"🪙", effect:"credits", bonus:0.15, desc:"+15% Credits/wk" },
  { name:"Ambitious", icon:"👑", effect:"credits", bonus:0.25, desc:"+25% Credits/wk" },
  { name:"Resilient", icon:"💪", effect:"health", bonus:10, desc:"+10 Max Health" },
];

const FAMILIES = [
  {
    id:"greenfield", name:"House Greenfield", subtitle:"Keepers of the Harvest",
    description:"Their fields have never known famine. Marry the Greenfield heir to feed your people.",
    resource:"food", resourceLabel:"Food", ResourceIcon:Wheat,
    color:"#6B9E4A", colorGlow:"#8BC66A",
    kinshipCost:15, creditCost:12, baseProduction:3,
    buildingName:"Granary", buildingDesc:"A great storehouse that multiplies the harvest.",
    familyTraits:["Nurturing","Patient"], motto:"From the earth, plenty.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:20,wood:15,stone:0,gold:0,credits:8},
      {food:60,wood:40,stone:15,gold:0,credits:18},
      {food:150,wood:100,stone:50,gold:15,credits:35},
      {food:400,wood:250,stone:120,gold:60,credits:60},
    ],
  },
  {
    id:"oakhart", name:"House Oakhart", subtitle:"Wardens of the Wood",
    description:"They speak to the ancient trees. Marry an Oakhart to raise walls and roofs.",
    resource:"wood", resourceLabel:"Wood", ResourceIcon:TreePine,
    color:"#B8922A", colorGlow:"#D4AA3E",
    kinshipCost:15, creditCost:12, baseProduction:2.8,
    buildingName:"Lumber Mill", buildingDesc:"Seasoned wood for walls and hearths.",
    familyTraits:["Sturdy","Patient"], motto:"Roots run deep.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:15,wood:20,stone:0,gold:0,credits:8},
      {food:40,wood:60,stone:15,gold:0,credits:18},
      {food:100,wood:150,stone:50,gold:15,credits:35},
      {food:250,wood:400,stone:120,gold:60,credits:60},
    ],
  },
  {
    id:"ironvein", name:"House Ironvein", subtitle:"Masters of the Deep",
    description:"They know every seam of ore beneath the mountain. Their quarries are legendary.",
    resource:"stone", resourceLabel:"Stone", ResourceIcon:Mountain,
    color:"#8A9AAE", colorGlow:"#A8B8CC",
    kinshipCost:25, creditCost:20, baseProduction:2,
    buildingName:"Quarry", buildingDesc:"Cut stone for lasting monuments.",
    familyTraits:["Enduring","Sturdy"], motto:"We do not break.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:15,wood:15,stone:20,gold:0,credits:10},
      {food:40,wood:40,stone:70,gold:10,credits:22},
      {food:100,wood:100,stone:180,gold:30,credits:40},
      {food:250,wood:250,stone:450,gold:100,credits:70},
    ],
  },
  {
    id:"goldweave", name:"House Goldweave", subtitle:"Lords of the Ledger",
    description:"Every coin in the realm has passed through their counting houses.",
    resource:"gold", resourceLabel:"Gold", ResourceIcon:Coins,
    color:"#C9A84C", colorGlow:"#E0C060",
    kinshipCost:40, creditCost:35, baseProduction:1.2,
    buildingName:"Market", buildingDesc:"Where goods become gold and gold becomes power.",
    familyTraits:["Shrewd","Ambitious"], motto:"All things have a price.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:25,wood:25,stone:15,gold:15,credits:15},
      {food:70,wood:70,stone:50,gold:50,credits:30},
      {food:180,wood:180,stone:130,gold:130,credits:55},
      {food:450,wood:450,stone:350,gold:350,credits:90},
    ],
  },
  {
    id:"starquill", name:"House Starquill", subtitle:"Seekers of Truth",
    description:"Scholars and stargazers who chart the paths of fate itself.",
    resource:"knowledge", resourceLabel:"Knowledge", ResourceIcon:BookOpen,
    color:"#8B6EBC", colorGlow:"#A888D8",
    kinshipCost:50, creditCost:40, baseProduction:0.8,
    buildingName:"Library", buildingDesc:"Where wisdom of ages is preserved and multiplied.",
    familyTraits:["Wise","Curious"], motto:"In knowledge, eternity.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:15,wood:25,stone:15,gold:10,credits:12},
      {food:50,wood:70,stone:50,gold:35,credits:25},
      {food:130,wood:180,stone:130,gold:90,credits:50},
      {food:350,wood:450,stone:350,gold:220,credits:85},
    ],
  },
  {
    id:"blackthorn", name:"House Blackthorn", subtitle:"The Shield of the Realm",
    description:"Warriors without equal. Marry a Blackthorn to keep your bloodline safe.",
    resource:"military", resourceLabel:"Military", ResourceIcon:Shield,
    color:"#A85858", colorGlow:"#C87070",
    kinshipCost:35, creditCost:30, baseProduction:1.5,
    buildingName:"Barracks", buildingDesc:"Train warriors loyal to your blood.",
    familyTraits:["Brave","Fierce"], motto:"Through blood and iron.",
    upgradeCosts:[
      {food:0,wood:0,stone:0,gold:0,credits:0},
      {food:25,wood:25,stone:15,gold:8,credits:12},
      {food:70,wood:70,stone:50,gold:25,credits:25},
      {food:180,wood:180,stone:130,gold:70,credits:50},
      {food:450,wood:450,stone:350,gold:180,credits:85},
    ],
  },
];

const BLDG_MULT = [1, 1.8, 2.8, 4.2, 6.5];

const TREASURY_LEVELS = [
  { name:"Coin Purse", creditIncome:0, cost:{wood:0,stone:0,gold:0,credits:0}, desc:"Your chief carries loose coins." },
  { name:"Strongbox", creditIncome:2, cost:{wood:15,stone:10,gold:5,credits:10}, desc:"A locked chest under the hearth." },
  { name:"Counting House", creditIncome:5, cost:{wood:40,stone:30,gold:20,credits:25}, desc:"A dedicated room for the realm's wealth." },
  { name:"Royal Treasury", creditIncome:10, cost:{wood:100,stone:80,gold:60,credits:50}, desc:"Vaulted stone chambers guarded day and night." },
  { name:"Grand Exchequer", creditIncome:18, cost:{wood:250,stone:200,gold:150,credits:90}, desc:"A legendary institution that draws wealth from across the realm." },
  { name:"Sovereign Vault", creditIncome:30, cost:{wood:600,stone:500,gold:400,credits:150}, desc:"The greatest treasury in the known world." },
];

const TAX_PRESETS = [
  { id:"none", label:"No Tax", rate:0, creditMult:0, kinshipMult:1.15, desc:"Your people love you, but your coffers are empty.", color:"#6B9E4A" },
  { id:"low", label:"Light Tithes", rate:0.1, creditMult:0.5, kinshipMult:1.0, desc:"A fair burden. The people barely notice.", color:"#8AB86A" },
  { id:"moderate", label:"Moderate Tax", rate:0.25, creditMult:1.0, kinshipMult:0.85, desc:"A reasonable levy to fund the realm.", color:"#C9A84C" },
  { id:"high", label:"Heavy Tax", rate:0.4, creditMult:1.8, kinshipMult:0.6, desc:"The coffers swell, but murmurs grow.", color:"#C97A3C" },
  { id:"crushing", label:"Crushing Tax", rate:0.6, creditMult:3.0, kinshipMult:0.3, desc:"Gold flows in rivers — so does resentment.", color:"#A85858" },
];

const DECREES = [
  { id:"feast", name:"Hold a Feast", desc:"Celebrate with your people. Costs food, gains kinship.", cost:{credits:5,food:20}, reward:{kinship:8}, icon:Flame, color:"#C9A84C" },
  { id:"recruit", name:"Recruit Settlers", desc:"Attract new folk. Boosts all production next week.", cost:{credits:8,gold:10}, reward:{prodBoost:0.5}, icon:Users, color:"#6B9E4A" },
  { id:"fortify", name:"Fortify Walls", desc:"Strengthen defenses. Grants military.", cost:{credits:10,stone:25,wood:15}, reward:{military:15}, icon:Shield, color:"#A85858" },
  { id:"research", name:"Commission Research", desc:"Fund the scholars. Gain knowledge.", cost:{credits:12,gold:15}, reward:{knowledge:10}, icon:GraduationCap, color:"#8B6EBC" },
  { id:"trade", name:"Trade Caravan", desc:"Send merchants abroad. Spend goods for gold.", cost:{credits:6,food:15,wood:15}, reward:{gold:12}, icon:Banknote, color:"#C9A84C" },
  { id:"festival", name:"Grand Festival", desc:"A week-long celebration. Massive kinship gain.", cost:{credits:20,food:40,gold:20}, reward:{kinship:25}, icon:Sparkles, color:"#D4A574" },
];

const RES_META = {
  credits:{ label:"Credits", icon:CircleDollarSign, color:"#E8C46E" },
  kinship:{ label:"Kinship", icon:Gem, color:"#D4A574" },
  food:{ label:"Food", icon:Wheat, color:"#6B9E4A" },
  wood:{ label:"Wood", icon:TreePine, color:"#B8922A" },
  stone:{ label:"Stone", icon:Mountain, color:"#8A9AAE" },
  gold:{ label:"Gold", icon:Coins, color:"#C9A84C" },
  knowledge:{ label:"Knowledge", icon:BookOpen, color:"#8B6EBC" },
  military:{ label:"Military", icon:Shield, color:"#A85858" },
};

/* ═══════════════════════════════════════════════════
   WORLD GENERATION CONSTANTS
   ═══════════════════════════════════════════════════ */

const MAP_COLS = 28, MAP_ROWS = 18, HEX_R = 16;
const HEX_H = HEX_R * Math.sqrt(3);
const HEX_W = HEX_R * 2;

const BIOMES = {
  ocean:     { name:"Deep Ocean",  color:"#14293A", stroke:"#1A3348", icon:"~",  passable:false, yields:{} },
  coast:     { name:"Shallows",    color:"#1E3E4E", stroke:"#284E5E", icon:"≈",  passable:true,  yields:{ food:0.5 } },
  plains:    { name:"Plains",      color:"#3E5E28", stroke:"#4A6E32", icon:"🌾", passable:true,  yields:{ food:1.5, wood:0.3 } },
  forest:    { name:"Forest",      color:"#1E3E1A", stroke:"#285228", icon:"🌲", passable:true,  yields:{ food:0.4, wood:1.8 } },
  hills:     { name:"Hills",       color:"#5A4A2E", stroke:"#6A5A3A", icon:"⛰",  passable:true,  yields:{ stone:1.2, gold:0.4 } },
  mountains: { name:"Mountains",   color:"#44445A", stroke:"#555568", icon:"🏔", passable:true,  yields:{ stone:1.8, gold:0.8 } },
  desert:    { name:"Desert",      color:"#6A5A32", stroke:"#7A6A40", icon:"☀",  passable:true,  yields:{ gold:0.3, stone:0.3 } },
  swamp:     { name:"Marshlands",  color:"#2A3A1E", stroke:"#384A28", icon:"🌿", passable:true,  yields:{ food:0.3, wood:0.5 } },
  tundra:    { name:"Tundra",      color:"#4A5A68", stroke:"#5A6A78", icon:"❄",  passable:true,  yields:{ stone:0.4 } },
};

const AI_FACTIONS = [
  { id:"crimson",  name:"The Crimson Empire",   motto:"Conquer or perish.",         color:"#B83838", personality:"aggressive",   strength:75, relation:"hostile"  },
  { id:"silver",   name:"The Silver Covenant",  motto:"Commerce binds all.",        color:"#6A8AAA", personality:"diplomatic",   strength:60, relation:"neutral"  },
  { id:"verdant",  name:"The Verdant Pact",     motto:"The forest provides.",       color:"#4A8A4A", personality:"peaceful",     strength:45, relation:"friendly" },
  { id:"obsidian", name:"The Obsidian Horde",   motto:"Strength is the only law.",  color:"#7A4AA0", personality:"aggressive",   strength:70, relation:"hostile"  },
  { id:"golden",   name:"The Golden Dominion",  motto:"All things have their price.",color:"#AA8A2A", personality:"opportunistic",strength:80, relation:"neutral"  },
];

const TILE_IMPROVEMENTS = [
  { id:"farm",       name:"Farmstead",    icon:"🌾", resource:"food",     mult:2.5, biomes:["plains","forest","coast","swamp"],             cost:{ wood:8,  credits:5  }, desc:"Cultivated fields yielding grain and livestock." },
  { id:"lumber",     name:"Lumber Camp",  icon:"🪓", resource:"wood",     mult:2.5, biomes:["forest","swamp"],                              cost:{ food:5,  credits:5  }, desc:"Organized logging for timber and firewood." },
  { id:"quarry",     name:"Quarry",       icon:"⛏️", resource:"stone",    mult:2.5, biomes:["hills","mountains","tundra"],                  cost:{ wood:10, credits:8  }, desc:"Cut stone from the highland rock." },
  { id:"goldmine",   name:"Gold Mine",    icon:"💰", resource:"gold",     mult:3.0, biomes:["mountains","hills","desert"],                  cost:{ wood:12, stone:8, credits:10 }, desc:"Deep shafts to extract precious metals." },
  { id:"watchtower", name:"Watchtower",   icon:"🏰", resource:"military", mult:2.0, biomes:["plains","hills","forest","mountains","desert","tundra","coast"], cost:{ wood:10, stone:10, credits:8 }, desc:"A garrison to defend the realm." },
  { id:"settlement", name:"Settlement",   icon:"🏘️", resource:"credits",  mult:2.0, biomes:["plains","forest","hills","coast"],             cost:{ wood:15, food:10, credits:12 }, desc:"A growing village that generates taxes." },
];

const CLAIM_BASE_COST = { credits:10, military:3 };
const CLAIM_SCALE = 1.15; // cost multiplier per tile already owned

/* ═══════════════════════════════════════════════════
   TABS (updated)
   ═══════════════════════════════════════════════════ */

const TABS = [
  { id:"hearth",    label:"Hearth",    Icon:Flame },
  { id:"chief",     label:"Chief",     Icon:Crown },
  { id:"treasury",  label:"Treasury",  Icon:Landmark },
  { id:"village",   label:"Village",   Icon:Building2 },
  { id:"realm",     label:"Realm",     Icon:Map },
  { id:"families",  label:"Families",  Icon:HeartHandshake },
  { id:"decrees",   label:"Decrees",   Icon:Scroll },
  { id:"chronicle", label:"Chronicle", Icon:ScrollText },
  { id:"settings",  label:"Settings",  Icon:Settings },
];

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

const rng = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const fmt = (n,d=1) => { if(n>=1e6) return (n/1e6).toFixed(1)+"M"; if(n>=1e4) return (n/1e3).toFixed(1)+"K"; if(n>=1e3) return (n/1e3).toFixed(2)+"K"; return n<10?n.toFixed(d):Math.floor(n).toString(); };
const lerp = (a,b,t) => a + (b-a)*t;

const createChief = (gen, marriages, settings, prevTraits=[]) => {
  let pool = [...ALL_TRAITS];
  marriages.forEach(mId => {
    const f = FAMILIES.find(x=>x.id===mId);
    if(f) f.familyTraits.forEach(tn => { const t=ALL_TRAITS.find(x=>x.name===tn); if(t) pool.push(t,t); });
  });
  prevTraits.forEach(tn => { const t=ALL_TRAITS.find(x=>x.name===tn); if(t) pool.push(t); });
  const qMap = {low:1,normal:2,high:3,legendary:4};
  const cnt = Math.min(qMap[settings.heirQuality]||2,4);
  const traits = _.uniqBy(_.shuffle(pool),"name").slice(0,cnt);
  const lsBonus = traits.reduce((s,t)=>t.effect==="lifespan"?s+t.bonus:s,0);
  const hpBonus = traits.reduce((s,t)=>t.effect==="health"?s+t.bonus:s,0);
  return {
    name:pick(NAMES), epithet:gen>1?pick(EPITHETS):"the First",
    age:16, maxAge:rng(settings.lifespanMin,settings.lifespanMax)+lsBonus,
    health:100+hpBonus, maxHealth:100+hpBonus,
    traits:traits.map(t=>t.name), generation:gen,
  };
};

/* ═══════════════════════════════════════════════════
   WORLD GENERATION
   ═══════════════════════════════════════════════════ */

function hashNoise(x, y, seed) {
  let h = (seed|0) + (x|0) * 374761393 + (y|0) * 668265263;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  h = h ^ (h >> 16);
  return ((h & 0x7fffffff) / 0x7fffffff);
}

function smoothNoise(x, y, seed) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const n00 = hashNoise(ix, iy, seed), n10 = hashNoise(ix+1, iy, seed);
  const n01 = hashNoise(ix, iy+1, seed), n11 = hashNoise(ix+1, iy+1, seed);
  return lerp(lerp(n00, n10, sx), lerp(n01, n11, sx), sy);
}

function fbm(x, y, seed, octaves=4) {
  let val=0, amp=1, freq=1, max=0;
  for (let i=0; i<octaves; i++) {
    val += smoothNoise(x*freq, y*freq, seed+i*1337) * amp;
    max += amp; amp *= 0.5; freq *= 2;
  }
  return val / max;
}

function getHexNeighbors(col, row) {
  const odd = col & 1;
  const dirs = odd
    ? [[1,0],[1,1],[0,1],[-1,1],[-1,0],[0,-1]]
    : [[1,-1],[1,0],[0,1],[-1,0],[-1,-1],[0,-1]];
  return dirs.map(([dc,dr])=>[col+dc, row+dr]).filter(([c,r])=>c>=0&&c<MAP_COLS&&r>=0&&r<MAP_ROWS);
}

function tileKey(c,r) { return c * MAP_ROWS + r; }

function generateWorld(seed) {
  const tiles = [];
  const cx = MAP_COLS/2, cy = MAP_ROWS/2;
  const maxDist = Math.sqrt(cx*cx + cy*cy);

  for (let col=0; col<MAP_COLS; col++) {
    for (let row=0; row<MAP_ROWS; row++) {
      const nx = col/MAP_COLS, ny = row/MAP_ROWS;
      const dist = Math.sqrt((col-cx)**2 + (row-cy)**2) / maxDist;
      const elevation = fbm(nx*5, ny*5, seed) - dist*0.55 - 0.05;
      const moisture = fbm(nx*4, ny*4, seed+5000);
      const temp = 1 - Math.abs(row - MAP_ROWS/2) / (MAP_ROWS/2) * 0.8;

      let biome;
      if (elevation < 0.10) biome = "ocean";
      else if (elevation < 0.18) biome = "coast";
      else if (elevation > 0.65) biome = "mountains";
      else if (elevation > 0.50) biome = "hills";
      else if (temp < 0.28 && elevation > 0.18) biome = "tundra";
      else if (moisture < 0.32) biome = "desert";
      else if (moisture > 0.68) biome = "swamp";
      else if (moisture > 0.48) biome = "forest";
      else biome = "plains";

      tiles.push({ col, row, biome, elevation, owner:null, improvement:null });
    }
  }

  // Place player near center
  const passable = tiles.filter(t => BIOMES[t.biome].passable);
  const playerStart = passable
    .filter(t => t.biome==="plains"||t.biome==="forest")
    .sort((a,b) => (Math.abs(a.col-cx)+Math.abs(a.row-cy)) - (Math.abs(b.col-cx)+Math.abs(b.row-cy)))[0];
  if (playerStart) {
    playerStart.owner = "player";
    const nbs = getHexNeighbors(playerStart.col, playerStart.row);
    let claimed = 0;
    for (const [nc,nr] of _.shuffle(nbs)) {
      if (claimed >= 5) break;
      const t = tiles[tileKey(nc,nr)];
      if (t && BIOMES[t.biome].passable && !t.owner) { t.owner = "player"; claimed++; }
    }
    // second ring
    const playerTiles = tiles.filter(t=>t.owner==="player");
    for (const pt of _.shuffle(playerTiles)) {
      if (tiles.filter(t=>t.owner==="player").length >= 8) break;
      for (const [nc,nr] of _.shuffle(getHexNeighbors(pt.col, pt.row))) {
        if (tiles.filter(t=>t.owner==="player").length >= 8) break;
        const t = tiles[tileKey(nc,nr)];
        if (t && BIOMES[t.biome].passable && !t.owner) t.owner = "player";
      }
    }
  }

  // Place AI factions spread around the map
  const spots = [
    [cx*0.35, cy*0.30], [cx*1.65, cy*0.30],
    [cx*0.25, cy*1.55], [cx*1.75, cy*1.60],
    [cx*1.0,  cy*0.15],
  ];
  AI_FACTIONS.forEach((fac, i) => {
    const [tx,ty] = spots[i];
    const start = passable.filter(t=>!t.owner)
      .sort((a,b)=>(Math.abs(a.col-tx)+Math.abs(a.row-ty))-(Math.abs(b.col-tx)+Math.abs(b.row-ty)))[0];
    if (!start) return;
    start.owner = fac.id;
    const tileCount = 4 + Math.floor(Math.random()*5);
    let facTiles = [start];
    for (let n=0; n<tileCount; n++) {
      const ft = _.sample(facTiles);
      if (!ft) break;
      const nbrs = getHexNeighbors(ft.col, ft.row);
      for (const [nc,nr] of _.shuffle(nbrs)) {
        const t = tiles[tileKey(nc,nr)];
        if (t && BIOMES[t.biome].passable && !t.owner) {
          t.owner = fac.id; facTiles.push(t); break;
        }
      }
    }
    // Give AI factions some improvements
    facTiles.slice(0,3).forEach(ft => {
      const valid = TILE_IMPROVEMENTS.filter(imp => imp.biomes.includes(ft.biome));
      if (valid.length) ft.improvement = _.sample(valid).id;
    });
  });

  return tiles;
}

function getClaimCost(playerTileCount) {
  const scale = Math.pow(CLAIM_SCALE, Math.max(0, playerTileCount - 6));
  return {
    credits: Math.floor(CLAIM_BASE_COST.credits * scale),
    military: Math.floor(CLAIM_BASE_COST.military * scale),
  };
}

/* ═══════════════════════════════════════════════════
   INIT STATE
   ═══════════════════════════════════════════════════ */

const initState = () => {
  const settings = {
    gameSpeed:1, agingRate:1, kinshipRate:1, resourceMult:1,
    lifespanMin:48, lifespanMax:68, heirQuality:"normal",
    marriageCostMult:1, buildingCostMult:1, legacyBonus:0.05,
    weeksPerAge:52,
  };
  const seed = Math.floor(Math.random() * 999999);
  return {
    chief:{ name:"Aldric", epithet:"the First", age:16, maxAge:rng(48,68), health:100, maxHealth:100, traits:["Brave","Frugal"], generation:1 },
    resources:{ credits:100, kinship:8, food:10, wood:10, stone:0, gold:5, knowledge:0, military:0 },
    marriages:[], buildings:{}, treasuryLevel:0,
    taxPolicy:"low",
    chronicle:[], events:[{ text:"Week 1 — Aldric the First lights the first hearth. The Bloodline begins.", type:"story", week:0 }],
    settings, generation:1, week:0, paused:false,
    deathScreen:null, marriageAnim:null, weekReport:null,
    totalKinship:8, totalCreditsEarned:100,
    prodBoost:0,
    // WORLD STATE
    worldSeed: seed,
    worldTiles: generateWorld(seed),
    selectedTile: null,
  };
};

/* ═══════════════════════════════════════════════════
   ADVANCE WEEK ENGINE
   ═══════════════════════════════════════════════════ */

function advanceWeeks(state, numWeeks) {
  let s = { ...state, resources:{...state.resources}, events:[...state.events], chronicle:[...state.chronicle], chief:{...state.chief}, worldTiles: state.worldTiles.map(t=>({...t})) };
  let weeklyGains = { credits:0, kinship:0, food:0, wood:0, stone:0, gold:0, knowledge:0, military:0 };
  let deathOccurred = false;

  for (let w = 0; w < numWeeks; w++) {
    if (deathOccurred) break;
    s.week++;

    const chief = s.chief;
    const traitObjs = chief.traits.map(tn => ALL_TRAITS.find(t=>t.name===tn)).filter(Boolean);
    const legacyMult = 1 + Math.max(0, s.generation - 1) * s.settings.legacyBonus;
    const allBonus = traitObjs.reduce((a,t)=>t.effect==="all"?a+t.bonus:a, 0);
    const creditTraitBonus = traitObjs.reduce((a,t)=>t.effect==="credits"?a+t.bonus:a, 0);
    const kinTraitBonus = traitObjs.reduce((a,t)=>t.effect==="kinship"?a+t.bonus:a, 0);
    const taxP = TAX_PRESETS.find(t=>t.id===s.taxPolicy) || TAX_PRESETS[1];
    const tIncome = TREASURY_LEVELS[s.treasuryLevel].creditIncome;

    let creditIncome = 3 + tIncome + (taxP.creditMult * s.marriages.length * 2);
    creditIncome *= (1 + creditTraitBonus) * s.settings.resourceMult;
    creditIncome = Math.round(creditIncome * 100) / 100;

    let kinshipIncome = (0.8 + s.marriages.length * 0.4) * s.settings.kinshipRate * taxP.kinshipMult;
    kinshipIncome *= (1 + kinTraitBonus);
    kinshipIncome = Math.round(kinshipIncome * 100) / 100;

    let resGains = { food:0, wood:0, stone:0, gold:0, knowledge:0, military:0 };
    s.marriages.forEach(mId => {
      const fam = FAMILIES.find(f=>f.id===mId);
      if (!fam) return;
      const level = s.buildings[fam.id] || 1;
      let prod = fam.baseProduction * BLDG_MULT[level-1] * s.settings.resourceMult * legacyMult;
      const traitBonus = traitObjs.reduce((a,t)=>t.effect===fam.resource?a+t.bonus:a, 0);
      prod *= (1 + traitBonus + allBonus);
      if (s.prodBoost > 0) prod *= (1 + s.prodBoost);
      resGains[fam.resource] += prod;
    });

    // TERRITORY PRODUCTION
    const playerTiles = s.worldTiles.filter(t => t.owner === "player");
    playerTiles.forEach(tile => {
      const biome = BIOMES[tile.biome];
      if (!biome || !biome.yields) return;
      Object.entries(biome.yields).forEach(([res, amt]) => {
        let prod = amt * 0.4 * s.settings.resourceMult;
        if (tile.improvement) {
          const imp = TILE_IMPROVEMENTS.find(i => i.id === tile.improvement);
          if (imp && imp.resource === res) prod *= imp.mult;
        }
        prod *= legacyMult;
        if (resGains[res] !== undefined) resGains[res] += prod;
      });
    });

    // Territory credit/kinship bonus from settlements
    playerTiles.filter(t => t.improvement === "settlement").forEach(() => {
      creditIncome += 1.5;
    });

    s.resources.credits += creditIncome;
    s.resources.kinship += kinshipIncome;
    Object.keys(resGains).forEach(k => { s.resources[k] += resGains[k]; });
    s.totalKinship += kinshipIncome;
    s.totalCreditsEarned += creditIncome;

    weeklyGains.credits += creditIncome;
    weeklyGains.kinship += kinshipIncome;
    Object.keys(resGains).forEach(k => { weeklyGains[k] += resGains[k]; });

    s.prodBoost = 0;

    const ageGain = s.settings.agingRate / s.settings.weeksPerAge;
    s.chief = { ...s.chief, age: s.chief.age + ageGain };

    const ageRatio = (s.chief.age - 16) / (s.chief.maxAge - 16);
    if (ageRatio > 0.75) {
      const decay = (ageRatio - 0.75) * 2;
      s.chief = { ...s.chief, health: Math.max(0, s.chief.health - decay) };
    }

    if (s.chief.age >= s.chief.maxAge || s.chief.health <= 0) {
      const deathAge = Math.floor(Math.min(s.chief.age, s.chief.maxAge));
      const yearsRuled = deathAge - 16;
      const oldEntry = { name:s.chief.name, epithet:s.chief.epithet, deathAge, yearsRuled, marriages:s.marriages.length, generation:s.generation, traits:s.chief.traits };
      s.chronicle = [...s.chronicle, oldEntry];
      const newChief = createChief(s.generation+1, s.marriages, s.settings, s.chief.traits);
      s.deathScreen = { oldChief:{ ...oldEntry }, newChief };
      s.events = [...s.events, { text:`Week ${s.week} — Chief ${s.chief.name} ${s.chief.epithet} has died at age ${deathAge}.`, type:"death", week:s.week }];
      deathOccurred = true;
    }
  }

  if (!deathOccurred) {
    s.weekReport = { weeksAdvanced: numWeeks, gains: weeklyGains };
  }
  return s;
}

/* ═══════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════ */

const Bar = ({value,max,color="#C4956A",h=8,bg="rgba(255,255,255,0.06)",label,showText,glow}) => (
  <div style={{width:"100%"}}>
    {label && <div style={{fontSize:11,color:"#9B9088",marginBottom:3,fontFamily:"'EB Garamond',serif"}}>{label}</div>}
    <div style={{width:"100%",height:h,borderRadius:h/2,background:bg,overflow:"hidden"}}>
      <div style={{width:`${Math.min(100,(value/max)*100)}%`,height:"100%",borderRadius:h/2,background:`linear-gradient(90deg,${color},${color}dd)`,transition:"width 0.4s ease",boxShadow:glow?`0 0 8px ${color}60`:"none"}} />
    </div>
    {showText && <div style={{fontSize:11,color:"#9B9088",marginTop:2,textAlign:"right",fontFamily:"'EB Garamond',serif"}}>{fmt(value)} / {fmt(max)}</div>}
  </div>
);

const Card = ({children,style,onClick,hover,glow}) => (
  <div onClick={onClick} style={{
    background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",
    borderRadius:10,padding:16,transition:"all 0.2s ease",
    cursor:onClick?"pointer":"default",
    ...(glow?{boxShadow:`0 0 16px ${glow}15, inset 0 0 12px ${glow}06`}:{}),
    ...style,
  }}
    onMouseEnter={e=>{if(hover){e.currentTarget.style.borderColor="rgba(196,149,106,0.25)";e.currentTarget.style.background="rgba(255,255,255,0.04)";}}}
    onMouseLeave={e=>{if(hover){e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.background="rgba(255,255,255,0.025)";}}}
  >{children}</div>
);

const Sec = ({children,icon:IC,color,extra}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,paddingBottom:8,borderBottom:"1px solid rgba(196,149,106,0.12)"}}>
    {IC && <IC size={17} style={{color:color||"#C4956A"}} />}
    <h2 style={{margin:0,fontSize:17,fontFamily:"'Cinzel',serif",fontWeight:600,color:"#E8DFD0",letterSpacing:1,flex:1}}>{children}</h2>
    {extra}
  </div>
);

const Badge = ({children,color="#C4956A"}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 10px",borderRadius:20,background:`${color}15`,border:`1px solid ${color}28`,color,fontSize:12,fontFamily:"'EB Garamond',serif",fontWeight:500}}>{children}</span>
);

const Btn = ({children,onClick,disabled,color="#C4956A",small,style:xStyle}) => (
  <button onClick={onClick} disabled={disabled} style={{
    padding:small?"6px 14px":"10px 22px",borderRadius:8,
    border:`1px solid ${disabled?"rgba(255,255,255,0.07)":color+"55"}`,
    background:disabled?"rgba(255,255,255,0.02)":`${color}18`,
    color:disabled?"#55504A":color,cursor:disabled?"not-allowed":"pointer",
    fontFamily:"'Cinzel',serif",fontSize:small?11:13,fontWeight:600,
    letterSpacing:0.5,transition:"all 0.2s ease",whiteSpace:"nowrap",...xStyle,
  }}
    onMouseEnter={e=>{if(!disabled){e.target.style.background=`${color}2C`;e.target.style.boxShadow=`0 0 14px ${color}18`;}}}
    onMouseLeave={e=>{if(!disabled){e.target.style.background=disabled?"rgba(255,255,255,0.02)":`${color}18`;e.target.style.boxShadow="none";}}}
  >{children}</button>
);

const Slider = ({label,value,min,max,step,onChange,format,desc}) => (
  <div style={{marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
      <span style={{color:"#E8DFD0",fontFamily:"'EB Garamond',serif",fontSize:14}}>{label}</span>
      <span style={{color:"#C4956A",fontFamily:"'EB Garamond',serif",fontSize:14,fontWeight:600}}>{format?format(value):value}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(parseFloat(e.target.value))}
      style={{width:"100%",accentColor:"#C4956A",height:4,cursor:"pointer"}} />
    {desc && <div style={{fontSize:11,color:"#5A5550",marginTop:3,fontFamily:"'EB Garamond',serif"}}>{desc}</div>}
  </div>
);

const ResIcon = ({res,size=14}) => { const IC=RES_META[res]?.icon; return IC?<IC size={size} style={{color:RES_META[res].color}} />:null; };

const CostTag = ({res,amt,have}) => (
  <span style={{fontSize:11,padding:"2px 7px",borderRadius:4,display:"inline-flex",alignItems:"center",gap:3,
    background:have>=amt?"rgba(107,158,74,0.12)":"rgba(168,88,88,0.12)",
    color:have>=amt?"#7AB05A":"#B86060",fontFamily:"'EB Garamond',serif"}}>
    <ResIcon res={res} size={10} />{Math.floor(amt)} {RES_META[res]?.label||res}
  </span>
);

/* ═══════════════════════════════════════════════════
   ADVANCE WEEK BUTTON BAR
   ═══════════════════════════════════════════════════ */

const AdvanceBar = ({state,onAdvance}) => {
  const [flash, setFlash] = useState(false);
  const doAdvance = (n) => { setFlash(true); onAdvance(n); setTimeout(()=>setFlash(false),300); };
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:8,padding:"10px 20px",
      background:flash?"rgba(196,149,106,0.06)":"rgba(15,13,20,0.5)",
      borderTop:"1px solid rgba(196,149,106,0.08)",transition:"background 0.3s ease",
    }}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#9B9088",letterSpacing:1,marginRight:4}}>
        WEEK <span style={{color:"#E8DFD0",fontWeight:700,fontSize:15}}>{state.week}</span>
      </div>
      <div style={{width:1,height:24,background:"rgba(255,255,255,0.08)",margin:"0 4px"}} />
      <Btn onClick={()=>doAdvance(1)} color="#D4A574" small>
        <Play size={12} style={{marginRight:4}} />+1 Week
      </Btn>
      <Btn onClick={()=>doAdvance(4)} color="#C4956A" small>
        <FastForward size={12} style={{marginRight:4}} />+4 Weeks
      </Btn>
      <Btn onClick={()=>doAdvance(12)} color="#B8922A" small>
        <ChevronsRight size={12} style={{marginRight:4}} />+12 Weeks
      </Btn>
      <Btn onClick={()=>doAdvance(52)} color="#A85858" small>
        <Zap size={12} style={{marginRight:4}} />+1 Year
      </Btn>
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <CircleDollarSign size={15} style={{color:"#E8C46E"}} />
          <span style={{fontSize:15,fontWeight:700,color:"#E8C46E",fontFamily:"'Cinzel',serif",fontVariantNumeric:"tabular-nums"}}>{fmt(state.resources.credits)}</span>
          <span style={{fontSize:10,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>credits</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   WEEK REPORT TOAST
   ═══════════════════════════════════════════════════ */
const WeekReport = ({report,onDismiss}) => {
  useEffect(()=>{const t=setTimeout(onDismiss,3500);return()=>clearTimeout(t);},[onDismiss]);
  const g = report.gains;
  const items = Object.entries(g).filter(([,v])=>v>0);
  return (
    <div style={{
      position:"fixed",top:16,right:16,zIndex:900,padding:"14px 20px",
      background:"linear-gradient(135deg,rgba(20,18,28,0.97),rgba(30,26,42,0.97))",
      border:"1px solid rgba(196,149,106,0.2)",borderRadius:10,minWidth:220,
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)",animation:"slideDown 0.3s ease",cursor:"pointer",
    }} onClick={onDismiss}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:8}}>
        +{report.weeksAdvanced} WEEK{report.weeksAdvanced>1?"S":""}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {items.map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <ResIcon res={k} size={12} />
              <span style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>{RES_META[k]?.label||k}</span>
            </div>
            <span style={{fontSize:12,color:RES_META[k]?.color||"#E8DFD0",fontWeight:600,fontFamily:"'EB Garamond',serif"}}>+{fmt(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: HEARTH
   ═══════════════════════════════════════════════════ */

const HearthTab = ({state,rates,onNav}) => {
  const {chief,generation,marriages,resources,week,taxPolicy,treasuryLevel,worldTiles} = state;
  const agePct = ((chief.age-16)/(chief.maxAge-16))*100;
  const taxP = TAX_PRESETS.find(t=>t.id===taxPolicy)||TAX_PRESETS[1];
  const next = FAMILIES.filter(f=>!marriages.includes(f.id)).sort((a,b)=>(a.kinshipCost+a.creditCost)-(b.kinshipCost+b.creditCost))[0];
  const playerTileCount = worldTiles.filter(t=>t.owner==="player").length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      {generation===1 && marriages.length===0 && (
        <Card style={{background:"linear-gradient(135deg,rgba(196,149,106,0.07),rgba(139,38,53,0.05))",border:"1px solid rgba(196,149,106,0.12)"}}>
          <div style={{fontFamily:"'EB Garamond',serif",fontStyle:"italic",color:"#D4A574",fontSize:16,lineHeight:1.7,textAlign:"center"}}>
            "You are the first chief of a nameless clan.<br/>
            You have 100 credits, a cold hearth, and {playerTileCount} tiles of land.<br/>
            Advance the weeks. Forge alliances. Build a dynasty."
          </div>
          <div style={{textAlign:"center",marginTop:12,fontSize:13,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>
            Use <span style={{color:"#E8C46E",fontWeight:600}}>Credits</span> and <span style={{color:"#D4A574",fontWeight:600}}>Kinship</span> to forge marriages. Advance weeks to earn income.
          </div>
        </Card>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card glow="#C4956A">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:48,height:48,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#C4956A28,#8B263518)",border:"2px solid #C4956A35",fontFamily:"'Cinzel Decorative',serif",fontSize:20,color:"#D4A574",fontWeight:700}}>{chief.name[0]}</div>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:16,color:"#E8DFD0",fontWeight:600}}>{chief.name}</div>
              <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",fontStyle:"italic"}}>{chief.epithet}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:14,marginBottom:10}}>
            <div><span style={{fontSize:11,color:"#5A5550"}}>Age</span><div style={{fontSize:17,color:"#E8DFD0",fontWeight:600}}>{Math.floor(chief.age)}</div></div>
            <div><span style={{fontSize:11,color:"#5A5550"}}>Gen</span><div style={{fontSize:17,color:"#D4A574",fontWeight:600}}>{generation}</div></div>
            <div><span style={{fontSize:11,color:"#5A5550"}}>Week</span><div style={{fontSize:17,color:"#E8DFD0",fontWeight:600}}>{week}</div></div>
          </div>
          <Bar value={chief.age-16} max={chief.maxAge-16} color={agePct>80?"#8B2635":agePct>60?"#B89B3E":"#6B9E4A"} label="Lifespan" glow={agePct>80} />
        </Card>

        <Card>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#E8C46E",marginBottom:10,letterSpacing:1,display:"flex",alignItems:"center",gap:6}}>
            <CircleDollarSign size={14} />WEEKLY INCOME
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
            <span style={{fontSize:28,color:"#E8C46E",fontFamily:"'Cinzel',serif",fontWeight:700}}>{fmt(rates.credits)}</span>
            <span style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>credits/week</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {Object.entries(rates).filter(([k])=>k!=="credits").map(([k,v])=>{
              const unlocked = k==="kinship"||marriages.some(m=>FAMILIES.find(f=>f.id===m)?.resource===k)||v>0;
              return (
                <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"2px 0",opacity:unlocked?1:0.25}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <ResIcon res={k} size={12} />
                    <span style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>{RES_META[k].label}</span>
                  </div>
                  <span style={{fontSize:12,color:unlocked?RES_META[k].color:"#3A3838",fontFamily:"'EB Garamond',serif"}}>
                    {unlocked?`+${fmt(v)}/wk`:<span style={{display:"flex",alignItems:"center",gap:3}}><Lock size={9}/>locked</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
        <Card style={{textAlign:"center",padding:12}} hover onClick={()=>onNav("treasury")}>
          <div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>TREASURY</div>
          <div style={{fontSize:14,color:"#E8C46E",fontFamily:"'Cinzel',serif",fontWeight:600}}>{TREASURY_LEVELS[state.treasuryLevel].name}</div>
        </Card>
        <Card style={{textAlign:"center",padding:12}} hover onClick={()=>onNav("treasury")}>
          <div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>TAX POLICY</div>
          <div style={{fontSize:14,color:taxP.color,fontFamily:"'Cinzel',serif",fontWeight:600}}>{taxP.label}</div>
        </Card>
        <Card style={{textAlign:"center",padding:12}}>
          <div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>ALLIANCES</div>
          <div style={{fontSize:14,color:"#D4A574",fontFamily:"'Cinzel',serif",fontWeight:600}}>{marriages.length} / {FAMILIES.length}</div>
        </Card>
        <Card style={{textAlign:"center",padding:12}} hover onClick={()=>onNav("realm")}>
          <div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>TERRITORY</div>
          <div style={{fontSize:14,color:"#6B9E4A",fontFamily:"'Cinzel',serif",fontWeight:600}}>{playerTileCount} tiles</div>
        </Card>
      </div>

      {next && (
        <Card hover onClick={()=>onNav("families")} style={{cursor:"pointer",borderColor:"rgba(196,149,106,0.10)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#9B9088",letterSpacing:1,marginBottom:3}}>NEXT GOAL</div>
              <div style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:"#E8DFD0"}}>
                Marry <span style={{color:next.color}}>{next.name}</span>
              </div>
              <div style={{fontSize:12,color:"#5A5550",marginTop:2,fontFamily:"'EB Garamond',serif"}}>
                {Math.floor(next.kinshipCost*state.settings.marriageCostMult)} Kinship + {Math.floor(next.creditCost*state.settings.marriageCostMult)} Credits → {next.resourceLabel}
              </div>
            </div>
            <ChevronRight size={18} style={{color:"#C4956A"}} />
          </div>
        </Card>
      )}

      {marriages.length > 0 && (
        <Card>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:8}}>ACTIVE ALLIANCES</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {marriages.map(mId=>{const f=FAMILIES.find(x=>x.id===mId);return f?<Badge key={mId} color={f.color}>{f.name}</Badge>:null;})}
          </div>
        </Card>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: CHIEF
   ═══════════════════════════════════════════════════ */

const ChiefTab = ({state}) => {
  const {chief,generation,marriages} = state;
  const agePct = ((chief.age-16)/(chief.maxAge-16))*100;
  const traits = chief.traits.map(tn=>ALL_TRAITS.find(t=>t.name===tn)).filter(Boolean);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>
        <div style={{width:110,height:130,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,background:"linear-gradient(180deg,rgba(196,149,106,0.10) 0%,rgba(139,38,53,0.06) 100%)",border:"2px solid rgba(196,149,106,0.18)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#C4956A,transparent)"}} />
          <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:44,color:"#D4A574",fontWeight:700,lineHeight:1}}>{chief.name[0]}</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#9B9088",marginTop:4,letterSpacing:2}}>GEN {generation}</div>
        </div>
        <div style={{flex:1}}>
          <h2 style={{margin:0,fontFamily:"'Cinzel',serif",fontSize:22,color:"#E8DFD0",fontWeight:700}}>{chief.name}</h2>
          <div style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:"#C4956A",fontStyle:"italic",marginBottom:12}}>{chief.epithet}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            {[{label:"AGE",val:Math.floor(chief.age),color:agePct>80?"#A83845":"#E8DFD0"},{label:"HEALTH",val:Math.floor(chief.health),color:"#6B9E4A"},{label:"GEN",val:generation,color:"#D4A574"}].map(({label,val,color})=>(
              <div key={label} style={{padding:"7px 10px",background:"rgba(255,255,255,0.025)",borderRadius:8,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#5A5550",marginBottom:2}}>{label}</div>
                <div style={{fontSize:20,color,fontWeight:700}}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Card><Sec icon={Clock} color="#D4A574">Lifespan</Sec><Bar value={chief.age-16} max={chief.maxAge-16} color={agePct>80?"#8B2635":agePct>60?"#B89B3E":"#6B9E4A"} h={12} showText glow={agePct>80} /><div style={{fontSize:12,color:"#5A5550",marginTop:5,fontFamily:"'EB Garamond',serif"}}>Expected: ~{Math.floor(chief.maxAge)} years{agePct>75?" — the twilight years…":""}</div></Card>
      <Card><Sec icon={Star}>Traits</Sec><div style={{display:"flex",flexDirection:"column",gap:6}}>{traits.length===0&&<div style={{color:"#5A5550",fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>No notable traits</div>}{traits.map(t=><div key={t.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:"rgba(255,255,255,0.018)",borderRadius:8}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{t.icon}</span><div><div style={{fontSize:13,color:"#E8DFD0",fontWeight:500,fontFamily:"'EB Garamond',serif"}}>{t.name}</div><div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif"}}>{t.desc}</div></div></div></div>)}</div></Card>
      <Card><Sec icon={HeartHandshake}>Marriages</Sec>{marriages.length===0?<div style={{color:"#5A5550",fontFamily:"'EB Garamond',serif",fontStyle:"italic",textAlign:"center",padding:14}}>No marriages yet.</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>{marriages.map(mId=>{const f=FAMILIES.find(x=>x.id===mId);if(!f)return null;const IC=f.ResourceIcon;return<div key={mId} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:`${f.color}0C`,borderRadius:8,border:`1px solid ${f.color}18`}}><IC size={16} style={{color:f.color}} /><div><div style={{fontSize:13,color:"#E8DFD0",fontFamily:"'EB Garamond',serif"}}>{f.name}</div><div style={{fontSize:11,color:f.color,fontFamily:"'EB Garamond',serif"}}>Provides {f.resourceLabel}</div></div></div>;})}</div>}</Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: TREASURY
   ═══════════════════════════════════════════════════ */

const TreasuryTab = ({state,dispatch,rates}) => {
  const {resources,treasuryLevel,taxPolicy,marriages,settings} = state;
  const taxP = TAX_PRESETS.find(t=>t.id===taxPolicy)||TAX_PRESETS[1];
  const tData = TREASURY_LEVELS[treasuryLevel];
  const nextT = treasuryLevel < TREASURY_LEVELS.length-1 ? TREASURY_LEVELS[treasuryLevel+1] : null;
  const canAffordTreasury = nextT && Object.entries(nextT.cost).every(([k,v])=>resources[k]>=v*settings.buildingCostMult);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={Landmark} color="#E8C46E">Royal Treasury</Sec>
      <Card glow="#E8C46E" style={{textAlign:"center",padding:24}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#9B9088",letterSpacing:2,marginBottom:8}}>REALM TREASURY</div>
        <div style={{fontSize:48,fontFamily:"'Cinzel',serif",fontWeight:900,color:"#E8C46E",lineHeight:1}}>{fmt(resources.credits)}</div>
        <div style={{fontSize:14,color:"#9B9088",fontFamily:"'EB Garamond',serif",marginTop:4}}>credits available</div>
        <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:16}}>
          <div><div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>WEEKLY</div><div style={{fontSize:20,color:"#6B9E4A",fontWeight:700}}>+{fmt(rates.credits)}</div></div>
          <div><div style={{fontSize:10,color:"#5A5550",letterSpacing:1}}>LIFETIME</div><div style={{fontSize:20,color:"#D4A574",fontWeight:700}}>{fmt(state.totalCreditsEarned)}</div></div>
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:48,height:48,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(232,196,110,0.10)",border:"1px solid rgba(232,196,110,0.20)"}}><PiggyBank size={24} style={{color:"#E8C46E"}} /></div>
          <div style={{flex:1}}><div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:"#E8DFD0",fontWeight:600}}>{tData.name}</div><div style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>Treasury Level {treasuryLevel+1} / {TREASURY_LEVELS.length}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#5A5550"}}>Income Bonus</div><div style={{fontSize:18,color:"#E8C46E",fontWeight:700}}>+{tData.creditIncome}/wk</div></div>
        </div>
        <Bar value={treasuryLevel+1} max={TREASURY_LEVELS.length} color="#E8C46E" h={6} />
        <div style={{fontSize:13,color:"#9B9088",fontFamily:"'EB Garamond',serif",fontStyle:"italic",marginTop:8}}>{tData.desc}</div>
        {nextT && (
          <div style={{marginTop:14,padding:12,background:"rgba(255,255,255,0.02)",borderRadius:8,border:"1px solid rgba(255,255,255,0.04)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:12,color:"#E8DFD0",fontFamily:"'Cinzel',serif"}}>Upgrade → {nextT.name}</div><div style={{fontSize:11,color:"#6B9E4A",fontFamily:"'EB Garamond',serif"}}>+{nextT.creditIncome} credits/week</div></div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
              {Object.entries(nextT.cost).filter(([,v])=>v>0).map(([k,v])=><CostTag key={k} res={k} amt={Math.floor(v*settings.buildingCostMult)} have={resources[k]} />)}
            </div>
            <Btn onClick={()=>dispatch({type:"UPGRADE_TREASURY"})} disabled={!canAffordTreasury} color="#E8C46E" small><Hammer size={12} style={{marginRight:4}} />Upgrade Treasury</Btn>
          </div>
        )}
        {!nextT && <div style={{marginTop:10,fontSize:13,color:"#E8C46E",fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>✦ Maximum Level</div>}
      </Card>

      <Card>
        <Sec icon={Receipt} color="#C9A84C">Tax Policy</Sec>
        <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",marginBottom:14}}>Higher taxes fill your coffers but erode the kinship that binds alliances.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {TAX_PRESETS.map(tp=>{
            const active = taxPolicy===tp.id;
            return (
              <div key={tp.id} onClick={()=>dispatch({type:"SET_TAX",policy:tp.id})} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:8,cursor:"pointer",background:active?`${tp.color}12`:"rgba(255,255,255,0.015)",border:`1px solid ${active?tp.color+"35":"rgba(255,255,255,0.04)"}`,transition:"all 0.2s ease"}}>
                <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${active?tp.color:"#4A4448"}`,background:active?tp.color:"transparent",transition:"all 0.2s ease",flexShrink:0}} />
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontFamily:"'Cinzel',serif",fontSize:13,color:active?tp.color:"#E8DFD0",fontWeight:active?600:400}}>{tp.label}</span>
                    <div style={{display:"flex",gap:10,fontSize:11,fontFamily:"'EB Garamond',serif"}}><span style={{color:"#E8C46E"}}>💰 ×{tp.creditMult.toFixed(1)}</span><span style={{color:"#D4A574"}}>🤝 ×{tp.kinshipMult.toFixed(2)}</span></div>
                  </div>
                  <div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif",marginTop:2,fontStyle:"italic"}}>{tp.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <Sec icon={TrendingUp} color="#6B9E4A">Weekly Income Breakdown</Sec>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {[["Base Income","+3 credits"],["Treasury ("+tData.name+")","+"+tData.creditIncome+" credits"],["Taxes ("+taxP.label+", "+marriages.length+" alliances)","+"+fmt(taxP.creditMult*marriages.length*2)+" credits"]].map(([l,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>{l}</span><span style={{fontSize:12,color:"#E8C46E",fontFamily:"'EB Garamond',serif"}}>{v}</span></div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",marginTop:4}}><span style={{fontSize:13,color:"#E8DFD0",fontFamily:"'Cinzel',serif",fontWeight:600}}>Total</span><span style={{fontSize:13,color:"#E8C46E",fontFamily:"'Cinzel',serif",fontWeight:700}}>+{fmt(rates.credits)} credits/week</span></div>
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: VILLAGE
   ═══════════════════════════════════════════════════ */

const VillageTab = ({state,dispatch}) => {
  const {marriages,buildings,resources,settings} = state;
  const canAfford = (costs,mult) => Object.entries(costs).every(([r,a])=>resources[r]>=a*mult);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={Building2}>Your Village</Sec>
      {marriages.length===0?(
        <Card style={{textAlign:"center",padding:28}}><Building2 size={32} style={{color:"#3A3838",marginBottom:10}} /><div style={{fontFamily:"'EB Garamond',serif",color:"#5A5550",fontSize:14}}>Forge marriages to unlock buildings.</div></Card>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {marriages.map(mId=>{
            const fam=FAMILIES.find(f=>f.id===mId);if(!fam)return null;
            const lv=buildings[fam.id]||1;const maxLv=5;const canUp=lv<maxLv;
            const costs=canUp?fam.upgradeCosts[lv]:{};const cMult=settings.buildingCostMult;
            const ok=canUp&&canAfford(costs,cMult);
            const prod=fam.baseProduction*BLDG_MULT[lv-1];
            const nextProd=canUp?fam.baseProduction*BLDG_MULT[lv]:prod;
            const IC=fam.ResourceIcon;
            return(
              <Card key={mId} glow={fam.color} style={{border:`1px solid ${fam.color}20`}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
                  <div style={{width:38,height:38,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:`${fam.color}14`,border:`1px solid ${fam.color}25`}}><IC size={18} style={{color:fam.color}} /></div>
                  <div><div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#E8DFD0",fontWeight:600}}>{fam.buildingName}</div><div style={{fontSize:11,color:fam.color,fontFamily:"'EB Garamond',serif"}}>Lv {lv}/{maxLv}</div></div>
                </div>
                <Bar value={lv} max={maxLv} color={fam.color} h={5} />
                <div style={{marginTop:8,fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}><span style={{color:fam.color,fontWeight:600}}>{fmt(prod,1)}</span> {fam.resourceLabel}/week</div>
                {canUp&&<div style={{marginTop:10}}><div style={{fontSize:11,color:"#5A5550",marginBottom:5}}>Upgrade → Lv.{lv+1} ({fmt(nextProd,1)}/wk)</div><div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{Object.entries(costs).filter(([,v])=>v>0).map(([r,a])=><CostTag key={r} res={r} amt={Math.floor(a*cMult)} have={resources[r]} />)}</div><Btn onClick={()=>dispatch({type:"UPGRADE_BUILDING",familyId:fam.id})} disabled={!ok} color={fam.color} small>Upgrade</Btn></div>}
                {!canUp&&<div style={{marginTop:8,fontSize:12,color:fam.color,fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>✦ Max Level</div>}
              </Card>
            );
          })}
        </div>
      )}
      {FAMILIES.filter(f=>!marriages.includes(f.id)).length>0&&(
        <Card style={{opacity:0.45}}><div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#5A5550",letterSpacing:1,marginBottom:6}}>LOCKED</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{FAMILIES.filter(f=>!marriages.includes(f.id)).map(f=><div key={f.id} style={{display:"flex",alignItems:"center",gap:5,padding:"3px 8px",borderRadius:5,background:"rgba(255,255,255,0.02)"}}><Lock size={10} style={{color:"#3A3838"}} /><span style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif"}}>{f.buildingName}</span></div>)}</div></Card>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: REALM (NEW — WORLD MAP)
   ═══════════════════════════════════════════════════ */

function hexCenter(col, row) {
  const x = col * HEX_R * 1.5 + HEX_R + 4;
  const y = row * HEX_H + (col & 1 ? HEX_H / 2 : 0) + HEX_H / 2 + 4;
  return [x, y];
}

function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(" ");
}

const SVG_W = MAP_COLS * HEX_R * 1.5 + HEX_R + 8;
const SVG_H = MAP_ROWS * HEX_H + HEX_H / 2 + 8;

const RealmTab = ({state, dispatch}) => {
  const {worldTiles, selectedTile, resources} = state;
  const [hoveredTile, setHoveredTile] = useState(null);

  const playerTiles = useMemo(() => worldTiles.filter(t => t.owner === "player"), [worldTiles]);
  const playerTileCount = playerTiles.length;

  const adjacentClaimable = useMemo(() => {
    const claimable = new Set();
    playerTiles.forEach(pt => {
      getHexNeighbors(pt.col, pt.row).forEach(([c, r]) => {
        const t = worldTiles[tileKey(c, r)];
        if (t && !t.owner && BIOMES[t.biome].passable) claimable.add(tileKey(c, r));
      });
    });
    return claimable;
  }, [worldTiles, playerTiles]);

  const claimCost = getClaimCost(playerTileCount);
  const canAffordClaim = resources.credits >= claimCost.credits && resources.military >= claimCost.military;

  const sel = selectedTile !== null ? worldTiles[selectedTile] : null;
  const selBiome = sel ? BIOMES[sel.biome] : null;
  const isSelPlayer = sel?.owner === "player";
  const isSelClaimable = sel ? adjacentClaimable.has(tileKey(sel.col, sel.row)) : false;
  const selFaction = sel?.owner && sel.owner !== "player" ? AI_FACTIONS.find(f => f.id === sel.owner) : null;
  const selImprovement = sel?.improvement ? TILE_IMPROVEMENTS.find(i => i.id === sel.improvement) : null;
  const availableImprovements = sel && isSelPlayer && !sel.improvement
    ? TILE_IMPROVEMENTS.filter(imp => imp.biomes.includes(sel.biome))
    : [];

  const territoryYields = useMemo(() => {
    const totals = {};
    playerTiles.forEach(tile => {
      const biome = BIOMES[tile.biome];
      if (!biome?.yields) return;
      Object.entries(biome.yields).forEach(([res, amt]) => {
        let prod = amt * 0.4;
        if (tile.improvement) {
          const imp = TILE_IMPROVEMENTS.find(i => i.id === tile.improvement);
          if (imp && imp.resource === res) prod *= imp.mult;
        }
        totals[res] = (totals[res] || 0) + prod;
      });
    });
    return totals;
  }, [worldTiles, playerTiles]);

  const getOwnerColor = (owner) => {
    if (owner === "player") return "#C4956A";
    const f = AI_FACTIONS.find(x => x.id === owner);
    return f ? f.color : null;
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:"none"}}>
      <Sec icon={Map} color="#6B9E4A" extra={
        <div style={{display:"flex",gap:10,fontSize:11,fontFamily:"'EB Garamond',serif"}}>
          <span style={{color:"#C4956A"}}>⬡ {playerTileCount} tiles</span>
          <span style={{color:"#9B9088"}}>|</span>
          <span style={{color:"#5A5550"}}>{AI_FACTIONS.length} factions</span>
        </div>
      }>The Realm</Sec>

      {/* Territory resource yield bar */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:-6}}>
        <span style={{fontSize:11,color:"#5A5550",fontFamily:"'Cinzel',serif",letterSpacing:1,alignSelf:"center"}}>LAND YIELDS:</span>
        {Object.entries(territoryYields).filter(([,v]) => v > 0).map(([res, val]) => (
          <div key={res} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:4,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.04)"}}>
            <ResIcon res={res} size={11} />
            <span style={{fontSize:11,color:RES_META[res]?.color||"#E8DFD0",fontFamily:"'EB Garamond',serif"}}>+{fmt(val)}/wk</span>
          </div>
        ))}
        {Object.keys(territoryYields).length === 0 && <span style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>No production yet</span>}
      </div>

      {/* HEX MAP */}
      <div style={{background:"rgba(8,7,12,0.6)",border:"1px solid rgba(196,149,106,0.08)",borderRadius:12,padding:8,overflow:"auto",position:"relative"}}>
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{display:"block",maxHeight:480}}>
          <defs>
            <filter id="glow-gold"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="glow-sel"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          {/* Base hexes */}
          {worldTiles.map((tile, idx) => {
            const [cx, cy] = hexCenter(tile.col, tile.row);
            const biome = BIOMES[tile.biome];
            const ownerColor = getOwnerColor(tile.owner);
            const isHovered = hoveredTile === idx;
            const isSelected = selectedTile === idx;
            const isClaimable = adjacentClaimable.has(idx);
            const isPlayer = tile.owner === "player";

            let fillColor = biome.color;
            if (isPlayer) fillColor = biome.color;
            else if (tile.owner && tile.owner !== "player") {
              fillColor = biome.color;
            }

            const opacity = tile.owner ? 1 : (isClaimable ? 0.85 : 0.55);

            return (
              <g key={idx} onClick={() => dispatch({type:"SELECT_TILE",tileIdx:idx})}
                onMouseEnter={() => setHoveredTile(idx)} onMouseLeave={() => setHoveredTile(null)}
                style={{cursor: biome.passable ? "pointer" : "default"}}>
                {/* Base fill */}
                <polygon points={hexPoints(cx, cy, HEX_R - 1)}
                  fill={isHovered ? `${biome.color}` : fillColor}
                  opacity={isHovered ? 1 : opacity}
                  stroke={biome.stroke} strokeWidth={0.8} />
                {/* Owner tint overlay */}
                {tile.owner && (
                  <polygon points={hexPoints(cx, cy, HEX_R - 1)}
                    fill={ownerColor} opacity={isPlayer ? 0.18 : 0.12} />
                )}
                {/* Owner border */}
                {tile.owner && (
                  <polygon points={hexPoints(cx, cy, HEX_R - 2)}
                    fill="none" stroke={ownerColor}
                    strokeWidth={isPlayer ? 1.8 : 1.2} opacity={0.7} />
                )}
                {/* Claimable indicator */}
                {isClaimable && !tile.owner && (
                  <polygon points={hexPoints(cx, cy, HEX_R - 2)}
                    fill="none" stroke="#C4956A" strokeWidth={1}
                    strokeDasharray="3,3" opacity={0.5} />
                )}
                {/* Selected glow */}
                {isSelected && (
                  <polygon points={hexPoints(cx, cy, HEX_R - 1)}
                    fill="none" stroke="#E8C46E" strokeWidth={2.5}
                    filter="url(#glow-sel)" opacity={0.9} />
                )}
                {/* Improvement icon */}
                {tile.improvement && (
                  <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
                    fontSize={9} style={{pointerEvents:"none"}}>{TILE_IMPROVEMENTS.find(i=>i.id===tile.improvement)?.icon || "?"}</text>
                )}
                {/* Biome icon for unimproved */}
                {!tile.improvement && biome.passable && tile.owner === "player" && (
                  <circle cx={cx} cy={cy} r={2} fill="#C4956A" opacity={0.35} />
                )}
              </g>
            );
          })}
          {/* Faction labels */}
          {AI_FACTIONS.map(fac => {
            const facTiles = worldTiles.filter(t => t.owner === fac.id);
            if (!facTiles.length) return null;
            const avgCol = facTiles.reduce((s,t)=>s+t.col,0)/facTiles.length;
            const avgRow = facTiles.reduce((s,t)=>s+t.row,0)/facTiles.length;
            const [lx,ly] = hexCenter(Math.round(avgCol), Math.round(avgRow));
            return (
              <g key={fac.id}>
                <text x={lx} y={ly - HEX_R - 4} textAnchor="middle" fontSize={7}
                  fill={fac.color} fontFamily="'Cinzel',serif" fontWeight={600}
                  letterSpacing={1} opacity={0.75} style={{pointerEvents:"none"}}>
                  {fac.name.split(" ").slice(1).join(" ").toUpperCase()}
                </text>
              </g>
            );
          })}
          {/* Player label */}
          {(() => {
            if (!playerTiles.length) return null;
            const avgCol = playerTiles.reduce((s,t)=>s+t.col,0)/playerTiles.length;
            const avgRow = playerTiles.reduce((s,t)=>s+t.row,0)/playerTiles.length;
            const [lx,ly] = hexCenter(Math.round(avgCol), Math.round(avgRow));
            return (
              <text x={lx} y={ly - HEX_R - 4} textAnchor="middle" fontSize={8}
                fill="#C4956A" fontFamily="'Cinzel',serif" fontWeight={700}
                letterSpacing={2} filter="url(#glow-gold)" style={{pointerEvents:"none"}}>
                YOUR REALM
              </text>
            );
          })()}
        </svg>
      </div>

      {/* SELECTED TILE INFO / FACTION PANEL */}
      <div style={{display:"grid",gridTemplateColumns: sel ? "1fr 1fr" : "1fr",gap:14}}>
        {sel ? (
          <>
            <Card glow={isSelPlayer ? "#C4956A" : selFaction?.color}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:`${selBiome.color}80`,border:`1px solid ${selBiome.stroke}`,fontSize:16}}>
                  {selBiome.icon}
                </div>
                <div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#E8DFD0",fontWeight:600}}>{selBiome.name}</div>
                  <div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif"}}>Tile ({sel.col}, {sel.row})</div>
                </div>
                <button onClick={()=>dispatch({type:"SELECT_TILE",tileIdx:null})} style={{marginLeft:"auto",background:"none",border:"none",color:"#5A5550",cursor:"pointer",padding:4}}><X size={14} /></button>
              </div>

              {/* Owner info */}
              <div style={{padding:"6px 10px",borderRadius:6,background:"rgba(255,255,255,0.02)",marginBottom:8,fontSize:12,fontFamily:"'EB Garamond',serif"}}>
                <span style={{color:"#5A5550"}}>Owner: </span>
                {isSelPlayer && <span style={{color:"#C4956A",fontWeight:600}}>Your Realm</span>}
                {selFaction && <span style={{color:selFaction.color,fontWeight:600}}>{selFaction.name}</span>}
                {!sel.owner && !isSelClaimable && <span style={{color:"#5A5550"}}>Unclaimed</span>}
                {!sel.owner && isSelClaimable && <span style={{color:"#6B9E4A"}}>Claimable!</span>}
              </div>

              {/* Biome yields */}
              {selBiome.yields && Object.keys(selBiome.yields).length > 0 && (
                <div style={{marginBottom:8}}>
                  <div style={{fontSize:10,color:"#5A5550",letterSpacing:1,marginBottom:4}}>BASE YIELDS</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {Object.entries(selBiome.yields).map(([res,val])=>(
                      <div key={res} style={{display:"flex",alignItems:"center",gap:3,fontSize:11}}>
                        <ResIcon res={res} size={10} />
                        <span style={{color:RES_META[res]?.color||"#9B9088"}}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current improvement */}
              {selImprovement && (
                <div style={{padding:"8px 10px",borderRadius:6,background:"rgba(107,158,74,0.08)",border:"1px solid rgba(107,158,74,0.15)",marginBottom:8}}>
                  <div style={{fontSize:12,color:"#6B9E4A",fontFamily:"'Cinzel',serif",fontWeight:600}}>{selImprovement.icon} {selImprovement.name}</div>
                  <div style={{fontSize:11,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>{selImprovement.desc}</div>
                  <div style={{fontSize:11,color:"#6B9E4A",marginTop:3}}>×{selImprovement.mult} {RES_META[selImprovement.resource]?.label} production</div>
                </div>
              )}

              {/* Claim button */}
              {isSelClaimable && (
                <div style={{marginTop:4}}>
                  <div style={{fontSize:10,color:"#5A5550",letterSpacing:1,marginBottom:5}}>CLAIM TERRITORY</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                    <CostTag res="credits" amt={claimCost.credits} have={resources.credits} />
                    <CostTag res="military" amt={claimCost.military} have={resources.military} />
                  </div>
                  <Btn onClick={()=>dispatch({type:"CLAIM_TILE",col:sel.col,row:sel.row})} disabled={!canAffordClaim} color="#6B9E4A" small>
                    <Flag size={11} style={{marginRight:4}} />Claim Land
                  </Btn>
                </div>
              )}

              {/* Build improvements */}
              {isSelPlayer && !sel.improvement && availableImprovements.length > 0 && (
                <div style={{marginTop:4}}>
                  <div style={{fontSize:10,color:"#5A5550",letterSpacing:1,marginBottom:6}}>BUILD IMPROVEMENT</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {availableImprovements.map(imp => {
                      const canBuild = Object.entries(imp.cost).every(([r,a]) => resources[r] >= a);
                      return (
                        <div key={imp.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.04)"}}>
                          <span style={{fontSize:14}}>{imp.icon}</span>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,color:"#E8DFD0",fontFamily:"'Cinzel',serif"}}>{imp.name}</div>
                            <div style={{display:"flex",gap:3,marginTop:2}}>
                              {Object.entries(imp.cost).map(([r,a]) => <CostTag key={r} res={r} amt={a} have={resources[r]} />)}
                            </div>
                          </div>
                          <Btn onClick={()=>dispatch({type:"BUILD_IMPROVEMENT",col:sel.col,row:sel.row,impId:imp.id})} disabled={!canBuild} color="#6B9E4A" small>Build</Btn>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {isSelPlayer && sel.improvement && (
                <div style={{marginTop:4}}>
                  <Btn onClick={()=>dispatch({type:"DEMOLISH_IMPROVEMENT",col:sel.col,row:sel.row})} color="#A85858" small>Demolish</Btn>
                </div>
              )}
            </Card>

            {/* Faction info panel */}
            <Card>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:10}}>FACTIONS IN THE REALM</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {/* Player */}
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,background:"rgba(196,149,106,0.08)",border:"1px solid rgba(196,149,106,0.15)"}}>
                  <div style={{width:10,height:10,borderRadius:2,background:"#C4956A"}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:"#C4956A",fontFamily:"'Cinzel',serif",fontWeight:600}}>Your Realm</div>
                    <div style={{fontSize:10,color:"#9B9088"}}>{playerTileCount} tiles · {playerTiles.filter(t=>t.improvement).length} improved</div>
                  </div>
                </div>
                {AI_FACTIONS.map(fac => {
                  const ft = worldTiles.filter(t=>t.owner===fac.id).length;
                  const rel = fac.relation;
                  const relColor = rel==="friendly"?"#6B9E4A":rel==="hostile"?"#A85858":rel==="allied"?"#8B6EBC":"#9B9088";
                  return (
                    <div key={fac.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.04)"}}>
                      <div style={{width:10,height:10,borderRadius:2,background:fac.color}} />
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,color:fac.color,fontFamily:"'Cinzel',serif"}}>{fac.name}</div>
                        <div style={{fontSize:10,color:"#5A5550"}}>{ft} tiles · <span style={{color:relColor,textTransform:"capitalize"}}>{rel}</span></div>
                      </div>
                      <div style={{fontSize:10,color:"#5A5550"}}><Shield size={9} style={{color:"#5A5550"}} /> {fac.strength}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        ) : (
          /* Default: overview when no tile selected */
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:10}}>YOUR TERRITORY</div>
              <div style={{display:"flex",gap:14,marginBottom:10}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:24,color:"#C4956A",fontFamily:"'Cinzel',serif",fontWeight:700}}>{playerTileCount}</div><div style={{fontSize:10,color:"#5A5550"}}>TILES</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:24,color:"#6B9E4A",fontFamily:"'Cinzel',serif",fontWeight:700}}>{playerTiles.filter(t=>t.improvement).length}</div><div style={{fontSize:10,color:"#5A5550"}}>IMPROVED</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:24,color:"#E8C46E",fontFamily:"'Cinzel',serif",fontWeight:700}}>{adjacentClaimable.size}</div><div style={{fontSize:10,color:"#5A5550"}}>CLAIMABLE</div></div>
              </div>
              <div style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif",fontStyle:"italic"}}>Click any tile on the map to inspect, claim, or build.</div>
              <div style={{marginTop:10,fontSize:11,color:"#5A5550"}}>
                Claim cost: <CostTag res="credits" amt={claimCost.credits} have={resources.credits} /> <CostTag res="military" amt={claimCost.military} have={resources.military} />
              </div>
            </Card>
            <Card>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:10}}>FACTIONS</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {AI_FACTIONS.map(fac => {
                  const ft = worldTiles.filter(t=>t.owner===fac.id).length;
                  const rel = fac.relation;
                  const relColor = rel==="friendly"?"#6B9E4A":rel==="hostile"?"#A85858":"#9B9088";
                  return (
                    <div key={fac.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:5,background:"rgba(255,255,255,0.015)"}}>
                      <div style={{width:8,height:8,borderRadius:2,background:fac.color,flexShrink:0}} />
                      <span style={{fontSize:12,color:fac.color,fontFamily:"'Cinzel',serif",flex:1}}>{fac.name}</span>
                      <span style={{fontSize:10,color:relColor,textTransform:"capitalize"}}>{rel}</span>
                      <span style={{fontSize:10,color:"#5A5550"}}>{ft}⬡</span>
                    </div>
                  );
                })}
              </div>
              <div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif",fontStyle:"italic",marginTop:8}}>"{AI_FACTIONS.find(f=>f.relation==="friendly")?.motto}"</div>
            </Card>
          </div>
        )}
      </div>

      {/* BIOME LEGEND */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",padding:"6px 0"}}>
        <span style={{fontSize:10,color:"#5A5550",alignSelf:"center",marginRight:4}}>BIOMES:</span>
        {Object.entries(BIOMES).filter(([,b])=>b.passable).map(([id,b])=>(
          <div key={id} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 6px",borderRadius:3,background:"rgba(255,255,255,0.02)"}}>
            <div style={{width:8,height:8,borderRadius:2,background:b.color,border:`1px solid ${b.stroke}`}} />
            <span style={{fontSize:10,color:"#5A5550"}}>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: FAMILIES
   ═══════════════════════════════════════════════════ */

const FamiliesTab = ({state,dispatch}) => {
  const {marriages,resources,settings} = state;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={HeartHandshake}>Noble Families</Sec>
      <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",marginTop:-10,marginBottom:4}}>Marriages cost both <span style={{color:"#D4A574"}}>Kinship</span> and <span style={{color:"#E8C46E"}}>Credits</span>.</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {FAMILIES.map(fam=>{
          const married=marriages.includes(fam.id);
          const kCost=Math.floor(fam.kinshipCost*settings.marriageCostMult);
          const cCost=Math.floor(fam.creditCost*settings.marriageCostMult);
          const canDo=resources.kinship>=kCost&&resources.credits>=cCost;
          const IC=fam.ResourceIcon;
          return(
            <Card key={fam.id} glow={married?fam.color:undefined} style={{border:married?`1px solid ${fam.color}28`:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"}}>
              {married&&<div style={{position:"absolute",top:0,right:0,padding:"3px 14px 3px 20px",background:`linear-gradient(90deg,transparent,${fam.color}35)`,fontFamily:"'Cinzel',serif",fontSize:10,color:fam.color,letterSpacing:2}}>ALLIED</div>}
              <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:50,height:50,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:married?`${fam.color}18`:"rgba(255,255,255,0.025)",border:`2px solid ${married?fam.color+"45":"rgba(255,255,255,0.07)"}`,flexShrink:0}}><IC size={24} style={{color:married?fam.color:"#5A5550"}} /></div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:15,color:married?fam.color:"#E8DFD0",fontWeight:600}}>{fam.name}</div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:12,color:"#9B9088",fontStyle:"italic",marginBottom:6}}>{fam.subtitle}</div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",lineHeight:1.5,marginBottom:8}}>{fam.description}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                    <Badge color={fam.color}><IC size={10} /> {fam.resourceLabel}</Badge>
                    <Badge color="#9B9088"><Building2 size={10} /> {fam.buildingName}</Badge>
                    {fam.familyTraits.map(tn=>{const t=ALL_TRAITS.find(x=>x.name===tn);return t?<Badge key={tn} color="#5A5550">{t.icon} {tn}</Badge>:null;})}
                  </div>
                  <div style={{fontFamily:"'EB Garamond',serif",fontSize:12,color:fam.color,fontStyle:"italic",marginBottom:8}}>"{fam.motto}"</div>
                  {!married&&(
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <Btn onClick={()=>dispatch({type:"MARRY",familyId:fam.id})} disabled={!canDo} color={fam.color}>
                        <HeartHandshake size={13} style={{marginRight:5}} />Marry — {kCost} Kinship + {cCost} Credits
                      </Btn>
                      {!canDo&&<span style={{fontSize:11,color:"#B86060",fontFamily:"'EB Garamond',serif"}}>
                        {resources.kinship<kCost?`Need ${kCost-Math.floor(resources.kinship)} more kinship`:""}{resources.kinship<kCost&&resources.credits<cCost?" & ":""}{resources.credits<cCost?`Need ${cCost-Math.floor(resources.credits)} more credits`:""}
                      </span>}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: DECREES
   ═══════════════════════════════════════════════════ */

const DecreesTab = ({state,dispatch}) => {
  const {resources} = state;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={Scroll}>Royal Decrees</Sec>
      <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",marginTop:-10,marginBottom:4}}>Spend <span style={{color:"#E8C46E"}}>credits</span> and resources to issue decrees with immediate effects.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {DECREES.map(dec=>{
          const canDo = Object.entries(dec.cost).every(([k,v])=>resources[k]>=v);
          const IC = dec.icon;
          const rewardText = Object.entries(dec.reward).map(([k,v])=>{if(k==="prodBoost") return `+${Math.round(v*100)}% production next week`;return `+${v} ${RES_META[k]?.label||k}`;}).join(", ");
          return(
            <Card key={dec.id} hover style={{border:`1px solid ${canDo?dec.color+"20":"rgba(255,255,255,0.04)"}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:38,height:38,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:`${dec.color}14`,border:`1px solid ${dec.color}22`}}><IC size={18} style={{color:dec.color}} /></div>
                <div><div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:canDo?dec.color:"#7A7068",fontWeight:600}}>{dec.name}</div><div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif"}}>{dec.desc}</div></div>
              </div>
              <div style={{fontSize:12,color:"#6B9E4A",fontFamily:"'EB Garamond',serif",marginBottom:8}}>→ {rewardText}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>{Object.entries(dec.cost).map(([k,v])=><CostTag key={k} res={k} amt={v} have={resources[k]} />)}</div>
              <Btn onClick={()=>dispatch({type:"DECREE",id:dec.id})} disabled={!canDo} color={dec.color} small>Issue Decree</Btn>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: CHRONICLE
   ═══════════════════════════════════════════════════ */

const ChronicleTab = ({state}) => {
  const {chronicle,chief,events,generation,week} = state;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={ScrollText}>The Chronicle</Sec>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
        {[{l:"WEEKS",v:week,c:"#E8DFD0"},{l:"CHIEFS",v:chronicle.length+1,c:"#D4A574"},{l:"MARRIAGES",v:state.marriages.length,c:"#8B6EBC"},{l:"CREDITS",v:fmt(state.totalCreditsEarned),c:"#E8C46E"}].map(({l,v,c})=>(
          <Card key={l} style={{textAlign:"center",padding:10}}><div style={{fontSize:9,color:"#5A5550",letterSpacing:1}}>{l}</div><div style={{fontSize:20,color:c,fontFamily:"'Cinzel',serif",fontWeight:700}}>{v}</div></Card>
        ))}
      </div>
      <Card>
        <Sec icon={Crown}>Line of Succession</Sec>
        <div style={{position:"relative",paddingLeft:22}}>
          <div style={{position:"absolute",left:7,top:0,bottom:0,width:2,background:"linear-gradient(180deg,#C4956A,transparent)"}} />
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",position:"relative"}}><div style={{position:"absolute",left:-18,width:11,height:11,borderRadius:"50%",background:"#C4956A",border:"2px solid #0A090D"}} /><div><div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#D4A574",fontWeight:600}}>{chief.name} {chief.epithet}</div><div style={{fontSize:11,color:"#9B9088",fontFamily:"'EB Garamond',serif"}}>Current — Age {Math.floor(chief.age)} — Gen {generation}</div></div></div>
          {[...chronicle].reverse().map((e,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",position:"relative",opacity:0.6+0.4*(1/(i+2))}}><div style={{position:"absolute",left:-18,width:9,height:9,borderRadius:"50%",background:"#3A3838",border:"2px solid #0A090D"}} /><div><div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#9B9088"}}>{e.name} {e.epithet}</div><div style={{fontSize:11,color:"#5A5550",fontFamily:"'EB Garamond',serif"}}>Ruled {e.yearsRuled}yr — Died at {e.deathAge} — {e.marriages} marriages</div></div></div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:10}}>EVENT LOG</div>
        <div style={{maxHeight:260,overflowY:"auto",display:"flex",flexDirection:"column",gap:2}}>
          {[...events].reverse().slice(0,60).map((ev,i)=>(
            <div key={i} style={{display:"flex",gap:7,padding:"5px 6px",borderRadius:3,background:i%2===0?"rgba(255,255,255,0.012)":"transparent",opacity:Math.max(0.35,1-i*0.015)}}>
              <span style={{fontSize:10,color:ev.type==="death"?"#A83845":ev.type==="marriage"?"#D4A574":ev.type==="build"?"#6B9E4A":ev.type==="heir"?"#8B6EBC":ev.type==="decree"?"#E8C46E":ev.type==="territory"?"#6B9E4A":"#5A5550"}}>●</span>
              <span style={{fontSize:12,color:"#9B9088",fontFamily:"'EB Garamond',serif",lineHeight:1.4}}>{ev.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAB: SETTINGS
   ═══════════════════════════════════════════════════ */

const SettingsTab = ({state,dispatch}) => {
  const s = state.settings;
  const upd = (k,v) => dispatch({type:"UPDATE_SETTING",key:k,value:v});
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Sec icon={Settings}>Simulation Variables</Sec>
      <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",marginTop:-10,marginBottom:4}}>Tune every parameter. Changes apply immediately.</div>
      <Card>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:12}}>TIME & AGING</div>
        <Slider label="Weeks per Year of Age" value={s.weeksPerAge} min={12} max={104} step={4} onChange={v=>upd("weeksPerAge",v)} format={v=>v+" wks"} desc="How many game weeks = 1 year of chief aging." />
        <Slider label="Aging Rate" value={s.agingRate} min={0.25} max={3} step={0.25} onChange={v=>upd("agingRate",v)} format={v=>v+"×"} desc="Multiplier for chief aging speed." />
        <Slider label="Min Lifespan" value={s.lifespanMin} min={25} max={80} step={1} onChange={v=>upd("lifespanMin",Math.min(v,s.lifespanMax-5))} format={v=>v+" yr"} />
        <Slider label="Max Lifespan" value={s.lifespanMax} min={35} max={100} step={1} onChange={v=>upd("lifespanMax",Math.max(v,s.lifespanMin+5))} format={v=>v+" yr"} />
      </Card>
      <Card>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:12}}>ECONOMY</div>
        <Slider label="Kinship Rate" value={s.kinshipRate} min={0.25} max={5} step={0.25} onChange={v=>upd("kinshipRate",v)} format={v=>v+"×"} desc="Multiplier for kinship generation per week." />
        <Slider label="Resource Multiplier" value={s.resourceMult} min={0.25} max={5} step={0.25} onChange={v=>upd("resourceMult",v)} format={v=>v+"×"} desc="Global multiplier for all production." />
        <Slider label="Marriage Cost" value={s.marriageCostMult} min={0.25} max={3} step={0.25} onChange={v=>upd("marriageCostMult",v)} format={v=>v+"×"} />
        <Slider label="Building Cost" value={s.buildingCostMult} min={0.25} max={3} step={0.25} onChange={v=>upd("buildingCostMult",v)} format={v=>v+"×"} />
      </Card>
      <Card>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:12}}>BLOODLINE</div>
        <Slider label="Legacy Bonus / Gen" value={s.legacyBonus} min={0.01} max={0.2} step={0.01} onChange={v=>upd("legacyBonus",v)} format={v=>(v*100).toFixed(0)+"% per gen"} desc="Production bonus accumulated per generation." />
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{color:"#E8DFD0",fontFamily:"'EB Garamond',serif",fontSize:14}}>Heir Quality</span>
            <span style={{color:"#C4956A",fontFamily:"'EB Garamond',serif",fontSize:14,fontWeight:600,textTransform:"capitalize"}}>{s.heirQuality}</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {["low","normal","high","legendary"].map(q=>(
              <button key={q} onClick={()=>upd("heirQuality",q)} style={{flex:1,padding:"7px 4px",borderRadius:6,border:`1px solid ${s.heirQuality===q?"#C4956A":"rgba(255,255,255,0.06)"}`,background:s.heirQuality===q?"#C4956A15":"rgba(255,255,255,0.02)",color:s.heirQuality===q?"#D4A574":"#5A5550",fontSize:11,fontFamily:"'Cinzel',serif",cursor:"pointer",textTransform:"capitalize",letterSpacing:0.5,transition:"all 0.2s ease"}}>{q}</button>
            ))}
          </div>
        </div>
      </Card>
      <Card>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#C4956A",letterSpacing:1,marginBottom:12}}>WORLD</div>
        <Btn onClick={()=>dispatch({type:"REGENERATE_WORLD"})} color="#6B9E4A" small><Compass size={12} style={{marginRight:5}} />Regenerate World Map</Btn>
        <div style={{fontSize:11,color:"#5A5550",marginTop:5,fontFamily:"'EB Garamond',serif"}}>Generate a new procedural world. Territory ownership resets.</div>
      </Card>
      <Card><Btn onClick={()=>dispatch({type:"RESET"})} color="#A85858" small><RotateCcw size={12} style={{marginRight:5}} />Reset Bloodline</Btn><div style={{fontSize:11,color:"#5A5550",marginTop:5,fontFamily:"'EB Garamond',serif"}}>Restart from Generation I.</div></Card>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   OVERLAYS
   ═══════════════════════════════════════════════════ */

const DeathOverlay = ({data,onContinue}) => {
  const [ph, setPh] = useState(0);
  useEffect(()=>{const t1=setTimeout(()=>setPh(1),500);const t2=setTimeout(()=>setPh(2),1300);const t3=setTimeout(()=>setPh(3),2100);return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};},[]);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(6,5,8,0.97)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.6s ease"}}>
      <div style={{maxWidth:440,width:"100%",textAlign:"center",padding:36,animation:"slideUp 0.6s ease"}}>
        <div style={{opacity:ph>=0?1:0,transition:"opacity 0.5s ease"}}>
          <Skull size={36} style={{color:"#8B2635",marginBottom:14}} />
          <h2 style={{fontFamily:"'Cinzel Decorative',serif",fontSize:26,color:"#A83845",margin:0,letterSpacing:3}}>{data.oldChief.name}</h2>
          <div style={{fontFamily:"'EB Garamond',serif",fontSize:15,color:"#9B9088",fontStyle:"italic",marginTop:5}}>{data.oldChief.epithet} — died at age {data.oldChief.deathAge}</div>
        </div>
        {ph>=1&&<div style={{marginTop:24,padding:"14px 20px",background:"rgba(255,255,255,0.025)",borderRadius:10,border:"1px solid rgba(139,38,53,0.18)",animation:"fadeIn 0.5s ease"}}><div style={{fontSize:11,color:"#5A5550",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>LEGACY</div><div style={{display:"flex",justifyContent:"center",gap:20}}><div><div style={{fontSize:10,color:"#5A5550"}}>Ruled</div><div style={{fontSize:18,color:"#E8DFD0",fontWeight:700}}>{data.oldChief.yearsRuled}y</div></div><div><div style={{fontSize:10,color:"#5A5550"}}>Marriages</div><div style={{fontSize:18,color:"#D4A574",fontWeight:700}}>{data.oldChief.marriages}</div></div><div><div style={{fontSize:10,color:"#5A5550"}}>Gen</div><div style={{fontSize:18,color:"#8B6EBC",fontWeight:700}}>{data.oldChief.generation}</div></div></div></div>}
        {ph>=2&&<div style={{marginTop:22,animation:"fadeIn 0.5s ease"}}><div style={{width:40,height:1,background:"linear-gradient(90deg,transparent,#C4956A,transparent)",margin:"0 auto 16px"}} /><div style={{fontSize:11,color:"#5A5550",letterSpacing:2,fontFamily:"'Cinzel',serif",marginBottom:8}}>HEIR RISES</div><div style={{fontFamily:"'Cinzel',serif",fontSize:20,color:"#D4A574",fontWeight:700}}>{data.newChief.name} {data.newChief.epithet}</div><div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",marginTop:3}}>Age 16 — Generation {data.newChief.generation}</div><div style={{display:"flex",justifyContent:"center",gap:5,marginTop:8}}>{data.newChief.traits.map(tn=>{const t=ALL_TRAITS.find(x=>x.name===tn);return t?<Badge key={tn}>{t.icon} {t.name}</Badge>:null;})}</div></div>}
        {ph>=3&&<div style={{marginTop:24,animation:"fadeIn 0.5s ease"}}><Btn onClick={onContinue} color="#D4A574">Continue the Bloodline</Btn></div>}
      </div>
    </div>
  );
};

const MarriageOverlay = ({family,onDone}) => {
  useEffect(()=>{const t=setTimeout(onDone,2200);return()=>clearTimeout(t);},[onDone]);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(6,5,8,0.92)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.25s ease"}} onClick={onDone}>
      <div style={{textAlign:"center",animation:"goldPulse 2.2s ease forwards"}}>
        <HeartHandshake size={44} style={{color:family.color,marginBottom:14}} />
        <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:20,color:"#D4A574",letterSpacing:3,marginBottom:6}}>ALLIANCE FORGED</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:17,color:family.color}}>{family.name}</div>
        <div style={{fontFamily:"'EB Garamond',serif",fontSize:13,color:"#9B9088",fontStyle:"italic",marginTop:6}}>"{family.motto}"</div>
        <div style={{marginTop:14}}><Badge color={family.color}>{family.resourceLabel} Unlocked</Badge></div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN GAME
   ═══════════════════════════════════════════════════ */

export default function BloodlineGame() {
  const [state, setState] = useState(initState);
  const [tab, setTab] = useState("hearth");

  useEffect(()=>{
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700;900&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap";
    l.rel = "stylesheet"; document.head.appendChild(l);
  },[]);

  const rates = useMemo(()=>{
    const {chief,marriages,buildings,settings,generation,treasuryLevel,taxPolicy,prodBoost,worldTiles} = state;
    const traitObjs = chief.traits.map(tn=>ALL_TRAITS.find(t=>t.name===tn)).filter(Boolean);
    const legacyMult = 1+Math.max(0,generation-1)*settings.legacyBonus;
    const allBonus = traitObjs.reduce((a,t)=>t.effect==="all"?a+t.bonus:a,0);
    const creditTraitBonus = traitObjs.reduce((a,t)=>t.effect==="credits"?a+t.bonus:a,0);
    const kinTraitBonus = traitObjs.reduce((a,t)=>t.effect==="kinship"?a+t.bonus:a,0);
    const taxP = TAX_PRESETS.find(t=>t.id===taxPolicy)||TAX_PRESETS[1];
    const tIncome = TREASURY_LEVELS[treasuryLevel].creditIncome;
    let cr = 3 + tIncome + (taxP.creditMult * marriages.length * 2);
    cr *= (1+creditTraitBonus) * settings.resourceMult;

    // Settlement bonus
    const settlements = worldTiles.filter(t=>t.owner==="player"&&t.improvement==="settlement").length;
    cr += settlements * 1.5;

    let kin = (0.8 + marriages.length*0.4)*settings.kinshipRate*taxP.kinshipMult*(1+kinTraitBonus);
    const r = {credits:Math.round(cr*100)/100, kinship:Math.round(kin*100)/100, food:0,wood:0,stone:0,gold:0,knowledge:0,military:0};
    marriages.forEach(mId=>{
      const fam=FAMILIES.find(f=>f.id===mId);if(!fam)return;
      const lv=buildings[fam.id]||1;
      let p=fam.baseProduction*BLDG_MULT[lv-1]*settings.resourceMult*legacyMult;
      const tb=traitObjs.reduce((a,t)=>t.effect===fam.resource?a+t.bonus:a,0);
      p*=(1+tb+allBonus);if(prodBoost>0)p*=(1+prodBoost);
      r[fam.resource]+=Math.round(p*100)/100;
    });

    // Territory production
    const playerTiles = worldTiles.filter(t=>t.owner==="player");
    playerTiles.forEach(tile=>{
      const biome = BIOMES[tile.biome];
      if(!biome?.yields) return;
      Object.entries(biome.yields).forEach(([res,amt])=>{
        let prod = amt * 0.4 * settings.resourceMult;
        if(tile.improvement){
          const imp = TILE_IMPROVEMENTS.find(i=>i.id===tile.improvement);
          if(imp && imp.resource===res) prod *= imp.mult;
        }
        prod *= legacyMult;
        if(r[res]!==undefined) r[res] += Math.round(prod*100)/100;
      });
    });

    return r;
  },[state]);

  const onAdvance = useCallback((n)=>{
    setState(prev=>{if(prev.deathScreen)return prev;return advanceWeeks(prev,n);});
  },[]);

  const dispatch = useCallback((action)=>{
    setState(prev=>{
      switch(action.type){
        case "MARRY":{const f=FAMILIES.find(x=>x.id===action.familyId);if(!f||prev.marriages.includes(f.id))return prev;const kC=Math.floor(f.kinshipCost*prev.settings.marriageCostMult);const cC=Math.floor(f.creditCost*prev.settings.marriageCostMult);if(prev.resources.kinship<kC||prev.resources.credits<cC)return prev;return{...prev,marriages:[...prev.marriages,f.id],buildings:{...prev.buildings,[f.id]:1},resources:{...prev.resources,kinship:prev.resources.kinship-kC,credits:prev.resources.credits-cC},marriageAnim:f,events:[...prev.events,{text:`Week ${prev.week} — Alliance forged with ${f.name}. ${f.resourceLabel} unlocked.`,type:"marriage",week:prev.week}]};}
        case "UPGRADE_BUILDING":{const f=FAMILIES.find(x=>x.id===action.familyId);if(!f)return prev;const lv=prev.buildings[f.id]||1;if(lv>=5)return prev;const costs=f.upgradeCosts[lv];const m=prev.settings.buildingCostMult;if(!Object.entries(costs).every(([r,a])=>prev.resources[r]>=a*m))return prev;const nr={...prev.resources};Object.entries(costs).forEach(([r,a])=>{nr[r]-=a*m;});return{...prev,buildings:{...prev.buildings,[f.id]:lv+1},resources:nr,events:[...prev.events,{text:`Week ${prev.week} — ${f.buildingName} upgraded to Level ${lv+1}.`,type:"build",week:prev.week}]};}
        case "UPGRADE_TREASURY":{const nlv=prev.treasuryLevel+1;if(nlv>=TREASURY_LEVELS.length)return prev;const c=TREASURY_LEVELS[nlv].cost;const m=prev.settings.buildingCostMult;if(!Object.entries(c).every(([r,a])=>prev.resources[r]>=a*m))return prev;const nr={...prev.resources};Object.entries(c).forEach(([r,a])=>{nr[r]-=a*m;});return{...prev,treasuryLevel:nlv,resources:nr,events:[...prev.events,{text:`Week ${prev.week} — Treasury upgraded to ${TREASURY_LEVELS[nlv].name}.`,type:"build",week:prev.week}]};}
        case "SET_TAX":return{...prev,taxPolicy:action.policy,events:[...prev.events,{text:`Week ${prev.week} — Tax policy changed to ${TAX_PRESETS.find(t=>t.id===action.policy)?.label||action.policy}.`,type:"decree",week:prev.week}]};
        case "DECREE":{const dec=DECREES.find(d=>d.id===action.id);if(!dec)return prev;if(!Object.entries(dec.cost).every(([k,v])=>prev.resources[k]>=v))return prev;const nr={...prev.resources};Object.entries(dec.cost).forEach(([k,v])=>{nr[k]-=v;});let pb=prev.prodBoost;Object.entries(dec.reward).forEach(([k,v])=>{if(k==="prodBoost"){pb+=v;}else if(nr[k]!==undefined){nr[k]+=v;}});return{...prev,resources:nr,prodBoost:pb,events:[...prev.events,{text:`Week ${prev.week} — Decree issued: ${dec.name}.`,type:"decree",week:prev.week}]};}
        case "CONTINUE_BLOODLINE":{if(!prev.deathScreen)return prev;const nc=prev.deathScreen.newChief;return{...prev,chief:nc,generation:prev.generation+1,deathScreen:null,events:[...prev.events,{text:`Week ${prev.week} — ${nc.name} ${nc.epithet} ascends as Chief of Generation ${prev.generation+1}.`,type:"heir",week:prev.week}]};}
        case "DISMISS_MARRIAGE":return{...prev,marriageAnim:null};
        case "DISMISS_REPORT":return{...prev,weekReport:null};
        case "UPDATE_SETTING":return{...prev,settings:{...prev.settings,[action.key]:action.value}};

        // WORLD ACTIONS
        case "SELECT_TILE":return{...prev,selectedTile:action.tileIdx};
        case "CLAIM_TILE":{
          const idx = tileKey(action.col, action.row);
          const tile = prev.worldTiles[idx];
          if(!tile || tile.owner || !BIOMES[tile.biome].passable) return prev;
          const ptCount = prev.worldTiles.filter(t=>t.owner==="player").length;
          const cost = getClaimCost(ptCount);
          if(prev.resources.credits < cost.credits || prev.resources.military < cost.military) return prev;
          // Check adjacency
          const nbrs = getHexNeighbors(action.col, action.row);
          const adjPlayer = nbrs.some(([c,r])=>{ const t=prev.worldTiles[tileKey(c,r)]; return t&&t.owner==="player"; });
          if(!adjPlayer) return prev;
          const newTiles = prev.worldTiles.map((t,i)=>i===idx?{...t,owner:"player"}:t);
          const nr = {...prev.resources, credits:prev.resources.credits-cost.credits, military:prev.resources.military-cost.military};
          return{...prev,worldTiles:newTiles,resources:nr,selectedTile:idx,events:[...prev.events,{text:`Week ${prev.week} — New territory claimed: ${BIOMES[tile.biome].name} at (${action.col},${action.row}).`,type:"territory",week:prev.week}]};
        }
        case "BUILD_IMPROVEMENT":{
          const idx = tileKey(action.col, action.row);
          const tile = prev.worldTiles[idx];
          if(!tile || tile.owner!=="player" || tile.improvement) return prev;
          const imp = TILE_IMPROVEMENTS.find(i=>i.id===action.impId);
          if(!imp || !imp.biomes.includes(tile.biome)) return prev;
          if(!Object.entries(imp.cost).every(([r,a])=>prev.resources[r]>=a)) return prev;
          const nr = {...prev.resources};
          Object.entries(imp.cost).forEach(([r,a])=>{nr[r]-=a;});
          const newTiles = prev.worldTiles.map((t,i)=>i===idx?{...t,improvement:imp.id}:t);
          return{...prev,worldTiles:newTiles,resources:nr,events:[...prev.events,{text:`Week ${prev.week} — ${imp.name} built on ${BIOMES[tile.biome].name} at (${action.col},${action.row}).`,type:"build",week:prev.week}]};
        }
        case "DEMOLISH_IMPROVEMENT":{
          const idx = tileKey(action.col, action.row);
          const tile = prev.worldTiles[idx];
          if(!tile || tile.owner!=="player" || !tile.improvement) return prev;
          const impName = TILE_IMPROVEMENTS.find(i=>i.id===tile.improvement)?.name || "Improvement";
          const newTiles = prev.worldTiles.map((t,i)=>i===idx?{...t,improvement:null}:t);
          return{...prev,worldTiles:newTiles,events:[...prev.events,{text:`Week ${prev.week} — ${impName} demolished at (${action.col},${action.row}).`,type:"build",week:prev.week}]};
        }
        case "REGENERATE_WORLD":{
          const newSeed = Math.floor(Math.random()*999999);
          return{...prev,worldSeed:newSeed,worldTiles:generateWorld(newSeed),selectedTile:null,events:[...prev.events,{text:`Week ${prev.week} — The world has been reshaped by the gods.`,type:"story",week:prev.week}]};
        }

        case "RESET":return initState();
        default:return prev;
      }
    });
  },[]);

  const tabContent = {
    hearth:<HearthTab state={state} rates={rates} onNav={setTab} />,
    chief:<ChiefTab state={state} />,
    treasury:<TreasuryTab state={state} dispatch={dispatch} rates={rates} />,
    village:<VillageTab state={state} dispatch={dispatch} />,
    realm:<RealmTab state={state} dispatch={dispatch} />,
    families:<FamiliesTab state={state} dispatch={dispatch} />,
    decrees:<DecreesTab state={state} dispatch={dispatch} />,
    chronicle:<ChronicleTab state={state} />,
    settings:<SettingsTab state={state} dispatch={dispatch} />,
  };

  const agePct = ((state.chief.age-16)/(state.chief.maxAge-16))*100;

  return(
    <>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes goldPulse{0%{opacity:0;transform:scale(.8)}20%{opacity:1;transform:scale(1.04)}80%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.96)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(196,149,106,0.18);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:rgba(196,149,106,0.30)}
        input[type="range"]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
        input[type="range"]::-webkit-slider-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.07)}
        input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;background:#C4956A;border:2px solid #0A090D;margin-top:-5.5px;box-shadow:0 0 6px rgba(196,149,106,0.25)}
        input[type="range"]::-moz-range-track{height:4px;border-radius:2px;background:rgba(255,255,255,0.07);border:none}
        input[type="range"]::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:#C4956A;border:2px solid #0A090D;box-shadow:0 0 6px rgba(196,149,106,0.25)}
      `}</style>

      <div style={{display:"flex",height:"100vh",width:"100vw",overflow:"hidden",background:"#09080C",color:"#E8DFD0",fontFamily:"'EB Garamond',serif"}}>
        {/* SIDEBAR */}
        <div style={{width:210,minWidth:210,height:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#0E0C13,#0C0A10)",borderRight:"1px solid rgba(196,149,106,0.08)"}}>
          <div style={{padding:"22px 14px 18px",textAlign:"center",borderBottom:"1px solid rgba(196,149,106,0.08)"}}>
            <div style={{fontFamily:"'Cinzel Decorative',serif",fontSize:19,fontWeight:900,background:"linear-gradient(135deg,#C4956A,#E8C99B,#C4956A)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:4,lineHeight:1.2}}>BLOODLINE</div>
            <div style={{fontSize:9,color:"#5A5550",letterSpacing:3,marginTop:3,fontFamily:"'Cinzel',serif"}}>THE KINSHIP CHRONICLE</div>
          </div>
          <nav style={{flex:1,padding:"10px 6px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
            {TABS.map(({id,label,Icon})=>{const active=tab===id;return(
              <button key={id} onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:7,border:"none",cursor:"pointer",width:"100%",background:active?"rgba(196,149,106,0.08)":"transparent",borderLeft:active?"3px solid #C4956A":"3px solid transparent",color:active?"#D4A574":"#6B6560",fontFamily:"'Cinzel',serif",fontSize:12,fontWeight:active?600:400,letterSpacing:.5,transition:"all 0.15s ease",textAlign:"left"}}
                onMouseEnter={e=>{if(!active)e.target.style.background="rgba(255,255,255,0.025)";}} onMouseLeave={e=>{if(!active)e.target.style.background="transparent";}}>
                <Icon size={15} />{label}
              </button>
            );})}
          </nav>
          <div style={{padding:14,borderTop:"1px solid rgba(196,149,106,0.08)",fontSize:11,color:"#5A5550"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Generation</span><span style={{color:"#D4A574",fontWeight:600}}>{state.generation}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Week</span><span style={{color:"#E8DFD0"}}>{state.week}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Credits</span><span style={{color:"#E8C46E",fontWeight:600}}>{fmt(state.resources.credits)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Kinship</span><span style={{color:"#D4A574"}}>{fmt(state.resources.kinship)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span>Territory</span><span style={{color:"#6B9E4A"}}>{state.worldTiles.filter(t=>t.owner==="player").length}⬡</span></div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>
          {/* Resource bar */}
          <div style={{display:"flex",alignItems:"center",gap:3,padding:"8px 18px",borderBottom:"1px solid rgba(196,149,106,0.06)",background:"rgba(14,12,19,0.5)",flexWrap:"wrap"}}>
            {Object.entries(RES_META).map(([k,m])=>{
              const unlocked = k==="credits"||k==="kinship"||state.marriages.some(mId=>FAMILIES.find(f=>f.id===mId)?.resource===k)||(rates[k]>0);
              const IC=m.icon;
              return(
                <div key={k} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:5,background:unlocked?"rgba(255,255,255,0.02)":"transparent",opacity:unlocked?1:0.2,transition:"opacity 0.2s",minWidth:k==="credits"?100:75}}>
                  <IC size={13} style={{color:m.color,flexShrink:0}} />
                  <div style={{lineHeight:1.1}}>
                    <span style={{fontSize:12,color:"#E8DFD0",fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{unlocked?fmt(state.resources[k]):"—"}</span>
                    {unlocked&&rates[k]>0&&<span style={{fontSize:9,color:m.color,marginLeft:4}}>+{fmt(rates[k])}/w</span>}
                  </div>
                </div>
              );
            })}
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#C4956A1C,#8B263510)",border:`1.5px solid ${agePct>80?"#8B2635":"#C4956A35"}`,fontFamily:"'Cinzel',serif",fontSize:12,color:"#D4A574",fontWeight:700}}>{state.chief.name[0]}</div>
              <div style={{lineHeight:1.1}}><div style={{fontSize:11,color:"#E8DFD0",fontFamily:"'Cinzel',serif"}}>{state.chief.name}</div><div style={{fontSize:9,color:agePct>80?"#A83845":"#5A5550"}}>Age {Math.floor(state.chief.age)}</div></div>
            </div>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:"auto",padding:"22px 24px",background:"linear-gradient(180deg,#09080C,#0C0A10)"}}>
            <div key={tab} style={{animation:"fadeIn 0.2s ease",maxWidth:tab==="realm"?900:760}}>{tabContent[tab]}</div>
          </div>

          {/* Advance bar */}
          <AdvanceBar state={state} onAdvance={onAdvance} />
        </div>
      </div>

      {state.deathScreen && <DeathOverlay data={state.deathScreen} onContinue={()=>dispatch({type:"CONTINUE_BLOODLINE"})} />}
      {state.marriageAnim && <MarriageOverlay family={state.marriageAnim} onDone={()=>dispatch({type:"DISMISS_MARRIAGE"})} />}
      {state.weekReport && <WeekReport report={state.weekReport} onDismiss={()=>dispatch({type:"DISMISS_REPORT"})} />}
    </>
  );
}
