<template>
  <div>
    <strong>Stats:</strong>
    <span class="durability">Durability: {{ Math.floor(durability) }}</span>
    <span class="damage">Attack damage: {{ formatNumber(damage) }}</span>
    <span class="attackSpeed">Attack speed: {{ formatNumber(attackSpeed) }}</span>
    <!-- <span class="miningLevel">Mining level: {{ miningLevel }}</span> -->
    <span class="miningSpeed">Mining speed: {{ formatNumber(miningSpeed) }}</span>
    <div class="mods">
      <strong>Modifiers:</strong>
      <span v-for="(times, trait) in traitsComputed" :key="trait" :class="trait" :title="title(trait)">
        {{ formatString(trait) }} {{ toRoman(times) }}
      </span>
    </div>
  </div>
</template>

<script>
import { getPartsData, partToType } from '../utils';

export default {
  props: ['json'],
  data() {
    return {
      partsData: getPartsData(),
      durability: 0,
      damage: 1,
      attackSpeed: 0,
      miningSpeed: 0,
      traits: [],
      miningLevel: [],
    };
  },
  methods: {
    title(trait) {
      return this.partsData.traits[trait]
    },
    reset() {
      this.durability = 0;
      this.damage = 1;
      this.attackSpeed = 0;
      this.miningSpeed = 0;
      this.traits = [];
      this.miningLevel = [];
    },
    formatString(text) {
      return (text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()).split('_').join(' ');
    },
    toRoman(number) {
      let romans = [, 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
      return romans[number];
    },
    formatNumber(number) {
      return parseFloat((Math.floor(number * 100) / 100).toFixed(2));
    },
    calculate() {
      if (!this.json.completed) return;
      this.reset();

      let head = [];
      let handle = [];
      let extra = [];

      Object.entries(this.json.parts).forEach((data) => {
        let part = data[0];
        data = data[1];
        let type = partToType(part.split(/_\d$/)[0]);
        switch (type) {
          case 'head':
            head.push(this.partsData.head[data.data]);
            this.traits.push(this.partsData.extra[data.data].trait);
            this.miningLevel.push(this.partsData.head[data.data].mining_level);
            break;
          case 'handle':
            handle.push(this.partsData.handle[data.data]);
            this.traits.push(this.partsData.extra[data.data].trait);
            break;
          case 'extra':
            extra.push(this.partsData.extra[data.data]);
            break;
          default:
            alert(`Failed reading part type on ${JSON.stringify(data)} ${type}`);
        }
      });

      // Register head parts
      head.forEach((data) => {
        this.durability += data.durability;
        this.miningSpeed += data.mining_speed;
        this.damage += data.attack_damage;
      });
      this.durability /= head.length;
      this.miningSpeed /= head.length;
      this.damage /= head.length;

      // Register handle parts
      let handleData = {
        durability: 0,
        attack_damage: 0,
        attack_speed: 0,
        mining_speed: 0,
      };
      handle.forEach((data) => {
        handleData.durability += data.durability;
        handleData.attack_damage += data.attack_damage;
        handleData.attack_speed += data.attack_speed;
        handleData.mining_speed += data.mining_speed;
      });

      this.durability *= +this.formatNumber(handleData.durability / handle.length);
      this.damage *= +this.formatNumber(handleData.attack_damage / handle.length);
      this.miningSpeed *= +this.formatNumber(handleData.mining_speed / handle.length);

      // Register extra parts
      extra.forEach((data) => {
        if (typeof data.trait === 'string') this.traits.push(data.trait);
        else this.traits.push(...data.trait);
      });

      // Apply traits
      if (this.traitsComputed.piercing) this.damage -= 0.5 * this.traitsComputed.piercing;

      // Apply tool type modifiers
      switch (this.json.type) {
        case 'sword':
          this.durability *= 1.1;
          this.damage += 3;
          this.attackSpeed = 1.6;
          this.miningSpeed /= 2;
          break;
        case 'dagger':
          this.miningSpeed *= 3 / 4;
          this.damage *= 0.5;
          this.damage += 1.5;
          this.attackSpeed = 2.0;
          this.durability *= 0.75;
          this.traits.push('Padded');
          break;
        case 'hand_axe':
          this.damage += 6;
          this.attackSpeed = 0.9;
          break;
        case 'kama':
          this.damage *= 0.75;
          this.damage += 1;
          this.attackSpeed = 1.8;
          break;
        case 'mattock':
          this.damage *= 1.1;
          this.damage += 2.1;
          this.attackSpeed = 0.9;
          this.miningSpeed *= 1.1;
          this.durability *= 1.25;
          break;
        case 'pickaxe':
          this.attackSpeed = 1.2;
          this.traits.push('piercing');
          break;
        case 'cleaver':
          this.damage *= 1.5;
          this.damage += 5.5;
          this.attackSpeed = 0.9;
          this.durability *= 3.5;
          this.miningSpeed *= 0.25;
          this.traits.push('beheading');
          this.traits.push('beheading');
          break;
        case 'broad_axe':
          this.damage += 4.95;
          this.damage *= 1.5;
          this.attackSpeed = 0.6;
          this.miningSpeed *= 0.3;
          this.durability *= 3.85;
          break;
        case 'scythe':
          // CHECKPOINT
          this.damage += 1;
          this.attackSpeed = 0.8;
          this.miningSpeed *= 0.45;
          this.durability *= 2.5;
          break;
        case 'excavator':
          this.damage += 1.5;
          this.damage *= 1.2;
          this.attackSpeed = 1;
          this.miningSpeed *= 0.3;
          this.durability *= 3.75;
          break;
        case 'sledge_hammer':
          this.damage += 3;
          this.damage *= 1.35;
          this.attackSpeed = 0.75;
          this.miningSpeed *= 0.4;
          this.durability *= 4;
          break;
        case 'vein_hammer':
          this.damage += 3;
          this.damage *= 1.25;
          this.attackSpeed = 1.1;
          this.miningSpeed *= 3;
          this.durability *= 5;
      }

      // Relies on tool type
      this.attackSpeed *= +this.formatNumber(handleData.attack_speed / handle.length);
    },
  },
  computed: {
    traitsComputed() {
      /** @type {{[key: string]: number}} */
      let out = {};
      for (const trait of this.traits) {
        if (out[trait]) {
          out[trait] += 1;
        } else {
          out[trait] = 1;
        }
      }
      return out;
    },
  },
  watch: {
    json() {
      this.calculate();
    },
    traits() {
      this.traits = this.traits.sort();
    },
  },
  mounted() {
    this.calculate();
  },
};
</script>

<style lang="scss" scoped>
span {
  display: block;
}

.durability {
  color: #47cc47;
}

.miningSpeed {
  color: #78a0cd;
}

.attackSpeed {
  color: #8547cc;
}

.mods {
  margin: 4px 0 0 0;
}

[class^='damage'] {
  color: #d76464;
}

[class^='cultivated'] {
  color: #8e661b;
}

[class^='stonebound'] {
  color: #999999;
}

[class^='piercing'] {
  color: #d1d37a;
}
</style>
