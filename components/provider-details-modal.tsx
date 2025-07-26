"use client"

import type React from "react"

import { useState } from "react"
import {
  X,
  Phone,
  Mail,
  Globe,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Star,
  Calendar,
  User,
  Briefcase,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { RatingModal } from "@/components/rating-modal"

interface Provider {
  id: number
  title: string
  subtitle: string | null
  category: {
    id: number
    name: string
  }
  description: string | null
  photoUrl: string | null
  phone: string
  email: string
  address: string | null
  website: string | null
  instagram: string | null
  facebook: string | null
  youtube: string | null
  linkedin: string | null
  tiktok: string | null
  active: boolean
  averageRating: number
  ratingsCount: number
  createdAt?: Date
}

interface ProviderDetailsModalProps {
  provider: Provider
  categoryInfo: {
    cor: string
    icon: string
  }
  onRatingSubmit: (prestadorId: number, rating: number, comment: string, reviewerName: string) => void
  children: React.ReactNode
}

export function ProviderDetailsModal({ provider, categoryInfo, onRatingSubmit, children }: ProviderDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const socialLinks = [
    {
      name: "Instagram",
      value: provider.instagram,
      icon: Instagram,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      url: provider.instagram ? `https://instagram.com/${provider.instagram.replace("@", "")}` : null,
    },
    {
      name: "Facebook",
      value: provider.facebook,
      icon: Facebook,
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      url: provider.facebook ? `https://facebook.com/${provider.facebook}` : null,
    },
    {
      name: "YouTube",
      value: provider.youtube,
      icon: Youtube,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      url: provider.youtube ? `https://youtube.com/@${provider.youtube}` : null,
    },
    {
      name: "LinkedIn",
      value: provider.linkedin,
      icon: Linkedin,
      color: "bg-gradient-to-r from-blue-700 to-blue-800",
      url: provider.linkedin ? `https://linkedin.com/in/${provider.linkedin}` : null,
    },
  ].filter((social) => social.value)

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Data não disponível"
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Header com foto de fundo */}
            <div className="relative h-48 overflow-hidden rounded-t-2xl">
              <div className={`absolute inset-0 ${categoryInfo.cor} opacity-80`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Botão de fechar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Informações principais sobrepostas */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-end gap-6">
                  {/* Foto do prestador */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/50 shadow-xl flex-shrink-0">
                    <Image
                      src={provider.photoUrl || "/placeholder.svg?height=96&width=96"}
                      alt={provider.title}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Nome e categoria */}
                  <div className="flex-1 min-w-0">
                    <DialogHeader className="text-left p-0 space-y-2">
                      <DialogTitle className="text-3xl font-bold text-white truncate">{provider.title}</DialogTitle>
                      {provider.subtitle && <p className="text-xl text-white/90 font-medium">{provider.subtitle}</p>}
                      <div className="flex items-center gap-3">
                        <Badge className={`${categoryInfo.cor} text-white border-0 shadow-lg`}>
                          <span className="mr-2 text-lg">{categoryInfo.icon}</span>
                          {provider.category.name}
                        </Badge>
                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{provider.averageRating.toFixed(1)}</span>
                          <span className="text-sm opacity-80">({provider.ratingsCount})</span>
                        </div>
                      </div>
                    </DialogHeader>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-6 space-y-8">
              {/* Descrição */}
              {provider.description && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Sobre os Serviços</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-500">
                    {provider.description}
                  </p>
                </div>
              )}

              {/* Informações de contato */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Informações de Contato</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-colors group">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Telefone</p>
                      <a href={`tel:${provider.phone}`} className="text-green-700 font-semibold hover:underline">
                        {provider.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors group">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-blue-800">E-mail</p>
                      <a
                        href={`mailto:${provider.email}`}
                        className="text-blue-700 font-semibold hover:underline truncate block"
                      >
                        {provider.email}
                      </a>
                    </div>
                  </div>

                  {/* Endereço */}
                  {provider.address && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors group md:col-span-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-800">Endereço</p>
                        <p className="text-purple-700 font-semibold">{provider.address}</p>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {provider.website && (
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors group md:col-span-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-orange-800">Website</p>
                        <a
                          href={provider.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-700 font-semibold hover:underline truncate block flex items-center gap-1"
                        >
                          {provider.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Redes Sociais */}
              {socialLinks.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Redes Sociais</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <div
                        key={social.name}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors group"
                      >
                        <div className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center`}>
                          <social.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-800">{social.name}</p>
                          {social.url ? (
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 font-semibold hover:underline truncate block flex items-center gap-1"
                            >
                              {social.value}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <p className="text-gray-700 font-semibold truncate">{social.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações adicionais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Informações Adicionais</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${provider.active ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-sm font-medium text-gray-800">Status:</span>
                    </div>
                    <Badge variant={provider.active ? "default" : "secondary"}>
                      {provider.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  {/* Data de cadastro */}
                  {provider.createdAt && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Cadastrado em:</p>
                        <p className="text-gray-700 font-semibold text-sm">{formatDate(provider.createdAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <RatingModal
                  prestador={{
                    id: provider.id,
                    titulo: provider.title,
                    subtitulo: provider.subtitle || "",
                    foto: provider.photoUrl || "",
                    categoria: provider.category.name,
                  }}
                  onRatingSubmit={onRatingSubmit}
                />

                <Button
                  variant="outline"
                  className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 bg-transparent"
                  onClick={() => setIsOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
