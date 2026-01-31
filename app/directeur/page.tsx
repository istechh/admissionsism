"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DirecteurDashboard() {
  const [stats, setStats] = useState({
    enAttente: 0,
    validees: 0,
    rejetees: 0,
    total: 0,
  })

  useEffect(() => {
    const allStats = dataStore.getStats()
    setStats({
      enAttente: allStats.verifiees,
      validees: allStats.validees + allStats.enAttenteIT + allStats.completes,
      rejetees: allStats.rejetees,
      total: allStats.total,
    })
  }, [])

  const tauxValidation = stats.validees + stats.rejetees > 0 
    ? Math.round((stats.validees / (stats.validees + stats.rejetees)) * 100) 
    : 0

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord Directeur</h1>
          <p className="text-muted-foreground mt-1">
            Validez les candidatures et suivez les statistiques d&apos;admission
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente de validation
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.enAttente}</div>
              <p className="text-xs text-muted-foreground">Dossiers verifies</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Validees
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.validees}</div>
              <p className="text-xs text-muted-foreground">Candidatures acceptees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejetees
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejetees}</div>
              <p className="text-xs text-muted-foreground">Candidatures refusees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taux de validation
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tauxValidation}%</div>
              <p className="text-xs text-muted-foreground">Sur les decisions prises</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/directeur/validations">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Valider les candidatures ({stats.enAttente} en attente)
                </Button>
              </Link>
              <Link href="/directeur/stats">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir les statistiques detaillees
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rappel du processus</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Les candidatures vous parviennent apres verification par les agents.</p>
              <p>Examinez les documents et le profil du candidat.</p>
              <p><strong>Valider</strong> = Le candidat peut proceder aux etapes suivantes</p>
              <p><strong>Rejeter</strong> = Le candidat est notifie du refus</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
