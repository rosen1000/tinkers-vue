<template>
  <div>
    <span class="durability">Durability: {{ Math.floor(durability) }}</span>
    <span class="damage">Attack damage: {{ formatNumber(damage) }}</span>
    <span class="attackSpeed">Attack speed: {{ formatNumber(attackSpeed) }}</span>
    <span class="miningSpeed">Mining speed: {{ formatNumber(miningSpeed) }} </span>
    <span>Modifiers:</span>
    <span v-for="(times, trait) in traitsComputed" :key="trait" :class="trait">{{ trait }} {{ toRoman(times) }}</span>
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
    };
  },
  methods: {
    reset() {
      this.durability = 0;
      this.damage = 1;
      this.attackSpeed = 0;
      this.miningSpeed = 0;
      this.traits = [];
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
            break;
          case 'handle':
            handle.push(this.partsData.handle[data.data]);
            this.traits.push(this.partsData.extra[data.data].trait);
            break;
          case 'extra':
            extra.push(this.partsData.extra[data.data]);
            this.traits.push(this.partsData.extra[data.data].trait);
            break;
          default:
            alert(`Failed reading part type on ${JSON.stringify(data)}`);
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
      console.log(handleData, this.durability, handleData.durability / handle.length, this.formatNumber(handleData.durability / handle.length));
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
      }

      // Relies on tool type
      this.attackSpeed *= +this.formatNumber(handleData.attack_speed / handle.length);
    },
    traits() {
      this.traits = this.traits.sort();
    },
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
