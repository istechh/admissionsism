"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { dataStore, schools, type Application } from "@/lib/store"
import { Search, Eye, FileText, User, Phone, Mail, MapPin, GraduationCap, History } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string }> = {
  soumise: { label: "Soumise", color: "bg-blue-100 text-blue-800" },
  en_verification: { label: "En verification", color: "bg-yellow-100 text-yellow-800" },
  a_completer: { label: "A completer", color: "bg-orange-100 text-orange-800" },
  verifiee: { label: "Verifiee", color: "bg-purple-100 text-purple-800" },
  validee: { label: "Validee", color: "bg-green-100 text-green-800" },
  rejetee: { label: "Rejetee", color: "bg-red-100 text-red-800" },
  en_attente_it: { label: "En attente IT", color: "bg-indigo-100 text-indigo-800" },
  complete: { label: "Complete", color: "bg-emerald-100 text-emerald-800" },
}

export default function SuperviseurCandidatures() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ecoleFilter, setEcoleFilter] = useState<string>("all")
  const [niveauFilter, setNiveauFilter] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const apps = dataStore.getApplications()
    setApplications(apps)
  }, [])

  useEffect(() => {
    let result = [...applications]
    
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(app => 
        app.nom.toLowerCase().includes(searchLower) ||
        app.prenom.toLowerCase().includes(searchLower) ||
        app.numero.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower)
      )
    }
    
    if (statusFilter !== "all") {
      result = result.filter(app => app.status === statusFilter)
    }
    
    if (ecoleFilter !== "all") {
      result = result.filter(app => app.ecole === ecoleFilter)
    }
    
    if (niveauFilter !== "all") {
      result = result.filter(app => app.niveau === niveauFilter)
    }
    
    setFilteredApplications(result)
  }, [applications, search, statusFilter, ecoleFilter, niveauFilter])

  const openDetail = (app: Application) => {
    setSelectedApp(app)
    setShowDetailModal(true)
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Toutes les candidatures</h1>
          <p className="text-muted-foreground mt-1">
            Vue complete de toutes les candidatures et leur historique
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ecoleFilter} onValueChange={setEcoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ecole" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les ecoles</SelectItem>
                  {schools.map(school => (
                    <SelectItem key={school.id} value={school.nom}>{school.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={niveauFilter} onValueChange={setNiveauFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous niveaux</SelectItem>
                  <SelectItem value="L1">Licence 1</SelectItem>
                  <SelectItem value="L2">Licence 2</SelectItem>
                  <SelectItem value="L3">Licence 3</SelectItem>
                  <SelectItem value="M1">Master 1</SelectItem>
                  <SelectItem value="M2">Master 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications list */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredApplications.length} candidature{filteredApplications.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Numero</th>
                    <th className="pb-3 font-medium text-muted-foreground">Candidat</th>
                    <th className="pb-3 font-medium text-muted-foreground">Formation</th>
                    <th className="pb-3 font-medium text-muted-foreground">Ecole</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Statut</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => {
                    const status = statusConfig[app.status]
                    
                    return (
                      <tr key={app.id} className="border-b last:border-0">
                        <td className="py-4 font-mono text-sm">{app.numero}</td>
                        <td className="py-4">
                          <p className="font-medium">{app.prenom} {app.nom}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{app.classe}</p>
                          <p className="text-xs text-muted-foreground">{app.niveau}</p>
                        </td>
                        <td className="py-4 text-sm">{app.ecole}</td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(app.dateCreation).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4">
                          <Badge className={status?.color}>{status?.label}</Badge>
                        </td>
                        <td className="py-4">
                          <Button size="sm" variant="outline" onClick={() => openDetail(app)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {filteredApplications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune candidature trouvee
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail de la candidature</DialogTitle>
              <DialogDescription>Dossier {selectedApp?.numero}</DialogDescription>
            </DialogHeader>
            
            {selectedApp && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge className={statusConfig[selectedApp.status]?.color}>
                    {statusConfig[selectedApp.status]?.label}
                  </Badge>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedApp.prenom} {selectedApp.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        Ne(e) le {new Date(selectedApp.dateNaissance).toLocaleDateString("fr-FR")} a {selectedApp.lieuNaissance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedApp.telephone}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedApp.email}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm">{selectedApp.adresse}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedApp.classe}</p>
                      <p className="text-sm text-muted-foreground">{selectedApp.ecole} - {selectedApp.niveau}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h4>
                  <div className="grid gap-2">
                    {Object.entries(selectedApp.documents).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        {value ? (
                          <Badge variant="outline" className="text-green-600">Fourni</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Non fourni</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApp.status === "complete" && selectedApp.emailISM && (
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-800 mb-2">Informations etudiant</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-emerald-700">Email ISM:</span> {selectedApp.emailISM}</p>
                      <p><span className="text-emerald-700">Carte etudiant:</span> {selectedApp.numeroCarteEtudiant}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Historique complet
                  </h4>
                  <div className="space-y-2">
                    {selectedApp.commentaires.map((c, i) => (
                      <div key={i} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{c.auteur}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.date).toLocaleDateString("fr-FR")} a {new Date(c.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.message}</p>
                      </div>
                    ))}
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Systeme</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedApp.dateCreation).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Candidature creee</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
