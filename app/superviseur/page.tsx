"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuperviseurDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    soumises: 0,
    verifiees: 0,
    validees: 0,
    rejetees: 0,
    completes: 0,
  })

  useEffect(() => {
    const allStats = dataStore.getStats()
    setStats({
      total: allStats.total,
      soumises: allStats.soumises + allStats.enVerification + allStats.aCompleter,
      verifiees: allStats.verifiees,
      validees: allStats.validees + allStats.enAttenteIT,
      rejetees: allStats.rejetees,
      completes: allStats.completes,
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord Superviseur</h1>
          <p className="text-muted-foreground mt-1">
            Vue d&apos;ensemble de toutes les candidatures et statistiques
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total candidatures
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Toutes les candidatures</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En cours de traitement
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.soumises}</div>
              <p className="text-xs text-muted-foreground">Soumises / En verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente validation
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.verifiees}</div>
              <p className="text-xs text-muted-foreground">Verifiees par agents</p>
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
              <p className="text-xs text-muted-foreground">Acceptees par directeurs</p>
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
              <p className="text-xs text-muted-foreground">Refusees</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalisees
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.completes}</div>
              <p className="text-xs text-muted-foreground">Admissions completes</p>
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
              <Link href="/superviseur/candidatures">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir toutes les candidatures
                </Button>
              </Link>
              <Link href="/superviseur/stats">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Statistiques detaillees
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role du Superviseur</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>En tant que superviseur, vous avez acces a:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Vue globale de toutes les candidatures</li>
                <li>Historique complet des decisions</li>
                <li>Statistiques par ecole, filiere, niveau</li>
                <li>Exports et rapports</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
