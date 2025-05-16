"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, Download, RefreshCw, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset states
    setProcessedImage(null)
    setError(null)

    // Read and display the original image
    const reader = new FileReader()
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string)
      processImage(file)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)

    try {
      // Animate progress for better visual feedback
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Create form data for the API request
      const formData = new FormData()
      formData.append("image_file", file)

      // Call the API to remove background
      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Falha ao processar a imagem. Isso pode ser devido ao tamanho ou resolução da imagem estar fora dos limites aceitáveis. Tente usar uma imagem com tamanho e resolução adequados.")
      }

      const data = await response.json()
      setProgress(100)

      setTimeout(() => {
        setProcessedImage(data.imageUrl)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao processar a imagem. Isso pode ser devido ao tamanho ou resolução da imagem estar fora dos limites aceitáveis. Tente usar uma imagem com tamanho e resolução adequados.")
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = "imagem-sem-fundo.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
  }

  useEffect(() => {
    if (isProcessing && progress < 100) {
      const randomIncrement = () => {
        setProgress((prev) => {
          if (prev >= 95) return prev
          return Math.min(95, prev + Math.random() * 5)
        })
      }

      const interval = setInterval(randomIncrement, 300)
      return () => clearInterval(interval)
    }
  }, [isProcessing, progress])

  return (
    <div className="w-full transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300">
        <CardContent className="p-4 sm:p-6">
          {!originalImage ? (
            <div
              className="flex flex-col items-center justify-center p-6 sm:p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 transition-all duration-300 hover:border-gray-400"
              style={{
                animation: "pulse 2s infinite ease-in-out",
              }}
            >
              <div className="transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
                É fácil! Arraste sua imagem ou clique para enviar.
              </p>
              <div className="transition-transform duration-300 hover:scale-105">
                <Button
                  className="relative overflow-hidden group text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4 touch-manipulation"
                  style={{ backgroundColor: "#FFAA00", borderColor: "#FFAA00" }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Imagem
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {isProcessing ? (
                <div className="space-y-3 sm:space-y-4 py-6 sm:py-8">
                  <p className="text-center text-sm sm:text-base text-gray-700 animate-pulse">
                    Processando sua imagem...
                  </p>
                  <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 background-animate"
                      style={{
                        width: `${progress}%`,
                        transition: "width 0.5s ease-in-out",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite linear",
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 shimmer-effect"></div>
                    </div>
                  </div>
                  <p
                    className="text-center text-xs sm:text-sm text-gray-500"
                    style={{
                      animation: "fadeIn 0.5s ease-in-out",
                    }}
                  >
                    {Math.round(progress)}%
                  </p>
                </div>
              ) : (
                <>
                  {error ? (
                    <div className="text-center text-red-500 py-4 animate-fade-in">
                      <p className="text-sm sm:text-base">{error}</p>
                      <div className="transition-transform duration-300 hover:scale-105 mt-4">
                        <Button variant="outline" onClick={handleReset} className="text-sm sm:text-base">
                          Tentar novamente
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
                      <div className="space-y-2 transition-all duration-300 hover:translate-y-[-5px]">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Imagem Original</p>
                        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                          {originalImage && (
                            <img
                              src={originalImage || "/placeholder.svg"}
                              alt="Imagem original"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 transition-all duration-300 hover:translate-y-[-5px]">
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Imagem Editada</p>
                        <div className="aspect-square relative bg-transparent bg-grid-pattern rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
                          {processedImage && (
                            <img
                              src={processedImage || "/placeholder.svg"}
                              alt="Imagem sem fundo"
                              className="w-full h-full object-contain"
                              style={{
                                animation: "fadeIn 1s ease-in-out",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {processedImage && !isProcessing && (
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in">
                  <div className="transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                    <Button
                      onClick={handleDownload}
                      className="w-full relative overflow-hidden group text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Imagem
                    </Button>
                  </div>
                  <div className="transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full hover:bg-gray-100 hover:text-gray-800 text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Nova Imagem
                    </Button>
                  </div>
                </div>
              )}

              {!processedImage && !isProcessing && !error && (
                <div className="flex justify-center animate-fade-in">
                  <div className="transition-transform duration-300 hover:scale-105 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full hover:bg-gray-100 hover:text-gray-800 text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
