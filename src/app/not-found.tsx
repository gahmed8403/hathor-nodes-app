import { Button, Container } from '@/components/ui/primitives'
import { LogoMark } from '@/components/logo'

export default function NotFound() {
  return (
    <Container className="grid min-h-[60vh] place-content-center py-24 text-center">
      <LogoMark className="mx-auto h-14 w-14 opacity-80" />
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-sun-300">404 · Lost in the desert</p>
      <h1 className="mt-4 font-display text-5xl text-mist-50">This page isn’t on the map.</h1>
      <p className="mt-4 text-mist-400">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href="/resources/osmosis" variant="secondary">
          Browse resources
        </Button>
      </div>
    </Container>
  )
}
