"use client"

import type React from "react"

import { useState } from "react"
import { Star, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface RatingModalProps {
  prestador: {
    id: number
    titulo: string
    subtitulo: string
    foto: string
    categoria: string
  }
  onRatingSubmit: (prestadorId: number, rating: number, comment: string, reviewerName: string) => void
}

export function RatingModal({ prestador, onRatingSubmit }: RatingModalProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStarClick = (starValue: number) => {
    setRating(starValue)
  }

  const handleStarHover = (starValue: number) => {
    setHoverRating(starValue)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma classificação de 1 a 5 estrelas.",
        variant: "destructive",
      })
      return
    }

    if (!reviewerName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu nome.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simular delay de envio
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onRatingSubmit(prestador.id, rating, comment, reviewerName.trim())

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar este prestador de serviços.",
      })

      // Reset form
      setRating(0)
      setHoverRating(0)
      setComment("")
      setReviewerName("")
      setIsOpen(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 transition-all duration-300 hover:scale-105 shadow-lg text-xs h-6 px-2"
        >
          <Star className="w-3 h-3 mr-1" />
          Avaliar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-2xl rounded-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-gradient-to-r from-yellow-400 to-orange-400">
              <Image
                src={prestador.foto || "/placeholder.svg"}
                alt={prestador.titulo}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">{prestador.titulo}</DialogTitle>
              <DialogDescription className="text-gray-600">{prestador.subtitulo}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Sistema de Estrelas */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-700">Sua avaliação</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="group relative p-1 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-200 ${
                      star <= displayRating
                        ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                  {/* Efeito de brilho no hover */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-200 ${
                      star <= displayRating ? "bg-yellow-400/20 animate-pulse" : ""
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-600">
                {displayRating > 0 && (
                  <span className="animate-fade-in">
                    {displayRating === 1 && "Muito ruim"}
                    {displayRating === 2 && "Ruim"}
                    {displayRating === 3 && "Regular"}
                    {displayRating === 4 && "Bom"}
                    {displayRating === 5 && "Excelente"}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Nome do Avaliador */}
          <div className="space-y-2">
            <Label htmlFor="reviewer-name" className="text-sm font-semibold text-gray-700">
              Seu nome *
            </Label>
            <Input
              id="reviewer-name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Digite seu nome..."
              className="border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300"
              required
            />
          </div>

          {/* Comentário */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-semibold text-gray-700">
              Comentário (opcional)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sobre sua experiência com este prestador..."
              rows={4}
              className="border-2 border-gray-200 focus:border-yellow-400 rounded-xl transition-all duration-300 resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Avaliação
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
