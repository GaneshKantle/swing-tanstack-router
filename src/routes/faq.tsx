import { createFileRoute } from '@tanstack/react-router'
import FAQ from '@/pages/FAQ'

export const Route = createFileRoute('/faq')({
  component: FAQ,
})
