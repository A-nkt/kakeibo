<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
    <!-- Hero Section -->
    <HeroSection @cta-click="navigateToLogin" />

    <!-- Features Section -->
    <FeaturesSection />

    <!-- Middle CTA Section -->
    <CtaSection
      message="今すぐ無料で始めよう"
      button-text="Googleで無料登録"
      @cta-click="navigateToLogin"
    />

    <!-- Differentiation Section -->
    <DifferentiationSection />

    <!-- How It Works Section -->
    <HowItWorksSection />

    <!-- Bottom CTA Section -->
    <CtaSection
      message="ずっと無料。今すぐ始めよう。"
      button-text="今すぐ無料で始める"
      @cta-click="navigateToLogin"
    />

    <!-- Footer Section -->
    <FooterSection :links="footerLinks" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeroSection from './HeroSection.vue'
import FeaturesSection from './FeaturesSection.vue'
import DifferentiationSection from './DifferentiationSection.vue'
import HowItWorksSection from './HowItWorksSection.vue'
import CtaSection from './CtaSection.vue'
import FooterSection from './FooterSection.vue'

// Router for navigation
const router = useRouter()

// Navigate to login page on CTA click
const navigateToLogin = () => {
  router.push('/login')
}

// Footer links
const footerLinks = [
  { label: 'ログイン', href: '/login' },
  { label: 'プライバシーポリシー（準備中）', href: '#' },
  { label: '利用規約（準備中）', href: '#' }
]
</script>
