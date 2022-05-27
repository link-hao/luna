<template>
  <div class="galaxySceneSwitch">
    <div class="galaxySceneSwitch_title">{{ starName }}</div>
    <div
      class="galaxySceneSwitch_btn"
      @click="playerSceneStore.leaveStarSystem()"
    >
      <i class="luna-icon luna-icon-multiply" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlayerSceneStore } from '@/service/scene/player'
import { computed } from 'vue'

const playerSceneStore = usePlayerSceneStore()
const starName = computed(() => playerSceneStore.currentStarSystem.star.name)
</script>

<style lang="less">
.galaxySceneSwitch {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  &_title {
    padding: 0 16px;
    line-height: 1;
    font-size: 24px;
    font-weight: lighter;
  }
  &_btn {
    .hoverable();
    font-size: 24px;
    width: 48px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
