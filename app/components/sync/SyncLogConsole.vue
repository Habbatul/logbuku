<template>
  <div class="w-full mt-6 rounded-2xl bg-slate-950/90 border border-white/16 shadow-2xl backdrop-blur-md overflow-hidden text-left font-mono">
    <div class="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/6 border-b border-white/10 select-none cursor-pointer" @click="isExpanded = !isExpanded">
      <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div class="flex items-center gap-1.5 shrink-0">
          <span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500/80"></span>
          <span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-500/80"></span>
          <span class="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500/80"></span>
        </div>
        <div class="text-xs font-bold text-white tracking-wide font-sans flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span class="truncate hidden sm:inline">Log Aktivitas P2P & Diagnostik</span>
          <span class="truncate sm:hidden text-[11px]">Log Aktivitas P2P</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono shrink-0" :class="logs.length > 0 ? 'bg-sky-500/30 text-sky-200 border border-sky-400/30' : 'bg-white/10 text-white/50'">
            <span class="sm:hidden">{{ logs.length }}</span>
            <span class="hidden sm:inline">{{ logs.length }} event</span>
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          @click.stop="copyAllLogs"
          class="px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] sm:text-[11px] font-sans text-white transition-all flex items-center gap-1"
          title="Salin seluruh isi log untuk dilaporkan"
        >
          <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-emerald-300">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-sky-300">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span class="hidden sm:inline">{{ copied ? 'Tersalin!' : 'Salin Log' }}</span>
          <span class="sm:hidden">{{ copied ? 'OK' : 'Salin' }}</span>
        </button>

        <button
          type="button"
          @click.stop="$emit('clear')"
          class="px-2 sm:px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-[10px] sm:text-[11px] font-sans text-white/70 hover:text-white transition-all"
          title="Bersihkan log"
        >
          <span class="hidden sm:inline">Bersihkan</span>
          <span class="sm:hidden">Hapus</span>
        </button>

        <button
          type="button"
          class="p-1 sm:p-1.5 rounded-lg text-white/60 hover:text-white transition-colors"
          :title="isExpanded ? 'Sembunyikan' : 'Buka'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-200" :class="{ 'rotate-180': isExpanded }">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>

    <div class="px-3 sm:px-4 py-2 bg-black/40 border-b border-white/6 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px]">
      <div class="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg sm:rounded-none min-w-0">
        <span class="text-white/50 uppercase tracking-wider font-sans font-semibold shrink-0">Peran:</span>
        <span class="px-1.5 py-0.5 rounded font-bold uppercase truncate" :class="roleBadgeClass">
          {{ role || 'Belum Dipilih' }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg sm:rounded-none min-w-0">
        <span class="text-white/50 uppercase tracking-wider font-sans font-semibold shrink-0">PeerConn:</span>
        <span class="px-1.5 py-0.5 rounded font-bold uppercase truncate" :class="stateBadgeClass(peerConnectionState)">
          {{ peerConnectionState }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg sm:rounded-none min-w-0">
        <span class="text-white/50 uppercase tracking-wider font-sans font-semibold shrink-0">ICE:</span>
        <span class="px-1.5 py-0.5 rounded font-bold uppercase truncate" :class="stateBadgeClass(iceConnectionState)">
          {{ iceConnectionState }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 bg-white/5 sm:bg-transparent px-2 py-1 sm:p-0 rounded-lg sm:rounded-none min-w-0">
        <span class="text-white/50 uppercase tracking-wider font-sans font-semibold shrink-0">Channel:</span>
        <span class="px-1.5 py-0.5 rounded font-bold uppercase truncate" :class="stateBadgeClass(dataChannelState)">
          {{ dataChannelState }}
        </span>
      </div>
    </div>

    <div v-show="isExpanded" class="p-2 sm:p-3 bg-slate-950 max-h-56 sm:max-h-80 overflow-y-auto custom-scrollbar space-y-1" ref="logContainerRef">
      <div v-if="logs.length === 0" class="py-6 text-center text-white/40 text-xs italic font-sans px-4">
        Belum ada log aktivitas. Mulai mode pengirim atau penerima untuk melihat proses WebRTC secara real-time.
      </div>

      <div
        v-for="item in logs"
        :key="item.id"
        class="text-[11px] leading-relaxed flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 hover:bg-white/5 px-2 py-1 sm:py-0.5 rounded transition-colors border-b border-white/5 sm:border-transparent"
      >
        <div class="flex items-center gap-1.5 shrink-0 select-none">
          <span class="text-white/40 font-mono text-[10px] sm:text-[11px]">{{ formatTimestamp(item.timestamp) }}</span>
          <span class="shrink-0 px-1 py-0.2 rounded text-[9px] sm:text-[10px] font-bold" :class="categoryBadgeClass(item.category)">
            [{{ item.category }}]
          </span>
        </div>

        <div class="flex-1 min-w-0 break-words" :class="messageColorClass(item.level)">
          <span class="break-words">{{ item.message }}</span>
          <div v-if="item.details" class="block text-[10px] text-white/50 mt-1 p-2 rounded bg-black/40 border border-white/10 whitespace-pre-wrap font-sans overflow-x-auto max-w-full">
            {{ formatDetails(item.details) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { SyncLogEntry } from '~/types/sync'

const props = withDefaults(
  defineProps<{
    logs: SyncLogEntry[]
    role?: string | null
    peerConnectionState?: string
    iceConnectionState?: string
    dataChannelState?: string
    initialExpanded?: boolean
  }>(),
  {
    role: null,
    peerConnectionState: 'new',
    iceConnectionState: 'new',
    dataChannelState: 'closed',
    initialExpanded: true
  }
)

defineEmits<{
  (e: 'clear'): void
}>()

const isExpanded = ref(props.initialExpanded)
const copied = ref(false)
const logContainerRef = ref<HTMLDivElement | null>(null)

const roleBadgeClass = computed(() => {
  if (props.role === 'sender') return 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
  if (props.role === 'receiver') return 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
  return 'bg-white/10 text-white/60'
})

const stateBadgeClass = (state: string) => {
  switch (state?.toLowerCase()) {
    case 'connected':
    case 'open':
    case 'completed':
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
    case 'connecting':
    case 'checking':
    case 'gathering':
      return 'bg-sky-500/20 text-sky-300 border border-sky-400/30 animate-pulse'
    case 'failed':
    case 'disconnected':
      return 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
    case 'closed':
    case 'closing':
      return 'bg-white/10 text-white/50'
    default:
      return 'bg-white/10 text-white/70'
  }
}

const categoryBadgeClass = (cat: SyncLogEntry['category']) => {
  switch (cat) {
    case 'ICE':
      return 'bg-sky-500/20 text-sky-300'
    case 'SDP':
      return 'bg-purple-500/20 text-purple-300'
    case 'CHANNEL':
      return 'bg-emerald-500/20 text-emerald-300'
    case 'TRANSFER':
      return 'bg-amber-500/20 text-amber-300'
    case 'DB':
      return 'bg-cyan-500/20 text-cyan-300'
    case 'ROLE':
      return 'bg-indigo-500/20 text-indigo-300'
    case 'CONN':
    default:
      return 'bg-slate-700 text-slate-200'
  }
}

const messageColorClass = (level: SyncLogEntry['level']) => {
  switch (level) {
    case 'error':
      return 'text-rose-400 font-bold'
    case 'warn':
      return 'text-amber-300'
    case 'success':
      return 'text-emerald-300'
    case 'info':
    default:
      return 'text-white/90'
  }
}

const formatTimestamp = (ts: string) => {
  if (!ts) return ''
  return ts.split('.')[0] || ts
}

const formatDetails = (details: any) => {
  if (typeof details === 'string') return details
  try {
    return JSON.stringify(details, null, 2)
  } catch {
    return String(details)
  }
}

watch(
  () => props.logs.length,
  async () => {
    if (isExpanded.value) {
      await nextTick()
      if (logContainerRef.value) {
        logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight
      }
    }
  }
)

const copyAllLogs = async () => {
  if (!props.logs.length) return
  const text = props.logs
    .map((l) => `[${l.timestamp}] [${l.category}] (${l.level.toUpperCase()}) ${l.message}${l.details ? '\n  ' + formatDetails(l.details) : ''}`)
    .join('\n')

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.warn('[SyncLogConsole] Failed to copy logs:', err)
  }
}
</script>
