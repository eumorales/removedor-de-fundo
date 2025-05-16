"use client"

import { useEffect, useRef } from "react"

export function PerspectiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.6 // 60vh

      // Ajusta a densidade da grade com base no tamanho da tela
      const isMobile = window.innerWidth < 768
      drawGrid(isMobile)
    }

    const drawGrid = (isMobile: boolean) => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Configurações da grade - ajustadas para mobile
      const gridSize = isMobile ? 25 : 40
      const horizonY = canvas.height * 0.1 // Ponto de fuga mais próximo do topo
      const vanishingPointX = canvas.width * 0.5

      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
      ctx.lineWidth = 1

      // Apenas linhas verticais convergindo para o ponto de fuga
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, canvas.height)
        ctx.lineTo(vanishingPointX + (x - vanishingPointX) * 0.1, horizonY)
        ctx.stroke()
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
}
