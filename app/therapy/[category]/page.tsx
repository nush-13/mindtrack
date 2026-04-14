import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { THERAPY_CONTENT } from "@/lib/therapyContent";
import TherapyModuleClient from "@/components/therapy/TherapyModuleClient";
import DashboardLayout from "@/components/DashboardLayout";

interface PageProps {
  params: {
    category: string;
  };
}

export default async function TherapyCategoryPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const categoryId = params.category.toLowerCase();
  const content = THERAPY_CONTENT[categoryId];

  if (!content) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  // Fetch or create therapy journey
  let journey = await prisma.therapyJourney.findUnique({
    where: {
      userId_category: {
        userId: user.id,
        category: categoryId,
      },
    },
  });

  if (!journey) {
    journey = await prisma.therapyJourney.create({
      data: {
        userId: user.id,
        category: categoryId,
        currentDay: 1,
      },
    });
  }

  return (
    <DashboardLayout>
      <TherapyModuleClient 
        content={content} 
        journey={journey}
      />
    </DashboardLayout>
  );
}
