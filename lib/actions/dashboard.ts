"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    // Buscar estatísticas básicas
    const [
      totalProviders,
      totalActiveProviders,
      totalCategories,
      totalRatings,
      averageRating,
      providersWithRatings,
    ] = await Promise.all([
      // Total de prestadores
      prisma.provider.count(),

      // Total de prestadores ativos
      prisma.provider.count({
        where: { active: true },
      }),

      // Total de categorias
      prisma.category.count(),

      // Total de avaliações
      prisma.rating.count(),

      // Média geral de avaliações
      prisma.rating.aggregate({
        _avg: {
          rating: true,
        },
      }),

      // Prestadores com avaliações (para calcular crescimento)
      prisma.provider.findMany({
        where: {
          active: true,
          ratings: {
            some: {},
          },
        },
        include: {
          _count: {
            select: {
              ratings: true,
            },
          },
        },
      }),
    ]);

    // Calcular crescimento simulado (em produção seria baseado em dados históricos)
    const providersGrowth = 12.5; // Simulado
    const ratingsGrowth = 0.2; // Simulado
    const accessGrowth = 18.3; // Simulado

    return {
      success: true,
      data: {
        totalProviders,
        totalActiveProviders,
        totalCategories,
        totalRatings,
        averageRating: averageRating._avg.rating || 0,
        providersGrowth,
        ratingsGrowth,
        accessGrowth,
        totalAccess: 8200, // Simulado - em produção viria de analytics
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Erro ao buscar estatísticas do dashboard",
    };
  }
}

export async function getCategoriesStats() {
  try {
    const categoriesWithCounts = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            providers: {
              where: {
                active: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Mapear cores e ícones para as categorias
    const categoryMap: Record<string, { cor: string; icon: string }> = {
      "Beauty & Aesthetics": {
        cor: "bg-gradient-to-r from-pink-500 to-rose-500",
        icon: "✨",
      },
      "Health & Wellness": {
        cor: "bg-gradient-to-r from-green-500 to-emerald-500",
        icon: "🏃‍♂️",
      },
      Education: {
        cor: "bg-gradient-to-r from-blue-500 to-cyan-500",
        icon: "📚",
      },
      Technology: {
        cor: "bg-gradient-to-r from-purple-500 to-indigo-500",
        icon: "💻",
      },
      Consulting: {
        cor: "bg-gradient-to-r from-orange-500 to-yellow-500",
        icon: "💼",
      },
      Design: {
        cor: "bg-gradient-to-r from-violet-500 to-purple-500",
        icon: "🎨",
      },
      Photography: {
        cor: "bg-gradient-to-r from-teal-500 to-cyan-500",
        icon: "📸",
      },
      Events: { cor: "bg-gradient-to-r from-red-500 to-pink-500", icon: "🎉" },
    };

    const categoriesWithStyle = categoriesWithCounts.map((category) => {
      const style = categoryMap[category.name] || {
        cor: "bg-gradient-to-r from-gray-500 to-gray-600",
        icon: "📋",
      };
      return {
        id: category.id,
        nome: category.name,
        count: category._count.providers,
        cor: style.cor,
        icon: style.icon,
      };
    });

    return {
      success: true,
      data: categoriesWithStyle,
    };
  } catch (error) {
    console.error("Error fetching categories stats:", error);
    return {
      success: false,
      error: "Erro ao buscar estatísticas das categorias",
    };
  }
}

export async function getTopProviders() {
  try {
    // Buscar prestadores com suas avaliações
    const providers = await prisma.provider.findMany({
      where: {
        active: true,
      },
      include: {
        category: true,
        ratings: {
          select: {
            rating: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    // Calcular estatísticas para cada prestador
    const providersWithStats = providers.map((provider) => {
      const averageRating =
        provider.ratings.length > 0
          ? provider.ratings.reduce((sum, r) => sum + r.rating, 0) /
            provider.ratings.length
          : 0;

      // Simular acessos baseado em avaliações e outros fatores
      const simulatedAccess = Math.floor(
        provider._count.ratings * 50 +
          averageRating * 100 +
          Math.random() * 500 +
          200
      );

      // Simular crescimento
      const simulatedGrowth = Math.random() * 30 - 10; // Entre -10% e +20%

      // Última avaliação
      const lastRating =
        provider.ratings.length > 0
          ? provider.ratings.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0]
          : null;

      const daysSinceLastRating = lastRating
        ? Math.floor(
            (Date.now() - new Date(lastRating.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

      const lastRatingText =
        daysSinceLastRating !== null
          ? daysSinceLastRating === 0
            ? "hoje"
            : daysSinceLastRating === 1
            ? "1 dia"
            : daysSinceLastRating < 7
            ? `${daysSinceLastRating} dias`
            : daysSinceLastRating < 30
            ? `${Math.floor(daysSinceLastRating / 7)} semana${
                Math.floor(daysSinceLastRating / 7) > 1 ? "s" : ""
              }`
            : `${Math.floor(daysSinceLastRating / 30)} mês${
                Math.floor(daysSinceLastRating / 30) > 1 ? "es" : ""
              }`
          : "nunca";

      return {
        id: provider.id,
        titulo: provider.title,
        subtitulo: provider.subtitle || "",
        categoria: provider.category.name,
        foto: provider.photoUrl || "/placeholder.svg?height=50&width=50",
        acessos: simulatedAccess,
        crescimento: Number(simulatedGrowth.toFixed(1)),
        rating: Number(averageRating.toFixed(1)),
        totalAvaliacoes: provider._count.ratings,
        ultimaAvaliacao: lastRatingText,
      };
    });

    // Ordenar por acessos (mais acessados)
    const topByAccess = [...providersWithStats]
      .sort((a, b) => b.acessos - a.acessos)
      .slice(0, 10);

    // Ordenar por rating (melhor avaliados) - apenas os que têm avaliações
    const topByRating = [...providersWithStats]
      .filter((p) => p.totalAvaliacoes > 0)
      .sort((a, b) => {
        if (b.rating === a.rating) {
          return b.totalAvaliacoes - a.totalAvaliacoes;
        }
        return b.rating - a.rating;
      })
      .slice(0, 10);

    return {
      success: true,
      data: {
        topByAccess,
        topByRating,
      },
    };
  } catch (error) {
    console.error("Error fetching top providers:", error);
    return {
      success: false,
      error: "Erro ao buscar ranking de prestadores",
    };
  }
}

export async function getMonthlyGrowth() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Prestadores criados este mês
    const providersThisMonth = await prisma.provider.count({
      where: {
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });

    // Prestadores criados no mês passado
    const providersLastMonth = await prisma.provider.count({
      where: {
        createdAt: {
          gte: new Date(lastMonthYear, lastMonth, 1),
          lt: new Date(lastMonthYear, lastMonth + 1, 1),
        },
      },
    });

    // Avaliações criadas este mês
    const ratingsThisMonth = await prisma.rating.count({
      where: {
        createdAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });

    // Avaliações criadas no mês passado
    const ratingsLastMonth = await prisma.rating.count({
      where: {
        createdAt: {
          gte: new Date(lastMonthYear, lastMonth, 1),
          lt: new Date(lastMonthYear, lastMonth + 1, 1),
        },
      },
    });

    // Calcular crescimento percentual
    const providersGrowth =
      providersLastMonth > 0
        ? ((providersThisMonth - providersLastMonth) / providersLastMonth) * 100
        : providersThisMonth > 0
        ? 100
        : 0;

    const ratingsGrowth =
      ratingsLastMonth > 0
        ? ((ratingsThisMonth - ratingsLastMonth) / ratingsLastMonth) * 100
        : ratingsThisMonth > 0
        ? 100
        : 0;

    return {
      success: true,
      data: {
        providersThisMonth,
        providersLastMonth,
        providersGrowth: Number(providersGrowth.toFixed(1)),
        ratingsThisMonth,
        ratingsLastMonth,
        ratingsGrowth: Number(ratingsGrowth.toFixed(1)),
      },
    };
  } catch (error) {
    console.error("Error fetching monthly growth:", error);
    return {
      success: false,
      error: "Erro ao buscar crescimento mensal",
    };
  }
}
