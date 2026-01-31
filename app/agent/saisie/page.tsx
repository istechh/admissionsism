"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { dataStore, schools } from "@/lib/store"
import { Check, Upload, User } from "lucide-react"

export default function AgentSaisie() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [numeroGenere, setNumeroGenere] = useState("")

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    sexe: "" as "M" | "F" | "",
    nationalite: "Senegalaise",
    telephone: "",
    telephoneParent: "",
    lienParente: "",
    email: "",
    adresse: "",
    ecole: "",
    filiere: "",
    classe: "",
    niveau: "",
    documents: {
      cni: "",
      diplome: "",
      certificatScolarite: "",
      certificatMedical: "",
    }
  })

  const selectedSchool = schools.find(s => s.nom === formData.ecole)
  const selectedClass = selectedSchool?.classes.find(c => c.nom === formData.classe)

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const application = dataStore.createApplication({
      nom: formData.nom,
      prenom: formData.prenom,
      dateNaissance: formData.dateNaissance,
      lieuNaissance: formData.lieuNaissance,
      sexe: formData.sexe as "M" | "F",
      nationalite: formData.nationalite,
      telephone: formData.telephone,
      telephoneParent: formData.telephoneParent,
      lienParente: formData.lienParente,
      email: formData.email,
      adresse: formData.adresse,
      ecole: formData.ecole,
      filiere: formData.filiere,
      classe: formData.classe,
      niveau: selectedClass?.niveau || "",
      documents: formData.documents,
      agentId: user?.id,
    })

    await new Promise(resolve => setTimeout(resolve, 500))
    
    setNumeroGenere(application.numero)
    setSuccess(true)
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      dateNaissance: "",
      lieuNaissance: "",
      sexe: "",
      nationalite: "Senegalaise",
      telephone: "",
      telephoneParent: "",
      lienParente: "",
      email: "",
      adresse: "",
      ecole: "",
      filiere: "",
      classe: "",
      niveau: "",
      documents: {
        cni: "",
        diplome: "",
        certificatScolarite: "",
        certificatMedical: "",
      }
    })
    setSuccess(false)
    setNumeroGenere("")
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="p-8 max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Candidature enregistree</h2>
              <p className="text-green-700 mb-4">
                La candidature a ete enregistree avec succes.
              </p>
              <div className="bg-white p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">Numero de dossier</p>
                <p className="text-2xl font-bold font-mono">{numeroGenere}</p>
              </div>
              <p className="text-sm text-green-700 mb-6">
                Remettez ce numero au candidat pour qu&apos;il puisse suivre son dossier.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetForm}>
                  Nouvelle saisie
                </Button>
                <Button onClick={() => router.push("/agent/candidatures")}>
                  Voir les candidatures
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Saisie de candidature</h1>
          <p className="text-muted-foreground mt-1">
            Enregistrez une candidature pour un candidat present sur place
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Informations personnelles */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prenom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => updateFormData("prenom", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => updateFormData("nom", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de naissance *</Label>
                  <Input
                    id="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={(e) => updateFormData("dateNaissance", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lieuNaissance">Lieu de naissance *</Label>
                  <Input
                    id="lieuNaissance"
                    value={formData.lieuNaissance}
                    onChange={(e) => updateFormData("lieuNaissance", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sexe">Sexe *</Label>
                  <Select value={formData.sexe} onValueChange={(value) => updateFormData("sexe", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Feminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalite">Nationalite *</Label>
                  <Input
                    id="nationalite"
                    value={formData.nationalite}
                    onChange={(e) => updateFormData("nationalite", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Coordonnees</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Telephone personnel *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    value={formData.telephone}
                    onChange={(e) => updateFormData("telephone", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephoneParent">Telephone parent/tuteur</Label>
                  <Input
                    id="telephoneParent"
                    type="tel"
                    placeholder="+221 77 123 45 67"
                    value={formData.telephoneParent}
                    onChange={(e) => updateFormData("telephoneParent", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lienParente">Lien de parente</Label>
                <Select value={formData.lienParente} onValueChange={(value) => updateFormData("lienParente", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pere">Pere</SelectItem>
                    <SelectItem value="Mere">Mere</SelectItem>
                    <SelectItem value="Tuteur">Tuteur</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse complete *</Label>
                <Textarea
                  id="adresse"
                  placeholder="Numero, rue, ville..."
                  value={formData.adresse}
                  onChange={(e) => updateFormData("adresse", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Formation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Formation souhaitee</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="ecole">Ecole *</Label>
                <Select 
                  value={formData.ecole} 
                  onValueChange={(value) => {
                    updateFormData("ecole", value)
                    updateFormData("classe", "")
                    updateFormData("filiere", "")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une ecole" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.nom}>
                        {school.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filiere">Filiere *</Label>
                <Input
                  id="filiere"
                  placeholder="Ex: Informatique, Gestion, Droit..."
                  value={formData.filiere}
                  onChange={(e) => updateFormData("filiere", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classe">Classe / Niveau *</Label>
                <Select 
                  value={formData.classe} 
                  onValueChange={(value) => updateFormData("classe", value)}
                  disabled={!formData.ecole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSchool?.classes.map((classe) => (
                      <SelectItem key={classe.id} value={classe.nom}>
                        {classe.nom} ({classe.niveau})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Documents numerises</CardTitle>
              <CardDescription>Scannez et telechargez les documents du candidat</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label>Carte d&apos;identite / Passeport *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="flex-1"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, cni: e.target.files![0].name }
                        }))
                      }
                    }}
                  />
                  {formData.documents.cni && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Diplome / Releve de notes *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="flex-1"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, diplome: e.target.files![0].name }
                        }))
                      }
                    }}
                  />
                  {formData.documents.diplome && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Certificat de scolarite (optionnel)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="flex-1"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, certificatScolarite: e.target.files![0].name }
                        }))
                      }
                    }}
                  />
                  {formData.documents.certificatScolarite && <Check className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/agent")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Enregistrement..."
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enregistrer la candidature
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
