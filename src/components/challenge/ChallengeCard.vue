<script setup>
import { ref, computed, onMounted } from 'vue'
import ramuPushImg from '@/assets/ramu_push.png'
import ramuEndImg from '@/assets/ramu_end.png'

// 현재 연월
const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()
const periodText = computed(() => `${currentYear}년 ${currentMonth}월 전체`)

// props
const props = defineProps({
  title: {
    type: String,
    default: '10만원 한달살기',
  },
  category: {
    type: String,
    default: '식비 카테고리',
  },
  amount: {
    type: Number,
    default: 1000000,
  },
  weekStatus: {
    type: Number,
    default: 3,
  },
})

// title에서 금액 자동 파싱
const maxAmount = computed(() => {
  const title = props.title

  const manMatch = title.match(/(\d+(\.\d+)?)만원/)
  if (manMatch) return Math.round(parseFloat(manMatch[1]) * 10000)

  const cheonMatch = title.match(/(\d+(\.\d+)?)천원/)
  if (cheonMatch) return Math.round(parseFloat(cheonMatch[1]) * 1000)

  const rawMatch = title.match(/(\d+)원/)
  if (rawMatch) return parseInt(rawMatch[1])

  return 100000
})

// 남은 금액
const saved = computed(() => Math.max(maxAmount.value - props.amount, 0))

// 진행률 퍼센트
const progressPercent = computed(() => Math.min((props.amount / maxAmount.value) * 100, 100))

// 진행바 DOM 측정
const progressBarWidth = ref(0)
const progressBarRef = ref(null)
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  if (progressBarRef.value) {
    progressBarWidth.value = progressBarRef.value.offsetWidth

    const ro = new ResizeObserver(() => {
      progressBarWidth.value = progressBarRef.value.offsetWidth
    })
    ro.observe(progressBarRef.value)
  }
})

// 초과 여부, 초과 금액
const isOver = computed(() => props.amount >= maxAmount.value)
const overAmount = computed(() => props.amount - maxAmount.value)

// 캐릭터 이미지
const currentImg = computed(() => (isOver.value ? ramuEndImg : ramuPushImg))

// 캐릭터 스타일
const characterStyle = computed(() => {
  if (!mounted.value || !progressBarWidth.value) return { opacity: 0 }

  const barWidth = progressBarWidth.value
  const imgWidth = isOver.value ? 64 : 44
  const pos = Math.min(Math.max(progressPercent.value, 0), 100)
  const px = (pos / 100) * barWidth
  let leftPx = px - imgWidth / 2

  // 왼쪽/오른쪽 끝 보정
  if (leftPx < 0) leftPx = 0
  if (leftPx > barWidth - imgWidth) leftPx = barWidth - imgWidth

  return {
    left: `${leftPx}px`,
    transition: 'all 0.5s ease-out',
  }
})
</script>

<template>
  <div
    class="px-4 py-3 rounded-[24px] shadow-sm relative flex flex-col justify-between overflow-visible"
    style="background-color: var(--color-kb-yellow)"
  >
    <!-- 상단 정보 -->
    <div class="leading-tight space-y-0.5">
      <span
        class="text-[10px] px-2 py-0.5 rounded-full font-medium"
        style="background-color: rgba(0, 0, 0, 0.1); color: var(--color-kb-gray)"
        >{{ currentMonth }}월 진행 중</span
      >
      <h2 class="text-xl font-bold mt-0.5" style="color: var(--color-kb-dark-gray)">{{ title }}</h2>
      <p class="text-[11px] opacity-70" style="color: var(--color-kb-gray)">
        {{ category }} · {{ periodText }}
      </p>
    </div>

    <!-- 사용 금액 -->
    <div class="flex justify-between items-end mb-0.5">
      <div>
        <p class="text-[11px] opacity-70" style="color: var(--color-kb-gray)">사용 금액</p>
        <p class="text-xl font-extrabold leading-none" style="color: var(--color-kb-expense)">
          {{ amount.toLocaleString() }}<span class="text-lg ml-0.5">원</span>
        </p>
      </div>

      <!-- 남은금액/초과금액 -->
      <div class="mb-1">
        <div
          class="text-[10px] font-bold px-2 py-1 rounded-full shadow-sm"
          :style="
            isOver
              ? 'background-color: var(--color-kb-icon-pink); color: var(--color-kb-expense);'
              : 'background-color: var(--color-kb-icon-green); color: var(--color-kb-income);'
          "
        >
          {{
            isOver ? `${overAmount.toLocaleString()}원 초과` : `${saved.toLocaleString()}원 남음`
          }}
        </div>
      </div>
    </div>

    <!-- 진행바 + 캐릭터 영역 -->
    <div class="relative pt-3 mb-2">
      <!-- 라무 캐릭터 -->
      <div class="absolute bottom-[30%] z-10" :style="characterStyle">
        <img
          :src="currentImg"
          alt="character"
          :class="[isOver ? 'w-16 h-11' : 'w-11 h-11']"
          class="object-contain block max-w-none"
        />
      </div>

      <!-- 진행바 영역 -->
      <div ref="progressBarRef" class="w-full">
        <div
          class="w-full h-2.5 rounded-full overflow-hidden"
          style="background-color: rgba(0, 0, 0, 0.1)"
        >
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: progressPercent + '%',
              background: 'var(--gradient-kb-yellow)',
            }"
          ></div>
        </div>

        <!-- 진행바 눈금 -->
        <div
          class="flex justify-between text-[9px] mt-2 font-medium opacity-60 px-1"
          style="color: var(--color-kb-gray)"
        >
          <span>0원</span>
          <span>{{ (maxAmount / 2).toLocaleString() }}원</span>
          <span>{{ maxAmount.toLocaleString() }}원</span>
        </div>
      </div>
    </div>

    <!-- 주차 상태 -->
    <div class="grid grid-cols-4 gap-2">
      <div
        v-for="i in 4"
        :key="i"
        class="text-center py-1 rounded-xl text-[11px] font-bold transition-all"
        :style="
          i === weekStatus
            ? 'background-color: var(--gradient-kb-yellow); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transform: scale(1.05);'
            : i < weekStatus
              ? 'background-color: rgba(255,255,255,0.6); color: var(--color-kb-dark-gray);'
              : 'background-color: rgba(255,255,255,0.28); color: var(--color-kb-dark-gray);'
        "
      >
        {{ i }}주
        <div
          class="text-[9px] font-normal opacity-80"
          :style="i < weekStatus ? 'color: var(--color-kb-income)' : ''"
        >
          <span v-if="i < weekStatus">완료</span>
          <span v-else-if="i === weekStatus">진행중</span>
          <span v-else>진행 전</span>
        </div>
      </div>
    </div>
  </div>
</template>
