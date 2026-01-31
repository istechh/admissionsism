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
import { Search, Eye, CheckCircle, XCircle, FileText, User, Phone, Mail, MapPin, GraduationCap, TrendingUp, AlertTriangle } from "lucide-react"

const statusConfig: Record<string, { label: string; color: string }> = {
  verifiee: { label: "Verifiee", color: "bg-purple-100 text-purple-800" },
  validee: { label: "Validee", color: "bg-green-100 text-green-800" },
  rejetee: { label: "Rejetee", color: "bg-red-100 text-red-800" },
}

export default function DirecteurValidations() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [search, setSearch] = useState("")
  const [ecoleFilter, setEcoleFilter] = useState<string>("all")
  const [niveauFilter, setNiveauFilter] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionType, setActionType] = useState<"validate" | "reject">("validate")
  const [comment, setComment] = useState("")

  useEffect(() => {
    loadApplications()
  }, [])

  useEffect(() => {
    let result = applications.filter(app => app.status === "verifiee")

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(app =>
        app.nom.toLowerCase().includes(searchLower) ||
        app.prenom.toLowerCase().includes(searchLower) ||
        app.numero.toLowerCase().includes(searchLower)
      )
    }

    if (ecoleFilter !== "all") {
      result = result.filter(app => app.ecole === ecoleFilter)
    }

    if (niveauFilter !== "all") {
      result = result.filter(app => app.niveau === niveauFilter)
    }

    setFilteredApplications(result)
  }, [applications, search, ecoleFilter, niveauFilter])

  const loadApplications = () => {
    const apps = dataStore.getApplications()
    setApplications(apps)
  }

  const handleAction = (app: Application, type: "validate" | "reject") => {
    setSelectedApp(app)
    setActionType(type)
    setComment("")
    setShowActionModal(true)
  }

  const confirmAction = () => {
    if (!selectedApp || !user) return

    const newStatus: ApplicationStatus = actionType === "validate" ? "en_attente_it" : "rejetee"
    const userName = `${user.prenom} ${user.nom}`

    dataStore.updateApplicationStatus(
      selectedApp.id,
      newStatus,
      user.id,
      userName,
      comment || (actionType === "validate" ? "Candidature validee" : "Candidature rejetee"),
      { directeurId: user.id }
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
          <h1 className="text-2xl font-bold text-foreground">Validation des candidatures</h1>
          <p className="text-muted-foreground mt-1">
            Examinez et validez les candidatures verifiees par les agents
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou numero..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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
              <Select value={niveauFilter} onValueChange={setNiveauFilter}>
                <SelectTrigger className="w-full sm:w-40">
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
              {filteredApplications.length} candidature{filteredApplications.length > 1 ? "s" : ""} en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune candidature en attente de validation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{app.prenom} {app.nom}</h3>
                          <Badge className={statusConfig[app.status as keyof typeof statusConfig]?.color || "bg-gray-100"}>
                            {statusConfig[app.status as keyof typeof statusConfig]?.label || app.status}
                          </Badge>
                          {app.predictiveScore && (
                            <Badge className={
                              app.predictiveScore.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                                app.predictiveScore.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-red-100 text-red-800 border-red-200'
                            }>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Score: {app.predictiveScore.score}/100
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.numero} - {app.classe}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {app.ecole} - {app.niveau}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openDetail(app)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAction(app, "validate")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleAction(app, "reject")}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

                {selectedApp.predictiveScore && (
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Analyse IA & Score Prédictif
                      </h4>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${selectedApp.predictiveScore.color === 'green' ? 'text-green-600' :
                            selectedApp.predictiveScore.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                          {selectedApp.predictiveScore.score}
                        </span>
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Académique ({selectedApp.predictiveScore.breakdown.academic}/70)</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(selectedApp.predictiveScore.breakdown.academic / 70) * 100}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Série Bac ({selectedApp.predictiveScore.breakdown.serie}/15)</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(selectedApp.predictiveScore.breakdown.serie / 15) * 100}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rapidité ({selectedApp.predictiveScore.breakdown.speed}/5)</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(selectedApp.predictiveScore.breakdown.speed / 5) * 100}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Potentiel</span>
                          <span className="font-medium">{selectedApp.predictiveScore.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-2 rounded text-blue-800">
                      <AlertTriangle className="h-3 w-3 mt-0.5" />
                      Ce score est une aide à la décision basée sur les résultats académiques et la cohérence du parcours.
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h4>
                  <div className="grid gap-2">
                    {selectedApp.documents.cni && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Carte d&apos;identite</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">Fourni</Badge>
                          <Button size="sm" variant="outline" onClick={() => window.open(selectedApp.documents.cni, '_blank')}>
                            Voir
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedApp.documents.diplome && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Diplome / Releve de notes</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">Fourni</Badge>
                          <Button size="sm" variant="outline" onClick={() => window.open(selectedApp.documents.diplome, '_blank')}>
                            Voir
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedApp.documents.certificatScolarite && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Certificat de scolarite</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">Fourni</Badge>
                          <Button size="sm" variant="outline" onClick={() => window.open(selectedApp.documents.certificatScolarite, '_blank')}>
                            Voir
                          </Button>
                        </div>
                      </div>
                    )}
                    {selectedApp.documents.certificatMedical && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Certificat medical</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">Fourni</Badge>
                          <Button size="sm" variant="outline" onClick={() => window.open(selectedApp.documents.certificatMedical, '_blank')}>
                            Voir
                          </Button>
                        </div>
                      </div>
                    )}
                    {!selectedApp.documents.cni && !selectedApp.documents.diplome && !selectedApp.documents.certificatScolarite && !selectedApp.documents.certificatMedical && (
                      <p className="text-sm text-muted-foreground">Aucun document disponible</p>
                    )}
                  </div>
                </div>

                {selectedApp.commentaires.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Historique de verification</h4>
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

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Fermer
              </Button>
              {selectedApp?.status === "verifiee" && (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setShowDetailModal(false)
                      handleAction(selectedApp, "validate")
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Valider
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDetailModal(false)
                      handleAction(selectedApp, "reject")
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Action Modal */}
        <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "validate" ? "Valider la candidature" : "Rejeter la candidature"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "validate"
                  ? "Confirmez la validation de cette candidature. Le candidat sera notifie et le dossier transmis a l'equipe IT."
                  : "Confirmez le rejet de cette candidature. Le candidat sera notifie par email."
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedApp?.prenom} {selectedApp?.nom}</p>
                <p className="text-sm text-muted-foreground">{selectedApp?.numero}</p>
                <p className="text-sm text-muted-foreground">{selectedApp?.classe} - {selectedApp?.ecole}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">
                  {actionType === "validate" ? "Commentaire (optionnel)" : "Motif du rejet *"}
                </Label>
                <Textarea
                  id="comment"
                  placeholder={actionType === "validate"
                    ? "Ajoutez un commentaire si necessaire..."
                    : "Indiquez le motif du rejet..."
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
                className={actionType === "validate" ? "bg-green-600 hover:bg-green-700" : ""}
                variant={actionType === "reject" ? "destructive" : "default"}
                disabled={actionType === "reject" && !comment}
              >
                {actionType === "validate" ? "Confirmer la validation" : "Confirmer le rejet"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
