<template>
  <component
    :is="as"
    ref="containerRef"
    class="liquid-glass-card group"
    :class="[
      (customClass && (customClass.includes('sticky') || customClass.includes('fixed') || customClass.includes('absolute'))) ? '' : 'relative',
      padded ? 'p-5 sm:p-6' : '',
      interactive ? 'cursor-pointer transition-transform duration-200 hover:-translate-y-0.5' : '',
      customClass
    ]"
    :style="cardInlineStyles"
  >
    <canvas
      v-if="mode === 'webgl' && webglSupported"
      ref="glCanvasRef"
      class="pointer-events-none absolute inset-0 z-0 h-full w-full block rounded-[inherit] overflow-hidden transition-opacity duration-300"
      :style="canvasDropShadowStyle"
      aria-hidden="true"
    ></canvas>

    <div
      v-else
      class="pointer-events-none absolute inset-0 z-0 rounded-[inherit] overflow-hidden transition-all duration-300"
      :style="cssGlassSurfaceStyle"
      aria-hidden="true"
    >
      <div
        v-if="refraction > 0"
        class="absolute inset-0 rounded-[inherit] pointer-events-none"
        :style="bevelSheenStyle"
      ></div>
    </div>

    <div class="relative z-10 w-full" :class="contentClass">
      <div v-if="$slots.header" class="mb-4">
        <slot name="header" />
      </div>

      <slot />

      <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-white/10">
        <slot name="footer" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  as?: string
  mode?: 'webgl' | 'css'
  blur?: number
  blurType?: 'gaussian' | 'frosted' | 'crystal' | 'diffuse'
  refraction?: number
  bezel?: number
  dispersion?: number
  radius?: number
  tintColor?: string
  tintOpacity?: number
  prismColor?: string
  glow?: number
  caustics?: number
  specular?: number
  glint?: number
  shadowSize?: number
  shadowOpacity?: number
  padded?: boolean
  interactive?: boolean
  customClass?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  mode: 'webgl',
  blur: 25.0,
  blurType: 'gaussian',
  refraction: 19.0,
  bezel: 56.0,
  dispersion: 12.0,
  radius: 20,
  tintColor: '#0f172a',
  tintOpacity: 0.2,
  prismColor: '',
  glow: 0.15,
  caustics: 0.0,
  specular: 0.15,
  glint: 0.15,
  shadowSize: 20.0,
  shadowOpacity: 0.30,
  padded: false,
  interactive: false,
  customClass: '',
  contentClass: ''
})

const containerRef = ref<HTMLElement | null>(null)
const glCanvasRef = ref<HTMLCanvasElement | null>(null)
const webglSupported = ref<boolean>(true)

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let bgTexture: WebGLTexture | null = null
let offscreenCanvas: HTMLCanvasElement | null = null
let resizeObserver: ResizeObserver | null = null

const hexToRgb = (hex: string): [number, number, number] => {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const num = parseInt(c, 16)
  if (isNaN(num)) return [15 / 255, 23 / 255, 42 / 255]
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255
  ]
}

const hexToRgba = (hex: string, alpha: number): string => {
  let c = hex.replace('#', '')
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('')
  }
  const num = parseInt(c, 16)
  if (isNaN(num)) return `rgba(15, 23, 42, ${alpha})`
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const cardInlineStyles = computed(() => ({
  borderRadius: `${props.radius}px`
}))

const cssGlassSurfaceStyle = computed(() => {
  const bgRgba = hexToRgba(props.tintColor, props.tintOpacity)
  const blurPx = props.blurType === 'crystal' ? 0 : props.blur
  const sSize = props.shadowSize
  const sOpacity = props.shadowOpacity
  const specAlpha = props.specular !== undefined ? props.specular : (props.glint ?? 0.15)
  const glowAlpha = props.glow ?? 0.15
  const bSize = props.bezel

  return {
    backgroundColor: bgRgba,
    backdropFilter: `blur(${blurPx}px)`,
    WebkitBackdropFilter: `blur(${blurPx}px)`,
    border: props.radius === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
    boxShadow: `
      inset 0 1px 1.5px 0 rgba(255, 255, 255, ${specAlpha * 1.6}),
      inset 0 0 ${bSize * 0.4}px 0 rgba(255, 255, 255, ${glowAlpha * 0.25}),
      0 ${sSize * 0.4}px ${sSize}px -${sSize * 0.2}px rgba(0, 0, 0, ${sOpacity})
    `
  }
})

const canvasDropShadowStyle = computed(() => {
  const bgRgba = hexToRgba(props.tintColor, props.tintOpacity)
  const blurPx = props.blurType === 'crystal' ? 0 : props.blur
  const sSize = props.shadowSize
  const sOpacity = props.shadowOpacity

  return {
    backgroundColor: bgRgba,
    backdropFilter: `blur(${blurPx}px)`,
    WebkitBackdropFilter: `blur(${blurPx}px)`,
    border: props.radius === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
    boxShadow: `0 ${sSize * 0.4}px ${sSize}px -${sSize * 0.2}px rgba(0, 0, 0, ${sOpacity})`
  }
})

const bevelSheenStyle = computed(() => {
  const b = props.bezel
  const g = props.glow ?? 0.15
  return {
    boxShadow: `inset 0 0 ${b * 0.5}px 0 rgba(255, 255, 255, ${g * 0.25})`,
    background: 'radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.04) 0%, transparent 70%)'
  }
})

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_corner_radius;
  uniform float u_bezel_width;
  uniform float u_refraction;
  uniform float u_dispersion;
  uniform vec3 u_glass_tint;
  uniform float u_tint_opacity;
  uniform vec3 u_prism_color;
  uniform float u_use_prism_color;
  uniform float u_glow;
  uniform float u_caustics;
  uniform float u_specular;
  uniform float u_dpr;
  varying vec2 v_uv;

  float sdRoundedBox(vec2 p, vec2 b, float r) {
    float safeR = clamp(r, 0.0, min(b.x, b.y) - 1.0);
    vec2 q = abs(p) - b + safeR;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - safeR;
  }

  vec2 getNormal(vec2 p, vec2 b, float r) {
    float eps = 1.0;
    float d = sdRoundedBox(p, b, r);
    float dx = sdRoundedBox(p + vec2(eps, 0.0), b, r) - d;
    float dy = sdRoundedBox(p + vec2(0.0, eps), b, r) - d;
    vec2 n = vec2(dx, dy);
    float len = length(n);
    if (len < 0.0001) return vec2(0.0, 1.0);
    return n / len;
  }

  void main() {
    vec2 pixelCoord = v_uv * u_resolution;
    vec2 p = pixelCoord - u_resolution * 0.5;
    vec2 halfSize = u_resolution * 0.5;
    float dist = sdRoundedBox(p, halfSize, u_corner_radius);

    if (dist > 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float depth = -dist;
    vec2 lightDir = normalize(vec2(-0.55, 0.75));
    vec3 outColor = vec3(0.0);
    float outAlpha = 0.0;

    if (depth <= u_bezel_width) {
      float t = 1.0 - (depth / u_bezel_width);
      float convexCurve = pow(t, 2.0);
      vec2 normal = getNormal(p, halfSize, u_corner_radius);

      // 1. Specular rim highlight
      float specDot = max(0.0, dot(normal, lightDir));
      float rimDepthMask = clamp(1.0 - depth / (7.0 * u_dpr), 0.0, 1.0);
      float sharpSheen = pow(specDot, 28.0) * pow(t, 8.0) * rimDepthMask * 2.5 * u_specular;
      float rimCrest = pow(t, 12.0) * clamp(1.0 - depth / (4.5 * u_dpr), 0.0, 1.0) * (specDot * 0.7 + 0.3) * 1.5 * u_specular;
      float totalSpecular = sharpSheen + rimCrest;

      // 2. Prism chromatic dispersion & liquid curvature along the bezel
      float refrFactor = (u_refraction / 40.0) * pow(t, 2.5);
      float dispFactor = (u_dispersion / 12.0);
      float normalAngle = dot(normal, vec2(0.707, 0.707));

      float specR = sin(normalAngle * 3.14159 + 0.0) * 0.5 + 0.5;
      float specG = sin(normalAngle * 3.14159 + 2.094) * 0.5 + 0.5;
      float specB = sin(normalAngle * 3.14159 + 4.188) * 0.5 + 0.5;
      vec3 spectralBase = vec3(specR, specG, specB);
      if (u_use_prism_color > 0.5) {
        spectralBase = mix(spectralBase, u_prism_color, 0.70);
      }
      vec3 prismRainbow = spectralBase * (refrFactor * dispFactor * 0.65);

      float bevelSheen = pow(t, 3.5) * (0.08 + refrFactor * 0.12);

      float causticConvergence = 0.0;
      if (u_caustics > 0.01) {
        causticConvergence = pow(sin(convexCurve * 3.14159), 2.2) * 0.8 * u_caustics;
      }

      outColor = vec3(totalSpecular) + prismRainbow + vec3(bevelSheen + causticConvergence);
      outAlpha = clamp(totalSpecular + bevelSheen * 1.5 + causticConvergence + (refrFactor * dispFactor * 0.3), 0.0, 0.95);
    }

    // 3. Volumetric internal bloom glow
    if (u_glow > 0.001) {
      float edgeFade = smoothstep(0.0, 14.0 * u_dpr, depth);
      float innerDist = length(p / halfSize);
      float centerGlow = pow(clamp(1.0 - innerDist * 0.65, 0.0, 1.0), 1.5);
      float bevelInnerGlow = pow(clamp(depth / max(u_bezel_width, 1.0), 0.0, 1.0), 0.8);
      float totalInnerGlow = (centerGlow * 0.55 + bevelInnerGlow * 0.45) * edgeFade * u_glow * 0.30;
      vec3 bloomTint = mix(vec3(1.0), u_glass_tint, 0.40);

      outColor += bloomTint * totalInnerGlow;
      outAlpha = max(outAlpha, totalInnerGlow * 0.6);
    }

    gl_FragColor = vec4(outColor, outAlpha);
  }
`

const renderWebGL = () => {
  if (props.mode !== 'webgl' || !glCanvasRef.value) return
  const canvas = glCanvasRef.value
  const rect = canvas.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  if (!gl) {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false })
    if (!gl) {
      webglSupported.value = false
      return
    }

    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, vertexShaderSource)
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, fragmentShaderSource)
    gl.compileShader(fs)

    program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]),
      gl.STATIC_DRAW
    )

    const aPos = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = Math.round(rect.width * dpr)
  const height = Math.round(rect.height * dpr)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    gl.viewport(0, 0, width, height)
  }

  gl.clearColor(0.0, 0.0, 0.0, 0.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program!)
  gl.uniform2f(gl.getUniformLocation(program!, 'u_resolution'), width, height)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_corner_radius'), props.radius * dpr)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_bezel_width'), props.bezel * dpr)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_refraction'), props.refraction)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_dispersion'), props.dispersion)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_dpr'), dpr)

  const [tR, tG, tB] = hexToRgb(props.tintColor)
  gl.uniform3f(gl.getUniformLocation(program!, 'u_glass_tint'), tR, tG, tB)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_tint_opacity'), props.tintOpacity)

  if (props.prismColor) {
    const [pR, pG, pB] = hexToRgb(props.prismColor)
    gl.uniform3f(gl.getUniformLocation(program!, 'u_prism_color'), pR, pG, pB)
    gl.uniform1f(gl.getUniformLocation(program!, 'u_use_prism_color'), 1.0)
  } else {
    gl.uniform3f(gl.getUniformLocation(program!, 'u_prism_color'), 1.0, 1.0, 1.0)
    gl.uniform1f(gl.getUniformLocation(program!, 'u_use_prism_color'), 0.0)
  }

  gl.uniform1f(gl.getUniformLocation(program!, 'u_glow'), props.glow)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_caustics'), props.caustics)
  gl.uniform1f(gl.getUniformLocation(program!, 'u_specular'), props.specular)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

let renderPending = false
const scheduleRender = () => {
  if (renderPending) return
  renderPending = true
  requestAnimationFrame(() => {
    renderPending = false
    renderWebGL()
  })
}

watch(
  () => [
    props.mode,
    props.blur,
    props.blurType,
    props.refraction,
    props.bezel,
    props.dispersion,
    props.radius,
    props.tintColor,
    props.tintOpacity,
    props.prismColor,
    props.glow,
    props.caustics,
    props.specular
  ],
  () => {
    if (props.mode === 'webgl') {
      scheduleRender()
    }
  },
  { deep: true }
)

onMounted(() => {
  if (props.mode === 'webgl') {
    scheduleRender()
    setTimeout(() => scheduleRender(), 60)
  }
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (props.mode === 'webgl') scheduleRender()
    })
    resizeObserver.observe(containerRef.value)
  }
  window.addEventListener('resize', scheduleRender)
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
  window.removeEventListener('resize', scheduleRender)
})
</script>

<style scoped>
.liquid-glass-card {
  isolation: isolate;
  background: transparent;
}
</style>
