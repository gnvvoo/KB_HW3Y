<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/user'
import ramuFace from '@/assets/ramu_face.png'
import bibiFace from '@/assets/bibi_face.png'
import coliFace from '@/assets/coli_face.png'
import kikiFace from '@/assets/kiki_face.png'
import agerFace from '@/assets/ager_face.png'

const emit = defineEmits(['close'])
const authStore = useAuthStore()

const avatarOptions = [ramuFace, bibiFace, coliFace, kikiFace, agerFace]

const selectedImage = ref(authStore.currentUser?.profileImage || ramuFace)

async function handleSave() {
  await authStore.updateProfile({ profileImage: selectedImage.value })
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
    @click.self="$emit('close')"
  >
    <div class="bg-kb-card w-full max-w-md rounded-t-2xl p-6 pb-10">
      <div class="w-10 h-1 bg-kb-line rounded-full mx-auto mb-5"></div>
      <h2 class="text-base font-bold text-center mb-6">프로필 이미지 변경</h2>

      <div class="flex gap-4 justify-center flex-wrap mb-8">
        <button
          v-for="(img, index) in avatarOptions"
          :key="index"
          @click="selectedImage = img"
          class="rounded-full border-2 transition-colors"
          :class="selectedImage === img ? 'border-kb-yellow' : 'border-transparent'"
        >
          <img :src="img" class="w-20 h-20 rounded-full object-cover" />
        </button>
      </div>

      <div class="flex gap-2">
        <button
          @click="$emit('close')"
          class="flex-1 py-3 rounded-xl border border-kb-line text-sm text-kb-muted"
        >
          취소
        </button>
        <button
          @click="handleSave"
          class="flex-1 py-3 rounded-xl bg-kb-yellow text-sm font-bold text-kb-dark"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
