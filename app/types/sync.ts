export type SyncRole = 'sender' | 'receiver' | null

export type SyncStatus = 
  | 'idle'
  | 'waiting'
  | 'connecting'
  | 'connected'
  | 'transferring'
  | 'verifying'
  | 'completed'
  | 'error'

export interface TransferStats {
  totalBooks: number
  totalReadSessions: number
  totalPagesRead: number
  totalBytes: number
  transferredBytes: number
  percentage: number
  speedBps: number
  timeRemainingSec?: number
}

export interface P2PDataPayload {
  app: 'LogBuku'
  version: number
  exportedAt: string
  checksum: string
  stats: {
    totalBooks: number
    totalReadSessions: number
    totalPagesRead: number
    totalCompletedBooks: number
  }
  books: any[]
}

export interface SignalingMessage {
  app: 'LogBuku'
  type: 'offer' | 'answer'
  sdp: string
}

export interface ChunkMessage {
  type: 'CHUNK'
  index: number
  total: number
  chunk: string
}

export interface MetadataMessage {
  type: 'METADATA'
  stats: P2PDataPayload['stats']
  totalBytes: number
  totalChunks: number
  checksum: string
}

export interface ControlMessage {
  type: 'HANDSHAKE' | 'READY' | 'TRANSFER_COMPLETE' | 'TRANSFER_RECEIVED_ACK' | 'IMPORT_CONFIRMED' | 'CANCEL'
  payload?: any
}

export interface SyncLogEntry {
  id: string
  timestamp: string
  level: 'info' | 'success' | 'warn' | 'error'
  category: 'ROLE' | 'ICE' | 'SDP' | 'CONN' | 'CHANNEL' | 'TRANSFER' | 'DB'
  message: string
  details?: any
}
