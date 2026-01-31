"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import { Monitor, Clock, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ITDashboard() {
  const [stats, setStats] = useState({
    enAttente: 0,
    completes: 0,
    total: 0,
  })

  useEffect(() => {
    const allStats = dataStore.getStats()
    setStats({
      enAttente: allStats.enAttenteIT,
      completes: allStats.completes,
      total: allStats.enAttenteIT + allStats.completes,
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord IT</h1>
          <p className="text-muted-foreground mt-1">
            Creez les comptes etudiants et finalisez les admissions
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A traiter
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.enAttente}</div>
              <p className="text-xs text-muted-foreground">Comptes a creer</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalises
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.completes}</div>
              <p className="text-xs text-muted-foreground">Admissions completes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total traites
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Dossiers passes par IT</p>
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
              <Link href="/it/comptes">
                <Button className="w-full justify-start">
                  <Monitor className="h-4 w-4 mr-2" />
                  Creer les comptes ({stats.enAttente} en attente)
                </Button>
              </Link>
              <Link href="/it/historique">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Voir l&apos;historique des admissions
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processus de creation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Pour chaque etudiant valide:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Creer l&apos;email ISM (prenom.nom@ism.sn)</li>
                <li>Generer un mot de passe temporaire</li>
                <li>Creer les acces aux plateformes</li>
                <li>Generer le numero de carte etudiant</li>
                <li>Marquer comme complete</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
