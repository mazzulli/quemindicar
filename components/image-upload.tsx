"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface ImageUploadProps {
  currentImage?: string | null
  onImageChange: (file: File | null) => void
  disabled?: boolean
}

export function ImageUpload({ currentImage, onImageChange, disabled = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null)
      onImageChange(null)
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP")
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert("Arquivo muito grande. Tamanho máximo: 5MB")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onImageChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0] || null
    handleFileSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-semibold text-gray-700">Foto do Anúncio</Label>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : preview
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative group">
            <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Preview"
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            {!disabled && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleClick()
                    }}
                    className="bg-white/90 hover:bg-white text-gray-900"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Alterar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove()
                    }}
                    className="bg-red-500/90 hover:bg-red-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {dragActive ? (
                <Upload className="w-8 h-8 text-indigo-500 animate-bounce" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? "Solte a imagem aqui" : "Clique ou arraste uma imagem"}
              </p>
              <p className="text-sm text-gray-500">Formatos aceitos: JPG, PNG, GIF, WebP</p>
              <p className="text-xs text-gray-400">Tamanho máximo: 5MB</p>
            </div>
          </div>
        )}
      </div>

      {/* File Info */}
      {preview && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium">ℹ️ Informações do arquivo:</p>
          <p>• A imagem será salva automaticamente no servidor</p>
          <p>• Nome do arquivo será gerado baseado no nome do prestador + data/hora</p>
          <p>• Formatos suportados: JPG, PNG, GIF, WebP (máx. 5MB)</p>
        </div>
      )}
    </div>
  )
}
