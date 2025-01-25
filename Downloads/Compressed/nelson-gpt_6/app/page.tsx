"use client"

import React from 'react'
import dynamic from 'next/dynamic'

const Layout = dynamic(() => import('@/components/layout'), { ssr: false })
const ServiceWorkerRegistration = dynamic(
  () => import('@/components/service-worker-registration').then(mod => mod.ServiceWorkerRegistration),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <ServiceWorkerRegistration />
      <Layout />
    </>
  )
}
