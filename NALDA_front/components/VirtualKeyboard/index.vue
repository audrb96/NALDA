<template>
  <transition name="slide-fade">
    <div class="keyboard" :class="theme">
      <div v-for="(keyLine, index) in KeyData[lang]" :key="index">
        <ul>
          <li
            v-for="(key, index) in keyLine"
            :key="index"
            class="key"
            :class="classObject(key[shiftIndex])"
            @click="() => keyEvent(key[shiftIndex])"
          >
            <!-- <span class="keyInfo" v-if="key[shiftIndex] === 'BackSpace'"><img class="keyInfo" src="../../assets/images/ic_backspace.png" /></span> -->
            <span v-if="key[shiftIndex] === 'space'" class="keyInfo"></span>
            <span v-else class="keyInfo">{{ key[shiftIndex] }}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import Hangul from 'hangul-js'
import KeyData from './keyData'

export default {
  name: 'VirtualKeyboard',
  props: {
    valueArr: Array,
    theme: String,
  },
  data() {
    return {
      KeyData,
      shiftIndex: 0,
      capsLock: 0,
      lang: 'kr',
      keyArr: [],
      keyValue: null,
    }
  },
  methods: {
    classObject(key) {
      switch (key) {
        case 'BackSpace':
          return { delete: true }
        case 'Tab':
          return { tab: true }
        case 'CapsLock':
          return { caps: true }
        case 'Enter':
          return { enter: true }
        case 'Shift':
          if (this.shiftIndex === 1) {
            return { shift: true, active: true }
          }
          return { shift: true, active: false }
        case '한/영':
          if (this.lang === 'en') {
            return { lang: true, active: true }
          }
          return { lang: true, active: false }
        case 'space':
          return { space: true }
        default:
          return { none: false }
      }
    },
    async keyEvent(key) {
      switch (key) {
        case 'Shift':
        case 'CapsLock':
          if (this.shiftIndex === 1) {
            this.shiftIndex = 0
          } else {
            this.shiftIndex = 1
          }
          break
        case '한/영':
          if (this.lang === 'kr') {
            this.lang = 'en'
          } else {
            this.lang = 'kr'
          }
          break
        case 'BackSpace':
          this.delete()
          break
        case 'space':
          await this.keyArr.push(' ')
          this.keyValue = await Hangul.assemble(this.keyArr)
          await this.$emit('getKeyValue', this.keyValue)
          break
        default:
          await this.keyArr.push(key)
          this.keyValue = await Hangul.assemble(this.keyArr)
          await this.$emit('getKeyValue', this.keyValue)
          break
      }
    },
    async delete() {
      await this.keyArr.pop()
      this.keyValue = await Hangul.assemble(this.keyArr)
      await this.$emit('getKeyValue', this.keyValue)
    },
    clearArray() {
      this.keyArr = []
    },
  },
}
</script>

<style lang="scss" scoped>
@import './VirtualKeyboard.scss';
</style>
