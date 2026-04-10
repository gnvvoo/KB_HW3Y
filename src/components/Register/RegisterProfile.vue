<script setup>
import { ref, computed } from 'vue'
import { useRegisterStore } from '../../stores/useRegisterStore'
import ramuFace from '../../assets/ramu_face.png'
import bibiFace from '../../assets/bibi_face.png'
import coliFace from '../../assets/coli_face.png'
import kikiFace from '../../assets/kiki_face.png'
import agerFace from '../../assets/ager_face.png'

const registerStore = useRegisterStore()

const avatarOptions = [ramuFace, bibiFace, coliFace, kikiFace, agerFace]

const profileImagePreview = ref(ramuFace)
const showAvatarModal = ref(false)
const tempSelected = ref(ramuFace)

const monthlyBudget = computed({
  get: () => registerStore.registerForm.monthlyBudget ?? '',
  set: (val) => {
    const parsed = parseInt(val, 10)
    registerStore.registerForm.monthlyBudget = isNaN(parsed) ? null : parsed
  },
})

function openAvatarModal() {
  tempSelected.value = profileImagePreview.value
  showAvatarModal.value = true
}

function confirmAvatar() {
  profileImagePreview.value = tempSelected.value
  registerStore.registerForm.profileImage = tempSelected.value
  showAvatarModal.value = false
}
</script>

<template>
  <!-- 타이틀 영역 -->
  <h1 class="text-2xl font-bold text-kb-dark-gray leading-snug">프로필을 설정해요</h1>
  <p class="text-sm text-kb-gray mt-1">가계부에서 사용할 닉네임을 알려주세요</p>

  <!-- 프로필 이미지 -->
  <div class="flex flex-col items-center mt-6">
    <div class="relative w-24 h-24">
      <img
        :src="profileImagePreview"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full object-cover border-2 border-zinc-200"
      />
      <!-- 사진 변경 버튼 -->
      <button
        @click="openAvatarModal"
        type="button"
        class="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-kb-yellow flex items-center justify-center shadow"
      >
        <span class="text-white text-xs font-bold">✎</span>
      </button>
    </div>
    <span class="text-xs text-kb-yellow mt-2 cursor-pointer" @click="openAvatarModal">사진 변경</span>
  </div>

  <!-- 아바타 선택 모달 -->
  <Teleport to="body">
    <div
      v-if="showAvatarModal"
      class="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      @click.self="showAvatarModal = false"
    >
      <div class="bg-kb-card w-full max-w-md rounded-t-2xl p-6 pb-10">
        <div class="w-10 h-1 bg-kb-line rounded-full mx-auto mb-5"></div>
        <h2 class="text-base font-bold text-center mb-6">프로필 이미지 선택</h2>

        <div class="flex gap-4 justify-center flex-wrap mb-8">
          <button
            v-for="(img, index) in avatarOptions"
            :key="index"
            @click="tempSelected = img"
            type="button"
            class="rounded-full border-2 transition-colors"
            :class="tempSelected === img ? 'border-kb-yellow' : 'border-transparent'"
          >
            <img :src="img" class="w-20 h-20 rounded-full object-cover" />
          </button>
        </div>

        <div class="flex gap-2">
          <button
            @click="showAvatarModal = false"
            type="button"
            class="flex-1 py-3 rounded-xl border border-kb-line text-sm text-kb-muted"
          >
            취소
          </button>
          <button
            @click="confirmAvatar"
            type="button"
            class="flex-1 py-3 rounded-xl bg-kb-yellow text-sm font-bold text-kb-dark"
          >
            선택
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- 입력 폼 -->
  <div class="mt-6 flex flex-col gap-5">

    <!-- 닉네임 -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <label class="text-sm font-medium text-kb-dark-gray">닉네임</label>
        <span class="text-xs text-red-500">특수문자는 사용할 수 없습니다</span>
      </div>
      <input
        v-model="registerStore.registerForm.nickname"
        type="text"
        placeholder="2~8자 이내로 입력해주세요"
        maxlength="8"
        class="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
      />
    </div>

    <!-- 월 목표 예산 (선택) -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-kb-dark-gray">
        월 목표 예산
        <span class="text-xs text-kb-gray font-normal ml-1">(선택)</span>
      </label>
      <input
        v-model="monthlyBudget"
        type="number"
        placeholder="예: 500000     나중에 설정에서 변경할 수 있어요"
        class="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 bg-white text-sm text-kb-dark-gray placeholder:text-zinc-300 outline-none focus:border-kb-yellow transition-colors duration-200"
      />
    </div>

  </div>
</template>

<style lang="scss" scoped></style>
