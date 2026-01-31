"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore } from "@/lib/store"
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AgentDashboard() {
  const [stats, setStats] = useState({
    soumises: 0,
    aVerifier: 0,
    aCompleter: 0,
    verifiees: 0,
  })

  useEffect(() => {
    const allStats = dataStore.getStats()
    setStats({
      soumises: allStats.soumises,
      aVerifier: allStats.soumises + allStats.enVerification,
      aCompleter: allStats.aCompleter,
      verifiees: allStats.verifiees,
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord Agent</h1>
          <p className="text-muted-foreground mt-1">
            Gerez et verifiez les candidatures soumises
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A verifier
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aVerifier}</div>
              <p className="text-xs text-muted-foreground">Candidatures en attente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A completer
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.aCompleter}</div>
              <p className="text-xs text-muted-foreground">Documents manquants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verifiees
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.verifiees}</div>
              <p className="text-xs text-muted-foreground">Transmises au directeur</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total soumises
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.soumises}</div>
              <p className="text-xs text-muted-foreground">Nouvelles candidatures</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/agent/candidatures">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir toutes les candidatures
                </Button>
              </Link>
              <Link href="/agent/saisie">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Saisir une candidature sur place
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guide de verification</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. Verifiez la completude des informations</p>
              <p>2. Controlez la conformite des documents (format, lisibilite)</p>
              <p>3. Verifiez la correspondance entre informations et documents</p>
              <p>4. Marquez comme "Verifie" ou "A completer"</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
