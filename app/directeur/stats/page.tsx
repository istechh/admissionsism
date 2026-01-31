"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, schools, type Application } from "@/lib/store"
import { Download, FileSpreadsheet, TrendingUp, Users, GraduationCap, BarChart3 } from "lucide-react"
import { Label } from "@/components/ui/label"

export default function DirecteurStats() {
  const [stats, setStats] = useState(dataStore.getStats())
  const [applications, setApplications] = useState<Application[]>([])
  const [exportEcole, setExportEcole] = useState<string>("all")
  const [exportStatus, setExportStatus] = useState<string>("complete")

  useEffect(() => {
    setStats(dataStore.getStats())
    setApplications(dataStore.getApplications())
  }, [])

  const exportToCSV = () => {
    let dataToExport = [...applications]
    
    if (exportEcole !== "all") {
      dataToExport = dataToExport.filter(app => app.ecole === exportEcole)
    }
    
    if (exportStatus !== "all") {
      dataToExport = dataToExport.filter(app => app.status === exportStatus)
    }

    const headers = ["Numero", "Nom", "Prenom", "Sexe", "Date Naissance", "Email", "Telephone", "Ecole", "Classe", "Niveau", "Statut", "Date Admission"]
    
    const rows = dataToExport.map(app => [
      app.numero,
      app.nom,
      app.prenom,
      app.sexe,
      app.dateNaissance,
      app.email,
      app.telephone,
      app.ecole,
      app.classe,
      app.niveau,
      app.status,
      new Date(app.dateMiseAJour).toLocaleDateString("fr-FR")
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `admissions_${exportEcole === "all" ? "toutes_ecoles" : exportEcole.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const tauxValidation = stats.validees + stats.rejetees > 0 
    ? Math.round((stats.validees / (stats.validees + stats.rejetees)) * 100) 
    : 0

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Statistiques et Rapports</h1>
          <p className="text-muted-foreground mt-1">
            Consultez les statistiques d&apos;admission et exportez les donnees
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validees</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.validees + stats.enAttenteIT + stats.completes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejetees</CardTitle>
              <BarChart3 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejetees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux validation</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tauxValidation}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Par école */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Repartition par ecole
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.parEcole.map((item) => (
                  <div key={item.ecole} className="flex items-center justify-between">
                    <span className="text-sm">{item.ecole}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Par niveau */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Repartition par niveau
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.parNiveau.map((item) => (
                  <div key={item.niveau} className="flex items-center justify-between">
                    <span className="text-sm">{item.niveau}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-secondary h-2 rounded-full" 
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Export des donnees
            </CardTitle>
            <CardDescription>
              Exportez les candidatures au format CSV (compatible Excel)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label>Ecole</Label>
                <Select value={exportEcole} onValueChange={setExportEcole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les ecoles</SelectItem>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.nom}>{school.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label>Statut</Label>
                <Select value={exportStatus} onValueChange={setExportStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="complete">Admissions completes</SelectItem>
                    <SelectItem value="validee">Validees</SelectItem>
                    <SelectItem value="en_attente_it">En attente IT</SelectItem>
                    <SelectItem value="rejetee">Rejetees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Telecharger CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
