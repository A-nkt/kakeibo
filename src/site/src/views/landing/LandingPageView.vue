<script setup lang="ts">
import { useRouter } from 'vue-router'
import LandingHeader from './LandingHeader.vue'
import HeroSection from './HeroSection.vue'
import FactsStrip from './FactsStrip.vue'
import FeaturesSection from './FeaturesSection.vue'
import DifferentiationSection from './DifferentiationSection.vue'
import HowItWorksSection from './HowItWorksSection.vue'
import CtaSection from './CtaSection.vue'
import FooterSection from './FooterSection.vue'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const footerLinks = [
  { label: 'ログイン', href: '/login' },
  { label: 'プライバシーポリシー（準備中）', href: '#' },
  { label: '利用規約（準備中）', href: '#' },
]
</script>

<template>
  <div class="min-h-screen scroll-smooth bg-paper font-gothic text-ink antialiased">
    <LandingHeader @cta-click="navigateToLogin" />

    <HeroSection @cta-click="navigateToLogin" />

    <!-- 事実だけを大きく並べる帯 -->
    <FactsStrip />

    <FeaturesSection />

    <!-- 中盤の CTA は細い帯にして、末尾の締めと役割を分ける -->
    <CtaSection
      variant="inline"
      message="今すぐ無料で始めよう"
      button-text="Googleで無料登録"
      @cta-click="navigateToLogin"
    />

    <DifferentiationSection />

    <HowItWorksSection />

    <CtaSection
      variant="full"
      message="ずっと無料。今すぐ始めよう。"
      button-text="今すぐ無料で始める"
      @cta-click="navigateToLogin"
    />

    <FooterSection :links="footerLinks" />
  </div>
</template>
