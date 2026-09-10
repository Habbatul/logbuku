<template>
  <div class="relative flex flex-col items-center justify-center py-4 sm:py-6 select-none overflow-hidden sm:overflow-visible">
    <div class="relative flex items-center justify-center w-48 h-48 sm:w-60 sm:h-60">
      <div
        v-if="active"
        class="absolute inset-0 rounded-full border border-sky-400/40 animate-ping opacity-60 pointer-events-none"
        style="animation-duration: 3s;"
      ></div>
      <div
        v-if="active"
        class="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-sky-300/30 animate-ping opacity-40 pointer-events-none"
        style="animation-duration: 2.2s; animation-delay: 0.5s;"
      ></div>
      <div
        v-if="active"
        class="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-cyan-400/25 animate-ping opacity-30 pointer-events-none"
        style="animation-duration: 1.8s; animation-delay: 1s;"
      ></div>

      <div
        class="absolute inset-2 rounded-full border border-white/12 backdrop-blur-xs flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.15)]"
      >
        <div
          v-if="active"
          class="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(56,189,248,0.25)_360deg)] animate-spin"
          style="animation-duration: 4s;"
        ></div>
      </div>

      <div
        class="relative z-10 flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full border border-white/25 shadow-2xl transition-all duration-500"
        :class="coreColorClass"
      >
        <div class="absolute inset-1 rounded-full border border-white/20"></div>

        <div class="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <slot name="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-9 w-9 sm:h-12 sm:w-12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 20h.01" />
              <path d="M2 8.82a15 15 0 0 1 20 0" />
              <path d="M5 12.859a10 10 0 0 1 14 0" />
              <path d="M8.5 16.429a5 5 0 0 1 7 0" />
            </svg>
          </slot>
        </div>

        <div class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center">
          <span
            v-if="active"
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            :class="badgePingClass"
          ></span>
          <span
            class="relative inline-flex rounded-full h-4 w-4 border-2 border-slate-900 shadow-sm"
            :class="badgeDotClass"
          ></span>
        </div>
      </div>
    </div>

    <div class="mt-4 text-center max-w-sm px-4">
      <h3 class="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="mt-1 text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    status?: string
    title: string
    subtitle?: string
    variant?: 'sky' | 'amber' | 'emerald' | 'rose'
  }>(),
  {
    active: true,
    subtitle: '',
    variant: 'sky'
  }
)

const coreColorClass = computed(() => {
  switch (props.variant) {
    case 'amber':
      return 'bg-gradient-to-br from-amber-500/50 via-orange-600/40 to-slate-900/80 shadow-[0_0_35px_rgba(245,158,11,0.35)]'
    case 'emerald':
      return 'bg-gradient-to-br from-emerald-500/50 via-teal-600/40 to-slate-900/80 shadow-[0_0_35px_rgba(16,185,129,0.35)]'
    case 'rose':
      return 'bg-gradient-to-br from-rose-500/50 via-red-600/40 to-slate-900/80 shadow-[0_0_35px_rgba(244,63,94,0.35)]'
    case 'sky':
    default:
      return 'bg-gradient-to-br from-sky-500/50 via-cyan-600/40 to-slate-900/80 shadow-[0_0_35px_rgba(14,165,233,0.35)]'
  }
})

const badgePingClass = computed(() => {
  switch (props.variant) {
    case 'amber':
      return 'bg-amber-400'
    case 'emerald':
      return 'bg-emerald-400'
    case 'rose':
      return 'bg-rose-400'
    case 'sky':
    default:
      return 'bg-sky-400'
  }
})

const badgeDotClass = computed(() => {
  switch (props.variant) {
    case 'amber':
      return 'bg-amber-400'
    case 'emerald':
      return 'bg-emerald-400'
    case 'rose':
      return 'bg-rose-400'
    case 'sky':
    default:
      return 'bg-sky-400'
  }
})
</script>
