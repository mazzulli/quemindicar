"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { viewRatings } from "@/lib/actions/ratings"
import { Rating } from "@prisma/client"

interface Review {
  id: number
  name: string
  avatar?: string
  rating: number
  comment: string
  date: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Maria Silva",
    rating: 5,
    comment:
      "Excelente atendimento! Superou todas as minhas expectativas. A equipe foi muito profissional e o resultado final ficou perfeito.",
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "João Santos",
    rating: 4,
    comment: "Muito bom serviço, entrega no prazo e qualidade excepcional. Recomendo para todos que buscam excelência.",
    date: "2024-01-10",
  },
  {
    id: 3,
    name: "Ana Costa",
    rating: 5,
    comment:
      "Simplesmente incrível! Não poderia estar mais satisfeita com o resultado. Voltarei a fazer negócios com certeza.",
    date: "2024-01-08",
  },
  {
    id: 4,
    name: "Pedro Oliveira",
    rating: 5,
    comment: "Atendimento personalizado e resultado além do esperado. A atenção aos detalhes fez toda a diferença.",
    date: "2024-01-05",
  },
  {
    id: 5,
    name: "Carla Mendes",
    rating: 4,
    comment: "Profissionais competentes e dedicados. O projeto foi executado com muito cuidado e precisão.",
    date: "2024-01-02",
  },
]

interface ReviewsModalProps {
  isOpen: boolean
  id: number | null
  onClose: () => void
}

export function ReviewsModal({ isOpen, id, onClose }: ReviewsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviews, setReviews] = useState<Rating[]>([])
  const [isLoading, setIsLoading] = useState(false) // Nova variável para controle de carregamento
  const [error, setError] = useState<string | null>(null)

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToReview = (index: number) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn("w-5 h-5", i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")}
      />
    ))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const fetchReviews = async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await viewRatings(id) // Busca avaliações pelo id
      if (error) throw error

      setReviews(data || [])
      setCurrentIndex(0) // Reset para primeira avaliação
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err)
      setError("Erro ao carregar avaliações")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && id) {
      fetchReviews()
    }
  }, [isOpen, id])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-4/5 max-w-2xl">
        <DialogHeader className="w-full">
          <DialogTitle className="text-2xl font-bold text-center">Avaliações dos Clientes</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-gray-500">Carregando avaliações...</span> 
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-red-500">{error}</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex justify-center items-center h-48">
            <span className="text-gray-500">Nenhuma avaliação disponível.</span>
          </div>
        ) : (
        <div className="relative">
          {/* Card da avaliação atual */}
          <Card className="min-h-[300px] min-w-4/5">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4 w-2/3 mx-auto">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {getInitials(reviews[currentIndex]?.reviewerName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-xl font-semibold text-foreground">{reviews[currentIndex]?.reviewerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(reviews[currentIndex]?.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="flex items-center space-x-1">{renderStars(reviews[currentIndex]?.rating)}</div>

                <blockquote className="text-lg text-foreground leading-relaxed max-w-md">
                  {reviews[currentIndex]?.comment}
                </blockquote>
              </div>
            </CardContent>
          </Card>

          {/* Botões de navegação */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-transparent"
            onClick={prevReview}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-transparent"
            onClick={nextReview}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        )}

        {/* Indicadores de posição */}
        <div className="flex justify-center space-x-2 mt-4">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToReview(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentIndex ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        {/* Contador */}
        <div className="text-center text-sm text-muted-foreground">          
          {reviews.length > 0 ?
            <p>{currentIndex + 1} de {reviews.length} avaliações</p>
            :
            <p>0 de 0 avaliações</p>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}
