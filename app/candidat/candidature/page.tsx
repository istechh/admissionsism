"use client"

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
import { ArrowLeft, ArrowRight, Check, Upload, ScanLine, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { simulateOCR } from "@/lib/intelligence"
import { toast } from "sonner"

const steps = [
  { id: 1, title: "Informations personnelles" },
  { id: 2, title: "Coordonnees" },
  { id: 3, title: "Formation souhaitee" },
  { id: 4, title: "Documents" },
]

export default function CandidatureForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOCRLoading, setIsOCRLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    dateNaissance: "",
    lieuNaissance: "",
    sexe: "" as "M" | "F" | "",
    nationalite: "Senegalaise",
    telephone: "",
    telephoneParent: "",
    lienParente: "",
    email: user?.email || "",
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

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
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
      candidatId: user?.id,
    })

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    router.push(`/candidat/suivi?id=${application.id}`)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nom && formData.prenom && formData.dateNaissance && formData.lieuNaissance && formData.sexe && formData.nationalite
      case 2:
        return formData.telephone && formData.email && formData.adresse
      case 3:
        return formData.ecole && formData.filiere && formData.classe
      case 4:
        return formData.documents.cni && formData.documents.diplome
      default:
        return false
    }
  }

  const handleOCR = async (file: File) => {
    setIsOCRLoading(true)
    try {
      const result = await simulateOCR(file, 'cni')

      if (result.success && result.data) {
        setFormData(prev => ({
          ...prev,
          nom: result.data!.nom,
          prenom: result.data!.prenom,
          dateNaissance: result.data!.dateNaissance,
          lieuNaissance: result.data!.lieuNaissance,
          sexe: result.data!.sexe,
          documents: {
            ...prev.documents,
            cni: file.name
          }
        }))

        if (result.alerts && result.alerts.length > 0) {
          toast.warning("Attention", { description: result.alerts.join(", ") })
        } else {
          toast.success("Succès", { description: "Données extraites automatiquement de la CNI" })
        }
      } else {
        toast.error("Erreur", { description: "Impossible de lire le document. Veuillez remplir manuellement." })
      }
    } catch (e) {
      toast.error("Erreur OCR", { description: "Une erreur est survenue lors de l'analyse." })
    } finally {
      setIsOCRLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Formulaire de candidature</h1>
          <p className="text-muted-foreground mt-1">
            Remplissez toutes les informations requises pour soumettre votre candidature
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep > step.id
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground hidden sm:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-full h-1 mx-2 rounded",
                      currentStep > step.id ? "bg-primary/50" : "bg-muted"
                    )}
                    style={{ minWidth: "60px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Entrez vos informations personnelles"}
              {currentStep === 2 && "Entrez vos coordonnees de contact"}
              {currentStep === 3 && "Selectionnez la formation souhaitee"}
              {currentStep === 4 && "Telechargez les documents requis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="grid gap-4">
                {/* OCR Upload Area */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {isOCRLoading ? <Loader2 className="h-6 w-6 text-primary animate-spin" /> : <ScanLine className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">Remplissage automatique</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                        Téléchargez votre CNI ou Passeport pour remplir automatiquement vos informations personnelles.
                      </p>
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="ocr-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        <Upload className="mr-2 h-4 w-4" />
                        importer document
                      </Label>
                      <Input
                        id="ocr-upload"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleOCR(e.target.files[0])
                        }}
                      />
                    </div>
                  </div>
                </div>

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
              </div>
            )}

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
              <div className="grid gap-4">
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
              </div>
            )}

            {/* Step 3: Formation */}
            {currentStep === 3 && (
              <div className="grid gap-4">
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
                {selectedClass && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Formation selectionnee:</span> {selectedClass.nom}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Niveau: {selectedClass.niveau} - {formData.ecole}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="grid gap-6">
                <div className="p-4 bg-muted rounded-lg text-sm">
                  <p className="font-medium mb-2">Documents requis:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Copie de la carte d&apos;identite ou passeport (obligatoire)</li>
                    <li>Dernier diplome obtenu ou releve de notes (obligatoire)</li>
                    <li>Certificat de scolarite (optionnel)</li>
                    <li>Certificat medical (optionnel)</li>
                  </ul>
                </div>

                <div className="grid gap-4">
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
                      {formData.documents.cni && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
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
                      {formData.documents.diplome && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
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
                      {formData.documents.certificatScolarite && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Certificat medical (optionnel)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="flex-1"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFormData(prev => ({
                              ...prev,
                              documents: { ...prev.documents, certificatMedical: e.target.files![0].name }
                            }))
                          }
                        }}
                      />
                      {formData.documents.certificatMedical && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Precedent
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
                  {isSubmitting ? (
                    "Soumission en cours..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Soumettre ma candidature
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
