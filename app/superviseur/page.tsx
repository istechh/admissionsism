"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dataStore, schools } from "@/lib/store"
import { FileText, Clock, CheckCircle, XCircle, TrendingUp, Building2, Globe } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuperviseurDashboard() {
  const [stats, setStats] = useState({
    enAttente: 0,
    validees: 0,
    rejetees: 0,
    total: 0,
    parEcole: [] as { ecole: string, count: number, percent: number }[]
  })

  useEffect(() => {
    const allStats = dataStore.getStats()
    const allApps = dataStore.getApplications()

    // Calculate stats per school
    const statsBySchool = schools.map(school => {
      const schoolApps = allApps.filter(a => a.ecole === school.nom)
      const totalSchool = schoolApps.length
      const validatedSchool = schoolApps.filter(a => ['validee', 'en_attente_it', 'complete'].includes(a.status)).length
      return {
        ecole: school.nom,
        count: totalSchool,
        percent: totalSchool > 0 ? Math.round((validatedSchool / totalSchool) * 100) : 0
      }
    })

    setStats({
      enAttente: allStats.verifiees,
      validees: allStats.validees + allStats.enAttenteIT + allStats.completes,
      rejetees: allStats.rejetees,
      total: allStats.total,
      parEcole: statsBySchool
    })
  }, [])

  const tauxValidation = stats.validees + stats.rejetees > 0
    ? Math.round((stats.validees / (stats.validees + stats.rejetees)) * 100)
    : 0

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Supervision Globale</h1>
            <p className="text-muted-foreground mt-1">
              Vue d'ensemble sur toutes les écoles du groupe ISM
            </p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="font-semibold text-sm">Mode Superviseur</span>
          </div>
        </div>

        {/* Global Stats cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidatures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tous établissements confondus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Validation</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.enAttente}</div>
              <p className="text-xs text-muted-foreground">Dossiers en cours d'examen</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Admis</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.validees}</div>
              <p className="text-xs text-muted-foreground">Futurs étudiants ISM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rapports & Exports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start border-green-200 hover:bg-green-50 text-green-700" variant="outline" onClick={() => {
                const svApps = dataStore.getApplications();
                const headers = ["Numero", "Prenom", "Nom", "Ecole", "Niveau", "Status", "Date"];
                const csvContent = [
                  headers.join(","),
                  ...svApps.map(app => [
                    app.numero,
                    app.prenom,
                    app.nom,
                    app.ecole,
                    app.niveau,
                    app.status,
                    new Date(app.dateCreation).toLocaleDateString()
                  ].join(","))
                ].join("\n");

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                if (link.download !== undefined) {
                  const url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", `export_candidatures_ism_${new Date().toISOString().slice(0, 10)}.csv`);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Télécharger Excel complet (.csv)
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Exportez la liste complète de tous les étudiants (tous bâtiments) pour analyse Excel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux Global</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{tauxValidation}%</div>
              <p className="text-xs text-muted-foreground">Taux d'acceptation moyen</p>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown by School */}
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Performance par École
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.parEcole.map((ecole) => (
            <Card key={ecole.ecole} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{ecole.ecole}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">{ecole.count}</span>
                  <span className="text-sm text-green-600 font-medium">{ecole.percent}% admis</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${ecole.percent}%` }}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
