import { Metadata } from 'next'
import ServicesLandingClient from '@/components/ServicesLandingClient'

export const metadata: Metadata = {
  // Root layout supplies template "%s | MyndZeal"
  title: 'Services',
  description: 'Explore all mental health and wellbeing services offered by MyndZeal.'
}

export default function ServicesLandingPage() {
  return <ServicesLandingClient />
}
