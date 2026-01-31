"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { dataStore, type Application } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import { Monitor, User, GraduationCap, Mail, Check, RefreshCw } from "lucide-react"

export default function ITComptes() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    emailISM: "",
    motDePasseTemp: "",
    numeroCarteEtudiant: "",
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = () => {
    // IT traite les dossiers validés par le directeur
    const apps = dataStore.getApplications().filter(app => app.status === 'validee' || app.status === 'en_attente_it')
    setApplications(apps)
  }

  const openModal = (app: Application) => {
    setSelectedApp(app)

    // Use pre-generated values from store if available, or generate default
    const emailBase = `${app.prenom.toLowerCase()}.${app.nom.toLowerCase()}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "")

    setFormData({
      emailISM: app.emailISM || `${emailBase}@ism.sn`,
      motDePasseTemp: app.motDePasseTemp || `ISM2026${app.nom.substring(0, 2).toUpperCase()}`,
      numeroCarteEtudiant: app.numeroCarteEtudiant || `ETU-2026-${app.numero.split("-").pop()}`,
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!selectedApp || !user) return
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    const userName = `${user.prenom} ${user.nom}`

    dataStore.updateApplicationStatus(
      selectedApp.id,
      "complete",
      user.id,
      userName,
      "Compte etudiant cree et carte generee",
      {
        emailISM: formData.emailISM,
        motDePasseTemp: formData.motDePasseTemp,
        numeroCarteEtudiant: formData.numeroCarteEtudiant,
      }
    )

    setIsSubmitting(false)
    setShowModal(false)
    setSelectedApp(null)
    loadApplications()
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let password = "ISM"
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, motDePasseTemp: password }))
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Creation des comptes</h1>
          <p className="text-muted-foreground mt-1">
            Creez les comptes etudiants pour les candidatures validees
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {applications.length} compte{applications.length > 1 ? "s" : ""} a creer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Check className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tous les comptes ont ete crees</p>
                <p className="text-sm">Aucun dossier en attente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{app.prenom} {app.nom}</h3>
                          <Badge className="bg-indigo-100 text-indigo-800">En attente</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.numero}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {app.classe}
                          </span>
                          <span>{app.ecole}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {app.email}
                        </p>
                      </div>
                      <Button onClick={() => openModal(app)}>
                        <User className="h-4 w-4 mr-2" />
                        Creer le compte
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Account Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Creer le compte etudiant</DialogTitle>
              <DialogDescription>
                Renseignez les informations du compte pour {selectedApp?.prenom} {selectedApp?.nom}
              </DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{selectedApp.prenom} {selectedApp.nom}</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.numero}</p>
                  <p className="text-sm text-muted-foreground">{selectedApp.classe} - {selectedApp.ecole}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailISM">Email ISM *</Label>
                    <Input
                      id="emailISM"
                      value={formData.emailISM}
                      onChange={(e) => setFormData(prev => ({ ...prev, emailISM: e.target.value }))}
                      placeholder="prenom.nom@ism.sn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motDePasseTemp">Mot de passe temporaire *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="motDePasseTemp"
                        value={formData.motDePasseTemp}
                        onChange={(e) => setFormData(prev => ({ ...prev, motDePasseTemp: e.target.value }))}
                      />
                      <Button type="button" variant="outline" onClick={generatePassword}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroCarteEtudiant">Numero carte etudiant *</Label>
                    <Input
                      id="numeroCarteEtudiant"
                      value={formData.numeroCarteEtudiant}
                      onChange={(e) => setFormData(prev => ({ ...prev, numeroCarteEtudiant: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    Un email sera envoye a l&apos;etudiant avec ses identifiants et les instructions pour recuperer sa carte.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.emailISM || !formData.motDePasseTemp || !formData.numeroCarteEtudiant}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting ? "Creation..." : "Creer et finaliser"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
