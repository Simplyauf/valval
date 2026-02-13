'use client'

import { useState, useRef, useEffect } from 'react'

export default function Page() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [heartPositions, setHeartPositions] = useState<Array<{ left: number; top: number; size: number; delay: number }>>([])
  const [confettiPositions, setConfettiPositions] = useState<Array<{ left: number; top: number; size: number; delay: number; emoji: string }>>([])
  const [mounted, setMounted] = useState(false)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    // Generate random heart positions on client only
    const hearts = [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 20 + Math.random() * 40,
      delay: i * 0.3,
    }))
    setHeartPositions(hearts)
  }, [])

  useEffect(() => {
    if (showSuccess && mounted) {
      // Generate confetti positions on client only when success is shown
      const confetti = [...Array(30)].map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 30 + Math.random() * 50,
        delay: i * 0.1,
        emoji: ['💕', '💖', '💗', '✨', '🌹', '💐', '🎊', '🎉', '💋'][Math.floor(Math.random() * 9)],
      }))
      setConfettiPositions(confetti)
    }
  }, [showSuccess, mounted])

  useEffect(() => {
    if (!showSuccess && mounted) {
      const interval = setInterval(() => {
        if (!noButtonRef.current || !containerRef.current) return
        
        const container = containerRef.current.getBoundingClientRect()
        const randomX = Math.random() * (container.width - 120)
        const randomY = Math.random() * (container.height - 60)
        
        setNoButtonPos({ x: randomX, y: randomY })
      }, 500)
      
      return () => clearInterval(interval)
    }
  }, [showSuccess, mounted])

  const handleNoAttempt = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!noButtonRef.current || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const randomX = Math.random() * (container.width - 120)
    const randomY = Math.random() * (container.height - 60)

    setNoButtonPos({ x: randomX, y: randomY })
  }

  const handleYes = () => {
    setShowSuccess(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 flex items-center justify-center"
    >
      {/* Floating hearts background */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {heartPositions.map((heart, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                animationDelay: `${heart.delay}s`,
                fontSize: `${heart.size}px`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {!showSuccess ? (
          <div className="space-y-8 animate-in fade-in duration-1000">
            {/* Question */}
            <div className="space-y-4">
              <div className="text-7xl md:text-8xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                💕
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-primary drop-shadow-lg">
                Do you want to be
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary drop-shadow-lg">
                my Val, precious?
              </h2>
              <p className="text-lg md:text-2xl text-primary/80 font-medium mt-6">
                (hint: there's only one right answer)
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-6 justify-center mt-12 relative h-32 md:h-40">
              {/* Yes button */}
              <button
                onClick={handleYes}
                className="px-12 md:px-16 py-6 md:py-8 bg-gradient-to-r from-primary to-secondary text-white text-2xl md:text-3xl font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer hover:-rotate-3"
              >
                YES 💗
              </button>

              {/* No button (runs away - unclickable) */}
              <button
                ref={noButtonRef}
                onMouseEnter={handleNoAttempt}
                onMouseMove={handleNoAttempt}
                onClick={handleNoAttempt}
                onTouchStart={handleNoAttempt}
                disabled
                className="fixed px-8 md:px-12 py-5 md:py-6 bg-white text-primary text-lg md:text-2xl font-bold rounded-full shadow-xl border-2 border-primary transition-all duration-200 pointer-events-auto"
                style={{
                  left: `${noButtonPos.x}px`,
                  top: `${noButtonPos.y}px`,
                  transform: 'translateX(-50%)',
                }}
              >
                no...
              </button>
            </div>
          </div>
        ) : (
          /* Success message - Beautiful display */
          <div className="space-y-12 animate-in zoom-in duration-700">
            {/* Confetti effect */}
            {mounted && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {confettiPositions.map((confetti, i) => (
                  <div
                    key={i}
                    className="absolute animate-pulse"
                    style={{
                      left: `${confetti.left}%`,
                      top: `${confetti.top}%`,
                      animationDelay: `${confetti.delay}s`,
                      fontSize: `${confetti.size}px`,
                    }}
                  >
                    {confetti.emoji}
                  </div>
                ))}
              </div>
            )}

            {/* Main success content */}
            <div className="relative z-10">
              <div className="text-8xl md:text-9xl mb-8 animate-bounce" style={{ animationDuration: '1.5s' }}>
                💖
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-primary drop-shadow-lg mb-6">
                YES, PRECIOUS!
              </h1>
              <div className="space-y-6">

                <p className="text-4xl md:text-5xl text-primary font-bold mt-8 animate-bounce delay-1000">
                  Muah 💋
                </p>
              </div>
            </div>

            {/* Decorative hearts at bottom */}
            <div className="flex justify-center gap-6 text-6xl">
              <span className="animate-pulse">💕</span>
              <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>💖</span>
              <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>💗</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
