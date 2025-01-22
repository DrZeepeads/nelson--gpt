import Layout from '@/components/layout'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'

export default function Home() {
  return (
    <>
      <ServiceWorkerRegistration />
      <Layout />
    </>
  )
}

