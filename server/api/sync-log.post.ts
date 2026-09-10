export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const role = (body?.role || 'P2P').toUpperCase()
    const cat = body?.category || 'LOG'
    const msg = body?.message || ''
    const time = body?.timestamp || new Date().toTimeString().split(' ')[0]

    const roleColor = role === 'SENDER' ? '\x1b[33m' : role === 'RECEIVER' ? '\x1b[36m' : '\x1b[35m'
    const reset = '\x1b[0m'
    const dim = '\x1b[2m'
    const bright = '\x1b[1m'

    console.log(`${dim}[${time}]${reset} ${bright}${roleColor}[LogBuku ${role}:${cat}]${reset} ${msg}`)
  } catch {
  }

  return { ok: true }
})
