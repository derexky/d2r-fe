import { useState } from 'react';

interface Weapon {
  en: string;
  zh: string;
  wsm: number;
}

const WEAPONS: Weapon[] = [
  { en: 'Chu-Ko-Nu', zh: '巧工弩', wsm: -60 },
  { en: 'Demon Crossbow', zh: '惡魔十字弓', wsm: -60 },
  { en: 'Repeating Crossbow', zh: '連射十字弓', wsm: -40 },
  { en: 'Cutlass', zh: '微彎劍', wsm: -30 },
  { en: 'Greater Talons', zh: '巨鷹爪', wsm: -30 },
  { en: 'Phase Blade', zh: '幻化之刃', wsm: -30 },
  { en: 'Runic Talons', zh: '符文鷹爪', wsm: -30 },
  { en: 'Ataghan', zh: '土耳其劍', wsm: -20 },
  { en: 'Balanced Knife', zh: '平衡刀', wsm: -20 },
  { en: 'Blade Talons', zh: '刀刃鷹爪', wsm: -20 },
  { en: 'Bone Knife', zh: '骸骨小刀', wsm: -20 },
  { en: 'Bone Wand', zh: '骨杖', wsm: -20 },
  { en: 'Brandistock', zh: '叉', wsm: -20 },
  { en: 'Cinquedeas', zh: '強波刀', wsm: -20 },
  { en: 'Dagger', zh: '匕首', wsm: -20 },
  { en: 'Fanged Knife', zh: '齒緣小刀', wsm: -20 },
  { en: 'Feral Claws', zh: '猛禽爪', wsm: -20 },
  { en: 'Greater Claws', zh: '強化爪', wsm: -20 },
  { en: 'Kris', zh: '波形刀', wsm: -20 },
  { en: 'Lich Wand', zh: '巫妖法杖', wsm: -20 },
  { en: 'Mancatcher', zh: '刺人槍', wsm: -20 },
  { en: 'Poignard', zh: '銳匕', wsm: -20 },
  { en: 'Scimitar', zh: '彎刀', wsm: -20 },
  { en: 'Tomb Wand', zh: '古墓之杖', wsm: -20 },
  { en: 'War Dart', zh: '戰鬥飛鏢', wsm: -20 },
  { en: 'War Fork', zh: '巨戰之叉', wsm: -20 },
  { en: 'Winged Knife', zh: '翼刀', wsm: -20 },
  { en: 'Feral Axe', zh: '猛禽斧', wsm: -15 },
  { en: 'Legend Sword', zh: '傳說之劍', wsm: -15 },
  { en: 'Arbalest', zh: '石弓', wsm: -10 },
  { en: 'Balanced Axe', zh: '平衡斧', wsm: -10 },
  { en: 'Battle Cestus', zh: '鬥腰刀', wsm: -10 },
  { en: 'Battle Scythe', zh: '戰鬥鐮刀', wsm: -10 },
  { en: 'Blade', zh: '短刀', wsm: -10 },
  { en: 'Blade Bow', zh: '刀刃弓', wsm: -10 },
  { en: 'Caduceus', zh: '神使之杖', wsm: -10 },
  { en: 'Ceremonial Javelin', zh: '祭典之標槍', wsm: -10 },
  { en: 'Champion Axe', zh: '豪傑斧', wsm: -10 },
  { en: 'Champion Sword', zh: '冠軍之劍', wsm: -10 },
  { en: 'Claws', zh: '爪', wsm: -10 },
  { en: 'Club', zh: '木棒', wsm: -10 },
  { en: 'Composite Bow', zh: '組合弓', wsm: -10 },
  { en: 'Crowbill', zh: '喙鉗', wsm: -10 },
  { en: 'Cryptic Sword', zh: '神秘之劍', wsm: -10 },
  { en: 'Crystalline Globe', zh: '水晶球', wsm: -10 },
  { en: 'Cudgel', zh: '棍棒', wsm: -10 },
  { en: 'Divine Scepter', zh: '神屬權杖', wsm: -10 },
  { en: 'Double Bow', zh: '雙弓', wsm: -10 },
  { en: 'Eagle Orb', zh: '鷹之球', wsm: -10 },
  { en: 'Eldritch Orb', zh: '怪異之球', wsm: -10 },
  { en: 'Elegant Blade', zh: '優雅之劍', wsm: -10 },
  { en: 'Flail', zh: '連枷', wsm: -10 },
  { en: 'Flamberge', zh: '雙手飾劍', wsm: -10 },
  { en: 'Giant Thresher', zh: '鮫尾巨斧', wsm: -10 },
  { en: 'Glowing Orb', zh: '發光球', wsm: -10 },
  { en: 'Gothic Axe', zh: '哥德之斧', wsm: -10 },
  { en: 'Great Axe', zh: '卓越之斧', wsm: -10 },
  { en: 'Great Bow', zh: '大弓', wsm: -10 },
  { en: 'Grim Scythe', zh: '殘酷鐮刀', wsm: -10 },
  { en: 'Hand Scythe', zh: '手持鐮刀', wsm: -10 },
  { en: 'Harpoon', zh: '魚叉', wsm: -10 },
  { en: 'Heavenly Stone', zh: '天石', wsm: -10 },
  { en: "Hunter's Bow", zh: '獵弓', wsm: -10 },
  { en: 'Hurlbat', zh: '投擲短棒', wsm: -10 },
  { en: 'Hyperion Javelin', zh: '亥伯龍標槍', wsm: -10 },
  { en: 'Hyperion Spear', zh: '亥伯龍之矛', wsm: -10 },
  { en: 'Javelin', zh: '標槍', wsm: -10 },
  { en: 'Jo Staff', zh: '喬木棒', wsm: -10 },
  { en: 'Katar', zh: '卡塔爾', wsm: -10 },
  { en: 'Knout', zh: '鐵皮鞭', wsm: -10 },
  { en: 'Large Axe', zh: '巨斧', wsm: -10 },
  { en: 'Legend Spike', zh: '傳說尖刺', wsm: -10 },
  { en: 'Light Crossbow', zh: '輕十字弓', wsm: -10 },
  { en: 'Long Sword', zh: '長劍', wsm: -10 },
  { en: 'Maiden Javelin', zh: '少女標槍', wsm: -10 },
  { en: 'Matriarchal Bow', zh: '女族長之弓', wsm: -10 },
  { en: 'Matriarchal Javelin', zh: '女族長之標槍', wsm: -10 },
  { en: 'Military Axe', zh: '軍斧', wsm: -10 },
  { en: 'Military Pick', zh: '軍用鍬', wsm: -10 },
  { en: 'Pellet Bow', zh: '彈弓', wsm: -10 },
  { en: 'Razor Bow', zh: '剃刀之弓', wsm: -10 },
  { en: 'Rune Sword', zh: '符文劍', wsm: -10 },
  { en: 'Sabre', zh: '軍刀', wsm: -10 },
  { en: 'Sacred Globe', zh: '神聖球', wsm: -10 },
  { en: 'Scissors Katar', zh: '剪刀卡塔爾', wsm: -10 },
  { en: 'Scourge', zh: '天罰之錘', wsm: -10 },
  { en: 'Scythe', zh: '鐮刀', wsm: -10 },
  { en: 'Shamshir', zh: '虛偽之刃', wsm: -10 },
  { en: 'Short Staff', zh: '短棍', wsm: -10 },
  { en: 'Spear', zh: '長矛', wsm: -10 },
  { en: 'Stiletto', zh: '小劍', wsm: -10 },
  { en: 'Thresher', zh: '銳利之斧', wsm: -10 },
  { en: 'Throwing Spear', zh: '投擲長矛', wsm: -10 },
  { en: 'Truncheon', zh: '戰儀杖', wsm: -10 },
  { en: 'Walking Stick', zh: '手杖', wsm: -10 },
  { en: 'War Javelin', zh: '戰鬥標槍', wsm: -10 },
  { en: 'War Scepter', zh: '巨戰權杖', wsm: -10 },
  { en: 'War Scythe', zh: '巨戰鐮刀', wsm: -10 },
  { en: 'War Spear', zh: '巨戰長矛', wsm: -10 },
  { en: 'War Spike', zh: '戰刺', wsm: -10 },
  { en: 'Winged Axe', zh: '翼斧', wsm: -10 },
  { en: 'Winged Harpoon', zh: '翼魚叉', wsm: -10 },
  { en: 'Wrist Spike', zh: '腕刺', wsm: -10 },
  { en: 'Wrist Sword', zh: '腕劍', wsm: -10 },
  { en: 'Zweihander', zh: '韓瑞德之劍', wsm: -10 },
  { en: 'Highland Blade', zh: '高地之劍', wsm: -5 },
  { en: 'Ancient Sword', zh: '古代之劍', wsm: 0 },
  { en: 'Ashwood Bow', zh: '梣木弓', wsm: 0 },
  { en: 'Balrog Blade', zh: '炎魔之刃', wsm: 0 },
  { en: 'Barbed Club', zh: '倒鉤錘', wsm: 0 },
  { en: 'Battle Dart', zh: '戰鬥飛鏢', wsm: 0 },
  { en: 'Battle Staff', zh: '戰鬥法杖', wsm: 0 },
  { en: 'Battle Sword', zh: '戰鬥劍', wsm: 0 },
  { en: 'Bearded Axe', zh: '鉤斧', wsm: 0 },
  { en: 'Bec-de-Corbin', zh: '雙鋒戰戟', wsm: 0 },
  { en: 'Berserker Axe', zh: '狂戰士斧', wsm: 0 },
  { en: 'Bill', zh: '比爾長刀', wsm: 0 },
  { en: 'Broad Axe', zh: '闊斧', wsm: 0 },
  { en: 'Broad Sword', zh: '闊劍', wsm: 0 },
  { en: 'Burnt Wand', zh: '燒焦之杖', wsm: 0 },
  { en: 'Cedar Bow', zh: '杉木弓', wsm: 0 },
  { en: 'Ceremonial Spear', zh: '祭典之矛', wsm: 0 },
  { en: 'Cestus', zh: '銅手套', wsm: 0 },
  { en: 'Clasped Orb', zh: '握持球', wsm: 0 },
  { en: 'Cloudy Sphere', zh: '雲霧球', wsm: 0 },
  { en: 'Conquest Sword', zh: '征服之劍', wsm: 0 },
  { en: 'Crossbow', zh: '十字弓', wsm: 0 },
  { en: 'Crystal Sword', zh: '水晶劍', wsm: 0 },
  { en: 'Demon Heart', zh: '惡魔之心', wsm: 0 },
  { en: 'Diamond Bow', zh: '鑽石弓', wsm: 0 },
  { en: 'Dimensional Blade', zh: '空間之刃', wsm: 0 },
  { en: 'Dirk', zh: '長匕首', wsm: 0 },
  { en: 'Elder Staff', zh: '長老之杖', wsm: 0 },
  { en: 'Espandon', zh: '斬鐵劍', wsm: 0 },
  { en: 'Falcata', zh: '西班牙劍', wsm: 0 },
  { en: 'Flanged Mace', zh: '凸緣釘頭錘', wsm: 0 },
  { en: 'Flying Knife', zh: '飛刀', wsm: 0 },
  { en: 'Fuscina', zh: '魔鬼之叉', wsm: 0 },
  { en: 'Ghost Spear', zh: '幽靈矛', wsm: 0 },
  { en: 'Giant Sword', zh: '巨型劍', wsm: 0 },
  { en: 'Gladius', zh: '羅馬短劍', wsm: 0 },
  { en: 'Gorgon Crossbow', zh: '戈爾貢弩', wsm: 0 },
  { en: 'Gothic Staff', zh: '哥德之棍', wsm: 0 },
  { en: 'Grave Wand', zh: '墓地之杖', wsm: 0 },
  { en: 'Great Pilum', zh: '大投矛', wsm: 0 },
  { en: 'Great Poleaxe', zh: '大長柄斧', wsm: 0 },
  { en: 'Grim Wand', zh: '殘酷之杖', wsm: 0 },
  { en: 'Halberd', zh: '長戟', wsm: 0 },
  { en: 'Hand Axe', zh: '手斧', wsm: 0 },
  { en: 'Hatchet', zh: '小斧', wsm: 0 },
  { en: 'Long Bow', zh: '長弓', wsm: 0 },
  { en: 'Long Staff', zh: '長棍', wsm: 0 },
  { en: 'Mace', zh: '釘頭錘', wsm: 0 },
  { en: 'Maiden Spear', zh: '少女之矛', wsm: 0 },
  { en: 'Matriarchal Spear', zh: '女族長之矛', wsm: 0 },
  { en: 'Mighty Scepter', zh: '強威權杖', wsm: 0 },
  { en: 'Mithril Point', zh: '秘銀刺', wsm: 0 },
  { en: 'Mythical Sword', zh: '神話之劍', wsm: 0 },
  { en: 'Naga', zh: '納卡', wsm: 0 },
  { en: 'Ogre Axe', zh: '食人魔之斧', wsm: 0 },
  { en: 'Pilum', zh: '投矛', wsm: 0 },
  { en: 'Polished Wand', zh: '磨光法杖', wsm: 0 },
  { en: 'Quarterstaff', zh: '六呎棍', wsm: 0 },
  { en: 'Quhab', zh: '庫哈布爪', wsm: 0 },
  { en: 'Reinforced Mace', zh: '強化釘頭錘', wsm: 0 },
  { en: 'Rondel', zh: '詩歌匕首', wsm: 0 },
  { en: 'Rune Bow', zh: '符文之弓', wsm: 0 },
  { en: 'Rune Scepter', zh: '符文權杖', wsm: 0 },
  { en: 'Scepter', zh: '權杖', wsm: 0 },
  { en: 'Scissors Quhab', zh: '剪刀庫哈布', wsm: 0 },
  { en: 'Scissors Suwayyah', zh: '剪刀蘇瓦亞爪', wsm: 0 },
  { en: 'Shadow Bow', zh: '暗影弓', wsm: 0 },
  { en: 'Shillelagh', zh: '愛爾蘭棍', wsm: 0 },
  { en: 'Short Battle Bow', zh: '短戰鬥弓', wsm: 0 },
  { en: 'Short Siege Bow', zh: '短攻城弓', wsm: 0 },
  { en: 'Short Sword', zh: '短劍', wsm: 0 },
  { en: 'Short War Bow', zh: '短巨戰弓', wsm: 0 },
  { en: 'Siege Crossbow', zh: '攻城十字弓', wsm: 0 },
  { en: 'Silver Edged Axe', zh: '銀刃斧', wsm: 0 },
  { en: 'Smoked Sphere', zh: '煙霧球', wsm: 0 },
  { en: 'Sparkling Ball', zh: '閃光球', wsm: 0 },
  { en: 'Spetum', zh: '大戰戟', wsm: 0 },
  { en: 'Spiked Club', zh: '狼牙棒', wsm: 0 },
  { en: 'Stag Bow', zh: '鹿角弓', wsm: 0 },
  { en: 'Stygian Pike', zh: '冥河之槍', wsm: 0 },
  { en: 'Stygian Pilum', zh: '冥河投矛', wsm: 0 },
  { en: 'Suwayyah', zh: '蘇瓦亞爪', wsm: 0 },
  { en: 'Throwing Knife', zh: '投擲刀', wsm: 0 },
  { en: 'Tomahawk', zh: '戰鉞', wsm: 0 },
  { en: 'Trident', zh: '三叉戟', wsm: 0 },
  { en: 'Tusk Sword', zh: '長牙劍', wsm: 0 },
  { en: 'Two-Handed Sword', zh: '雙手劍', wsm: 0 },
  { en: 'Tyrant Club', zh: '暴君之棒', wsm: 0 },
  { en: 'Unearthed Wand', zh: '破隱法杖', wsm: 0 },
  { en: 'Vortex Orb', zh: '漩渦球', wsm: 0 },
  { en: 'Voulge', zh: '鉤鐮槍', wsm: 0 },
  { en: 'Wand', zh: '法杖', wsm: 0 },
  { en: 'War Axe', zh: '巨戰斧', wsm: 0 },
  { en: 'War Sword', zh: '巨戰之劍', wsm: 0 },
  { en: 'Ward Bow', zh: '庇護之弓', wsm: 0 },
  { en: 'Wrist Blade', zh: '腕刃', wsm: 0 },
  { en: 'Yari', zh: '三叉長槍', wsm: 0 },
  { en: 'Colossus Blade', zh: '巨神之刃', wsm: 5 },
  { en: 'Edge Bow', zh: '鋒銳之弓', wsm: 5 },
  { en: 'Short Bow', zh: '短弓', wsm: 5 },
  { en: 'Spider Bow', zh: '蜘蛛弓', wsm: 5 },
  { en: 'Ancient Axe', zh: '古代之斧', wsm: 10 },
  { en: 'Archon Staff', zh: '執政官之杖', wsm: 10 },
  { en: 'Balista', zh: '弩弓', wsm: 10 },
  { en: 'Balrog Spear', zh: '炎魔之矛', wsm: 10 },
  { en: 'Bardiche', zh: '大砍刀', wsm: 10 },
  { en: 'Bastard Sword', zh: '巨劍', wsm: 10 },
  { en: 'Battle Axe', zh: '戰鬥斧', wsm: 10 },
  { en: 'Cedar Staff', zh: '杉木棍', wsm: 10 },
  { en: 'Ceremonial Bow', zh: '祭典之弓', wsm: 10 },
  { en: 'Claymore', zh: '雙刃大刀', wsm: 10 },
  { en: 'Cleaver', zh: '切肉斧', wsm: 10 },
  { en: 'Colossus Crossbow', zh: '巨神十字弓', wsm: 10 },
  { en: 'Colossus Sword', zh: '巨神之劍', wsm: 10 },
  { en: 'Colossus Voulge', zh: '巨神長戟', wsm: 10 },
  { en: 'Crusader Bow', zh: '十字軍之弓', wsm: 10 },
  { en: 'Cryptic Axe', zh: '神秘之斧', wsm: 10 },
  { en: 'Dacian Falx', zh: '雙刃鐮', wsm: 10 },
  { en: 'Decapitator', zh: '斬首斧', wsm: 10 },
  { en: 'Devil Star', zh: '惡魔流星錘', wsm: 10 },
  { en: 'Dimensional Shard', zh: '次元碎片', wsm: 10 },
  { en: 'Double Axe', zh: '雙刃斧', wsm: 10 },
  { en: 'Ettin Axe', zh: '雙頭斧', wsm: 10 },
  { en: 'Executioner Sword', zh: '死刑之劍', wsm: 10 },
  { en: 'Fascia', zh: '法西亞爪', wsm: 10 },
  { en: 'Flying Axe', zh: '飛斧', wsm: 10 },
  { en: 'Francisca', zh: '法蘭飛斧', wsm: 10 },
  { en: 'Ghost Wand', zh: '幽靈法杖', wsm: 10 },
  { en: 'Giant Axe', zh: '大斧', wsm: 10 },
  { en: 'Glorious Axe', zh: '榮光之斧', wsm: 10 },
  { en: 'Gnarled Staff', zh: '多節棍', wsm: 10 },
  { en: 'Gothic Bow', zh: '哥德弓', wsm: 10 },
  { en: 'Gothic Sword', zh: '哥德劍', wsm: 10 },
  { en: 'Grand Matron Bow', zh: '大女族長弓', wsm: 10 },
  { en: 'Grand Scepter', zh: '雄偉權杖', wsm: 10 },
  { en: 'Great Sword', zh: '卓越之劍', wsm: 10 },
  { en: 'Hatchet Hands', zh: '小斧拳', wsm: 10 },
  { en: 'Heavy Crossbow', zh: '重十字弓', wsm: 10 },
  { en: 'Holy Water Sprinkler', zh: '聖水噴杖', wsm: 10 },
  { en: 'Hydra Bow', zh: '九頭蛇弓', wsm: 10 },
  { en: 'Hydra Edge', zh: '九頭蛇刃', wsm: 10 },
  { en: 'Jagged Star', zh: '鋸齒流星鎚', wsm: 10 },
  { en: "Jared's Stone", zh: '賈瑞德之石', wsm: 10 },
  { en: 'Large Siege Bow', zh: '長攻城弓', wsm: 10 },
  { en: 'Lochaber Axe', zh: '洛哈伯大斧', wsm: 10 },
  { en: 'Long Battle Bow', zh: '長戰鬥弓', wsm: 10 },
  { en: 'Long War Bow', zh: '長巨戰弓', wsm: 10 },
  { en: 'Maiden Pike', zh: '少女之槍', wsm: 10 },
  { en: 'Maul', zh: '大木棍', wsm: 10 },
  { en: 'Morning Star', zh: '流星鎚', wsm: 10 },
  { en: 'Ogre Maul', zh: '食人魔之錘', wsm: 10 },
  { en: 'Partizan', zh: '戰戟', wsm: 10 },
  { en: 'Petrified Wand', zh: '淨化之杖', wsm: 10 },
  { en: 'Poleaxe', zh: '長柄戰斧', wsm: 10 },
  { en: 'Reflex Bow', zh: '反射弓', wsm: 10 },
  { en: 'Seraph Rod', zh: '熾天使之杖', wsm: 10 },
  { en: 'Short Spear', zh: '短矛', wsm: 10 },
  { en: 'Simbilan', zh: '辛比倫矛', wsm: 10 },
  { en: 'Small Crescent', zh: '小新月斧', wsm: 10 },
  { en: 'Stalagmite', zh: '石筍', wsm: 10 },
  { en: 'Swirling Crystal', zh: '渦流水晶', wsm: 10 },
  { en: 'Tabar', zh: '塔巴爾斧', wsm: 10 },
  { en: 'Throwing Axe', zh: '投擲斧', wsm: 10 },
  { en: 'Twin Axe', zh: '強化雙斧', wsm: 10 },
  { en: 'War Club', zh: '巨戰木棍', wsm: 10 },
  { en: 'War Fist', zh: '戰拳', wsm: 10 },
  { en: 'Yew Wand', zh: '紫杉之杖', wsm: 10 },
  { en: 'Battle Hammer', zh: '戰鬥鐵鎚', wsm: 20 },
  { en: 'Ceremonial Pike', zh: '祭典之長矛', wsm: 20 },
  { en: 'Falchion', zh: '彎形大刀', wsm: 20 },
  { en: 'Ghost Glaive', zh: '幽靈戟', wsm: 20 },
  { en: 'Glaive', zh: '戟', wsm: 20 },
  { en: 'Great Maul', zh: '卓越巨棍', wsm: 20 },
  { en: 'Lance', zh: '長槍', wsm: 20 },
  { en: 'Legendary Mallet', zh: '傳說之鎚', wsm: 20 },
  { en: 'Martel de Fer', zh: '戰鎚', wsm: 20 },
  { en: 'Matriarchal Pike', zh: '女族長之槍', wsm: 20 },
  { en: 'Pike', zh: '矛', wsm: 20 },
  { en: 'Rune Staff', zh: '符文之棍', wsm: 20 },
  { en: 'Spiculum', zh: '長投矛', wsm: 20 },
  { en: 'Thunder Maul', zh: '雷錘', wsm: 20 },
  { en: 'Tulwar', zh: '圓月彎刀', wsm: 20 },
  { en: 'War Hammer', zh: '巨戰鐵鎚', wsm: 20 },
  { en: 'War Pike', zh: '戰槍', wsm: 20 },
  { en: 'War Staff', zh: '巨戰法杖', wsm: 20 },
];

function wsmColor(wsm: number): string {
  if (wsm <= -30) return '#00ffcc';
  if (wsm <= -10) return '#44ff88';
  if (wsm < 0) return '#aaffaa';
  if (wsm === 0) return '#cccccc';
  if (wsm <= 10) return '#ffcc44';
  return '#ff6644';
}

function wsmLabel(wsm: number): string {
  if (wsm <= -20) return '極快';
  if (wsm <= -10) return '快速';
  if (wsm < 0) return '偏快';
  if (wsm === 0) return '標準';
  if (wsm <= 10) return '偏慢';
  return '緩慢';
}

export default function WeaponSpeed() {
  const [search, setSearch] = useState('');

  const filtered = WEAPONS.filter((w) => {
    const q = search.toLowerCase();
    return w.en.toLowerCase().includes(q) || w.zh.includes(search);
  });

  return (
    <div>
      <h1 className="text-xl font-bold mb-1" style={{ color: '#00ffff' }}>
        武器速度參考表
      </h1>
      <p className="text-sm text-gray-400 mb-3">
        WSM（武器速度調整）數值越低（負值越大）攻速越快。Phase Blade（幻化之刃）WSM -30 為最快劍類。
      </p>

      <div className="flex gap-4 mb-4 flex-wrap text-xs">
        {[-30, -20, -10, 0, 10, 20].map((wsm) => (
          <span key={wsm} style={{ color: wsmColor(wsm) }}>
            WSM {wsm > 0 ? `+${wsm}` : wsm} = {wsmLabel(wsm)}
          </span>
        ))}
      </div>

      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋武器名稱..."
          className="px-3 py-1 text-sm border bg-transparent"
          style={{ borderColor: '#404040', color: '#ffffff', width: '200px' }}
        />
        <span className="text-gray-500 text-xs ml-2">{filtered.length} 項</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th className="text-left py-1 px-2 font-normal text-gray-400 w-8">WSM</th>
              <th className="text-left py-1 px-2 font-normal text-gray-400">速度</th>
              <th className="text-left py-1 px-2 font-normal text-gray-400">中文</th>
              <th className="text-left py-1 px-2 font-normal text-gray-400">英文</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => (
              <tr
                key={w.en}
                style={{
                  backgroundColor: i % 2 === 1 ? '#0d0d0d' : 'transparent',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                <td className="py-1 px-2 font-mono" style={{ color: wsmColor(w.wsm) }}>
                  {w.wsm > 0 ? `+${w.wsm}` : w.wsm}
                </td>
                <td className="py-1 px-2 text-xs" style={{ color: wsmColor(w.wsm) }}>
                  {wsmLabel(w.wsm)}
                </td>
                <td className="py-1 px-2 text-gray-200">{w.zh || '—'}</td>
                <td className="py-1 px-2 text-gray-400">{w.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
