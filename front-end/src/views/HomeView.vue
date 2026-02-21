<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section class="relative flex items-center justify-center overflow-hidden" style="min-height: 100vh;">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute inset-0" style="background: linear-gradient(135deg, #0f172a 0%, #0f172a 60%, #0c1a3a 100%);" />
        <svg class="absolute inset-0 w-full h-full" style="opacity:0.04;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div v-for="pin in fakePins" :key="pin.id"
          class="absolute rounded-full"
          :style="`left:${pin.x};top:${pin.y};width:10px;height:10px;background:${pin.color};opacity:0.5;animation:pulse 2s infinite;animation-delay:${pin.delay};box-shadow:0 0 8px ${pin.color};`" />
      </div>

      <div class="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div class="flex items-center justify-center gap-2 mb-8">
          <div style="width:6px;height:6px;border-radius:50%;background:#fcd116;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:white;opacity:0.5;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#ce1126;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#0038a8;"></div>
          <span class="text-xs uppercase tracking-widest mx-2" style="color: #475569;">Philippines</span>
          <div style="width:6px;height:6px;border-radius:50%;background:#0038a8;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#ce1126;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:white;opacity:0.5;"></div>
          <div style="width:6px;height:6px;border-radius:50%;background:#fcd116;"></div>
        </div>

        <h1 class="font-bold text-white mb-6 leading-tight"
          style="font-family:'Playfair Display',serif; font-size: clamp(2.5rem, 8vw, 5rem);">
          Drop Notes
          <br />
          <span style="background: linear-gradient(90deg, #60a5fa, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Anywhere in the 🇵🇭
          </span>
        </h1>

        <p class="text-lg mb-10 mx-auto" style="color: #94a3b8; max-width: 480px; line-height: 1.7;">
          Pin your stories, discoveries, and local knowledge on the map. From hidden beaches to the best silog spots.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/map"
            class="px-8 py-4 rounded-xl font-semibold text-white no-underline transition-all hover:scale-105"
            style="background: #3b82f6; box-shadow: 0 4px 24px rgba(59,130,246,0.4);">
            Explore the Map →
          </router-link>
          <router-link to="/register"
            class="px-8 py-4 rounded-xl font-semibold no-underline transition-all"
            style="border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; background: transparent;"
            @mouseover="(e:any) => e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'"
            @mouseleave="(e:any) => e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'">
            Create Account
          </router-link>
        </div>

        <div class="flex items-center justify-center gap-12 mt-16">
          <div v-for="s in stats" :key="s.label" class="text-center">
            <p class="text-2xl font-bold text-white">{{ s.value }}</p>
            <p class="text-xs uppercase tracking-wider mt-1" style="color: #475569;">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-24 px-4" style="background: #1e293b;">
      <div class="max-w-4xl mx-auto">
        <h2 class="font-bold text-center text-white mb-4 text-3xl" style="font-family:'Playfair Display',serif;">How it works</h2>
        <p class="text-center mb-14" style="color: #64748b;">Leave your mark on the Philippine map.</p>
        <div class="grid grid-cols-1 gap-6" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">
          <div v-for="f in features" :key="f.title"
            class="rounded-xl p-6 text-center transition-all duration-300"
            style="background: #0f172a; border: 1px solid rgba(255,255,255,0.05);"
            @mouseover="(e:any) => e.currentTarget.style.borderColor='rgba(59,130,246,0.3)'"
            @mouseleave="(e:any) => e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'">
            <div class="text-5xl mb-5">{{ f.emoji }}</div>
            <h3 class="font-semibold text-white text-lg mb-2">{{ f.title }}</h3>
            <p class="text-sm leading-relaxed" style="color: #64748b;">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 text-center">
      <h2 class="font-bold text-white mb-4 text-3xl" style="font-family:'Playfair Display',serif;">Ready to drop your first note?</h2>
      <p class="mb-8" style="color: #64748b;">Join Filipinos sharing their local knowledge on the map.</p>
      <router-link to="/register"
        class="inline-block px-10 py-4 rounded-xl font-semibold text-white no-underline transition-all hover:scale-105"
        style="background: #3b82f6; box-shadow: 0 4px 20px rgba(59,130,246,0.3);">
        Get Started Free →
      </router-link>
    </section>

    <footer class="py-8 text-center text-sm" style="border-top: 1px solid rgba(255,255,255,0.05); color: #334155;">
      🇵🇭 PinNote PH — Built with ❤️ for Filipinos
    </footer>
  </div>
</template>

<script setup lang="ts">
const fakePins = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 90 + 5}%`,
  y: `${Math.random() * 80 + 10}%`,
  color: ['#3b82f6','#38bdf8','#fcd116','#ce1126'][Math.floor(Math.random() * 4)],
  delay: `${Math.random() * 3}s`,
}))

const stats = [
  { value: '7,641', label: 'Islands' },
  { value: '82',    label: 'Provinces' },
  { value: '∞',     label: 'Stories' },
]

const features = [
  { emoji: '📍', title: 'Pin Your Location', desc: 'Drop notes at any spot in the Philippines — exact or approximate.' },
  { emoji: '🤝', title: 'Connect Locally',   desc: 'Discover notes from locals and travelers. Like, comment, and save.' },
  { emoji: '🗺️', title: 'Explore the Map',  desc: 'An interactive dark map packed with real stories from real people.' },
]
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%       { transform: scale(1.5); opacity: 0.8; }
}
</style>