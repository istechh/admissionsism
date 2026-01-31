"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dataStore, type Application } from "@/lib/store"
import { Clock, CheckCircle, AlertCircle, FileText, User, GraduationCap, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; color: string; step: number }> = {
  soumise: { label: "Soumise", color: "bg-blue-100 text-blue-800", step: 1 },
  en_verification: { label: "En verification", color: "bg-yellow-100 text-yellow-800", step: 2 },
  a_completer: { label: "A completer", color: "bg-orange-100 text-orange-800", step: 2 },
  verifiee: { label: "Verifiee", color: "bg-purple-100 text-purple-800", step: 2 },
  validee: { label: "Validee", color: "bg-green-100 text-green-800", step: 3 },
  rejetee: { label: "Rejetee", color: "bg-red-100 text-red-800", step: 3 },
  en_attente_it: { label: "En attente IT", color: "bg-indigo-100 text-indigo-800", step: 4 },
  complete: { label: "Complete", color: "bg-emerald-100 text-emerald-800", step: 5 },
}

const timelineSteps = [
  { step: 1, label: "Soumission", icon: FileText },
  { step: 2, label: "Verification", icon: User },
  { step: 3, label: "Validation", icon: CheckCircle },
  { step: 4, label: "Traitement IT", icon: GraduationCap },
  { step: 5, label: "Finalise", icon: Mail },
]

function SuiviContent() {
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("id")
  const [application, setApplication] = useState<Application | null>(null)

  useEffect(() => {
    if (applicationId) {
      const app = dataStore.getApplicationById(applicationId)
      setApplication(app || null)
    }
  }, [applicationId])

  if (!application) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold">Candidature non trouvee</h2>
            <p className="text-muted-foreground">Verifiez le numero de dossier ou retournez a l&apos;accueil</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentStatus = statusConfig[application.status]
  const currentStep = currentStatus?.step || 1

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-foreground">Suivi de candidature</h1>
          <Badge className={currentStatus?.color}>{currentStatus?.label}</Badge>
        </div>
        <p className="text-muted-foreground">Dossier {application.numero}</p>
      </div>

      {/* Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {timelineSteps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = currentStep > step.step
              const isCurrent = currentStep === step.step
              const isRejected = application.status === "rejetee" && step.step === 3
              
              return (
                <div key={step.step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isRejected
                          ? "bg-destructive text-destructive-foreground"
                          : isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <span className="text-xs mt-2 text-muted-foreground text-center hidden sm:block">
                      {step.label}
                    </span>
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={cn(
                        "w-full h-1 mx-2 rounded",
                        currentStep > step.step ? "bg-primary" : "bg-muted"
                      )}
                      style={{ minWidth: "40px" }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Application details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom complet</span>
              <span className="font-medium">{application.prenom} {application.nom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de naissance</span>
              <span className="font-medium">{new Date(application.dateNaissance).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lieu de naissance</span>
              <span className="font-medium">{application.lieuNaissance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nationalite</span>
              <span className="font-medium">{application.nationalite}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formation demandee</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ecole</span>
              <span className="font-medium">{application.ecole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classe</span>
              <span className="font-medium">{application.classe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Niveau</span>
              <span className="font-medium">{application.niveau}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complete status info */}
      {application.status === "complete" && application.emailISM && (
        <Card className="mt-6 border-emerald-200 bg-emerald-50">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-800">Admission finalisee</CardTitle>
            <CardDescription className="text-emerald-700">
              Felicitations! Votre admission est complete. Voici vos identifiants:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-emerald-700">Email ISM</span>
              <span className="font-medium text-emerald-900">{application.emailISM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Mot de passe temporaire</span>
              <span className="font-medium text-emerald-900">{application.motDePasseTemp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-700">Numero carte etudiant</span>
              <span className="font-medium text-emerald-900">{application.numeroCarteEtudiant}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {application.commentaires.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucun commentaire pour le moment</p>
            ) : (
              application.commentaires.map((comment, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.auteur}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString("fr-FR")} a {new Date(comment.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.message}</p>
                  </div>
                </div>
              ))
            )}
            {/* Creation entry */}
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-muted-foreground" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">Systeme</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(application.dateCreation).toLocaleDateString("fr-FR")} a {new Date(application.dateCreation).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Candidature soumise</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SuiviPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="p-8 flex items-center justify-center">
          <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }>
        <SuiviContent />
      </Suspense>
    </DashboardLayout>
  )
}
