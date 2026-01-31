"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { dataStore, schools, type Application, type ApplicationStatus } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Search, Eye, CheckCircle, AlertCircle, FileText, User, Phone, Mail, MapPin, GraduationCap, AlertTriangle } from "lucide-react"

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

export default function AgentCandidatures() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [ecoleFilter, setEcoleFilter] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<"verify" | "incomplete">("verify")
  const [comment, setComment] = useState("")

  useEffect(() => {
    loadApplications()
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

    setFilteredApplications(result)
  }, [applications, search, statusFilter, ecoleFilter])

  const loadApplications = () => {
    const apps = dataStore.getApplications()
    setApplications(apps)
  }

  const handleAction = (app: Application, type: "verify" | "incomplete") => {
    setSelectedApp(app)
    setActionType(type)
    setComment("")
    setShowActionModal(true)
  }

  const confirmAction = () => {
    if (!selectedApp || !user) return

    const newStatus: ApplicationStatus = actionType === "verify" ? "verifiee" : "a_completer"
    const userName = `${user.prenom} ${user.nom}`

    dataStore.updateApplicationStatus(
      selectedApp.id,
      newStatus,
      user.id,
      userName,
      comment || (actionType === "verify" ? "Documents verifies et conformes" : "Documents a completer"),
      { agentId: user.id }
    )

    setShowActionModal(false)
    setSelectedApp(null)
    loadApplications()
  }

  const openDetail = (app: Application) => {
    setSelectedApp(app)
    setShowDetailModal(true)
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Candidatures</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, numero, email..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="soumise">Soumise</SelectItem>
                  <SelectItem value="en_verification">En verification</SelectItem>
                  <SelectItem value="a_completer">A completer</SelectItem>
                  <SelectItem value="verifiee">Verifiee</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ecoleFilter} onValueChange={setEcoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ecole" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les ecoles</SelectItem>
                  {schools.map(school => (
                    <SelectItem key={school.id} value={school.nom}>{school.nom}</SelectItem>
                  ))}
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
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Statut</th>
                    <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => {
                    const status = statusConfig[app.status]
                    const canVerify = app.status === "soumise" || app.status === "en_verification"

                    return (
                      <tr key={app.id} className="border-b last:border-0">
                        <td className="py-4 font-mono text-sm">{app.numero}</td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{app.prenom} {app.nom}</p>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{app.classe}</p>
                          <p className="text-xs text-muted-foreground">{app.ecole}</p>
                          {app.alerts && app.alerts.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {app.alerts.map((alert, idx) => (
                                <Badge key={idx} variant="destructive" className="text-[10px] px-1 py-0 h-5">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {alert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(app.dateCreation).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="py-4">
                          <Badge className={status?.color}>{status?.label}</Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => openDetail(app)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canVerify && (
                              <>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 bg-transparent" onClick={() => handleAction(app, "verify")}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-orange-600 hover:text-orange-700 bg-transparent" onClick={() => handleAction(app, "incomplete")}>
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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
                  {selectedApp.alerts && selectedApp.alerts.length > 0 && (
                    <div className="flex gap-1">
                      {selectedApp.alerts.map((alert, idx) => (
                        <Badge key={idx} variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {alert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{selectedApp.prenom} {selectedApp.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        Ne(e) le {new Date(selectedApp.dateNaissance).toLocaleDateString("fr-FR")} a {selectedApp.lieuNaissance}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedApp.sexe === "M" ? "Masculin" : "Feminin"} - {selectedApp.nationalite}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{selectedApp.telephone}</p>
                      {selectedApp.telephoneParent && (
                        <p className="text-sm text-muted-foreground">Parent: {selectedApp.telephoneParent}</p>
                      )}
                    </div>
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
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Carte d&apos;identite</span>
                      {selectedApp.documents.cni ? (
                        <Badge variant="outline" className="text-green-600">Fourni</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">Manquant</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Diplome / Releve de notes</span>
                      {selectedApp.documents.diplome ? (
                        <Badge variant="outline" className="text-green-600">Fourni</Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">Manquant</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Certificat de scolarite</span>
                      {selectedApp.documents.certificatScolarite ? (
                        <Badge variant="outline" className="text-green-600">Fourni</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Optionnel</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Certificat medical</span>
                      {selectedApp.documents.certificatMedical ? (
                        <Badge variant="outline" className="text-green-600">Fourni</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Optionnel</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selectedApp.commentaires.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Historique</h4>
                    <div className="space-y-2">
                      {selectedApp.commentaires.map((c, i) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{c.auteur}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(c.date).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Modal */}
        <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "verify" ? "Valider la verification" : "Demander un complement"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "verify"
                  ? "Confirmez que les documents sont conformes et complets"
                  : "Indiquez les documents ou informations manquants"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Commentaire {actionType === "incomplete" && "*"}</Label>
                <Textarea
                  id="comment"
                  placeholder={actionType === "verify"
                    ? "Commentaire optionnel..."
                    : "Precisez les documents manquants ou les corrections necessaires..."
                  }
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Annuler
              </Button>
              <Button
                onClick={confirmAction}
                className={actionType === "verify" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                disabled={actionType === "incomplete" && !comment}
              >
                {actionType === "verify" ? "Marquer comme verifie" : "Demander un complement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
