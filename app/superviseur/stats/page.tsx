"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataStore, schools, type Application } from "@/lib/store"
import { Download, FileSpreadsheet, TrendingUp, Users, GraduationCap, BarChart3, Clock, CheckCircle, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const statusConfig: Record<string, { label: string; color: string }> = {
  soumise: { label: "Soumises", color: "bg-blue-500" },
  en_verification: { label: "En verification", color: "bg-yellow-500" },
  a_completer: { label: "A completer", color: "bg-orange-500" },
  verifiee: { label: "Verifiees", color: "bg-purple-500" },
  validee: { label: "Validees", color: "bg-green-500" },
  rejetee: { label: "Rejetees", color: "bg-red-500" },
  en_attente_it: { label: "En attente IT", color: "bg-indigo-500" },
  complete: { label: "Completes", color: "bg-emerald-500" },
}

export default function SuperviseurStats() {
  const [stats, setStats] = useState(dataStore.getStats())
  const [applications, setApplications] = useState<Application[]>([])
  const [exportEcole, setExportEcole] = useState<string>("all")
  const [exportStatus, setExportStatus] = useState<string>("all")

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

    const headers = ["Numero", "Nom", "Prenom", "Sexe", "Date Naissance", "Lieu Naissance", "Nationalite", "Email", "Telephone", "Telephone Parent", "Adresse", "Ecole", "Classe", "Niveau", "Statut", "Date Creation", "Date Mise a Jour", "Email ISM", "Carte Etudiant"]
    
    const rows = dataToExport.map(app => [
      app.numero,
      app.nom,
      app.prenom,
      app.sexe,
      app.dateNaissance,
      app.lieuNaissance,
      app.nationalite,
      app.email,
      app.telephone,
      app.telephoneParent,
      app.adresse,
      app.ecole,
      app.classe,
      app.niveau,
      app.status,
      new Date(app.dateCreation).toLocaleDateString("fr-FR"),
      new Date(app.dateMiseAJour).toLocaleDateString("fr-FR"),
      app.emailISM || "",
      app.numeroCarteEtudiant || ""
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `rapport_complet_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const totalValidees = stats.validees + stats.enAttenteIT + stats.completes
  const tauxValidation = totalValidees + stats.rejetees > 0 
    ? Math.round((totalValidees / (totalValidees + stats.rejetees)) * 100) 
    : 0

  const statusData = [
    { key: "soumises", value: stats.soumises, label: "Soumises" },
    { key: "enVerification", value: stats.enVerification, label: "En verification" },
    { key: "aCompleter", value: stats.aCompleter, label: "A completer" },
    { key: "verifiees", value: stats.verifiees, label: "Verifiees" },
    { key: "validees", value: stats.validees, label: "Validees" },
    { key: "rejetees", value: stats.rejetees, label: "Rejetees" },
    { key: "enAttenteIT", value: stats.enAttenteIT, label: "En attente IT" },
    { key: "completes", value: stats.completes, label: "Completes" },
  ]

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Statistiques globales</h1>
          <p className="text-muted-foreground mt-1">
            Vue d&apos;ensemble complete de toutes les admissions
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total candidatures</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validees</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalValidees}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejetees</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejetees}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux validation</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tauxValidation}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Status breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Repartition par statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statusData.map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">{item.label}</span>
                  <Badge variant="secondary" className="font-bold">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                      <div className="w-32 bg-muted rounded-full h-3">
                        <div 
                          className="bg-primary h-3 rounded-full" 
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-bold w-8 text-right">{item.count}</span>
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
                    <span className="text-sm font-medium">{item.niveau}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-3">
                        <div 
                          className="bg-secondary h-3 rounded-full" 
                          style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="font-bold w-8 text-right">{item.count}</span>
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
              Export complet des donnees
            </CardTitle>
            <CardDescription>
              Exportez toutes les candidatures avec l&apos;ensemble des informations au format CSV
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
                    <SelectItem value="soumise">Soumises</SelectItem>
                    <SelectItem value="verifiee">Verifiees</SelectItem>
                    <SelectItem value="validee">Validees</SelectItem>
                    <SelectItem value="complete">Admissions completes</SelectItem>
                    <SelectItem value="rejetee">Rejetees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Telecharger le rapport CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
