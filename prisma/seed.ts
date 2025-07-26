import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Beauty & Aesthetics" },
      update: {},
      create: { name: "Beauty & Aesthetics" },
    }),
    prisma.category.upsert({
      where: { name: "Health & Wellness" },
      update: {},
      create: { name: "Health & Wellness" },
    }),
    prisma.category.upsert({
      where: { name: "Education" },
      update: {},
      create: { name: "Education" },
    }),
    prisma.category.upsert({
      where: { name: "Technology" },
      update: {},
      create: { name: "Technology" },
    }),
    prisma.category.upsert({
      where: { name: "Consulting" },
      update: {},
      create: { name: "Consulting" },
    }),
    prisma.category.upsert({
      where: { name: "Design" },
      update: {},
      create: { name: "Design" },
    }),
    prisma.category.upsert({
      where: { name: "Photography" },
      update: {},
      create: { name: "Photography" },
    }),
    prisma.category.upsert({
      where: { name: "Events" },
      update: {},
      create: { name: "Events" },
    }),
  ])

  console.log("✅ Categories created")

  // Create providers
  const providers = await Promise.all([
    prisma.provider.upsert({
      where: { email: "maria@exemplo.com" },
      update: {},
      create: {
        title: "Maria Silva",
        subtitle: "Specialized Aesthetician",
        categoryId: categories[0].id, // Beauty & Aesthetics
        description:
          "Specialist in facial treatments, skin cleansing and aesthetic procedures. More than 10 years of market experience.",
        phone: "(11) 99999-1234",
        email: "maria@exemplo.com",
        address: "Rua das Flores, 123 - São Paulo, SP",
        website: "https://mariasilva.com.br",
        instagram: "@mariasilva_estetica",
        facebook: "Maria Silva Estética",
        youtube: "Maria Silva Beauty",
      },
    }),
    prisma.provider.upsert({
      where: { email: "joao@exemplo.com" },
      update: {},
      create: {
        title: "João Santos",
        subtitle: "Personal Trainer",
        categoryId: categories[1].id, // Health & Wellness
        description:
          "Certified personal trainer, specialist in bodybuilding and physical conditioning. Personalized service and guaranteed results.",
        phone: "(11) 98888-5678",
        email: "joao@exemplo.com",
        address: "Av. Paulista, 456 - São Paulo, SP",
        website: "https://joaopersonal.com",
        instagram: "@joao_personal",
        facebook: "João Santos Personal",
      },
    }),
    prisma.provider.upsert({
      where: { email: "ana@exemplo.com" },
      update: {},
      create: {
        title: "Ana Costa",
        subtitle: "English Teacher",
        categoryId: categories[2].id, // Education
        description:
          "English teacher with international certification. Private and group classes, in-person and online.",
        phone: "(11) 97777-9012",
        email: "ana@exemplo.com",
        address: "Rua da Educação, 789 - São Paulo, SP",
        instagram: "@ana_english",
        facebook: "Ana Costa English",
        youtube: "Ana English Classes",
      },
    }),
    prisma.provider.upsert({
      where: { email: "carlos@exemplo.com" },
      update: {},
      create: {
        title: "Carlos Tech",
        subtitle: "Web Developer",
        categoryId: categories[3].id, // Technology
        description:
          "Full-stack developer specialized in React, Node.js and modern web applications. Creation of custom websites and systems.",
        phone: "(11) 96666-3456",
        email: "carlos@exemplo.com",
        address: "Rua da Tecnologia, 321 - São Paulo, SP",
        website: "https://carlostech.dev",
        instagram: "@carlos_dev",
        youtube: "Carlos Tech Channel",
      },
    }),
  ])

  console.log("✅ Providers created")

  // Create sample ratings
  const ratings = await Promise.all([
    prisma.rating.create({
      data: {
        providerId: providers[0].id,
        reviewerName: "Ana Silva",
        rating: 5,
        comment: "Excellent professional! Very attentive and careful. I recommend!",
      },
    }),
    prisma.rating.create({
      data: {
        providerId: providers[0].id,
        reviewerName: "Carlos Santos",
        rating: 4,
        comment: "Good service, satisfactory result. I will come back other times.",
      },
    }),
    prisma.rating.create({
      data: {
        providerId: providers[1].id,
        reviewerName: "João Costa",
        rating: 5,
        comment: "Exceptional personal trainer! Helped me a lot to achieve my goals.",
      },
    }),
    prisma.rating.create({
      data: {
        providerId: providers[2].id,
        reviewerName: "Pedro Alves",
        rating: 5,
        comment: "Amazing teacher! I learned a lot of English with her.",
      },
    }),
    prisma.rating.create({
      data: {
        providerId: providers[3].id,
        reviewerName: "Roberto Silva",
        rating: 4,
        comment: "Competent developer, delivered the project on time.",
      },
    }),
  ])

  console.log("✅ Ratings created")

  console.log("🎉 Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
