<!-- 챌린지 및 랭킹 -->
<script setup>
import { ref } from 'vue'
import ChallengeCard from '@/components/challenge/ChallengeCard.vue'
import RankingList from '@/components/challenge/RankingList.vue'
import MissionCard from '@/components/challenge/MissionCard.vue'
</script>

<template>
  <div class="h-full overflow-y-auto">
    <div class="p-4 pb-25 overflow-visible">
      <ChallengeCard />
      <RankingList />
      <MissionCard />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
