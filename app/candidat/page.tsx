"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { dataStore, type Application } from "@/lib/store"
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  soumise: { label: "Soumise", color: "bg-blue-100 text-blue-800", icon: Clock },
  en_verification: { label: "En verification", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  a_completer: { label: "A completer", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  verifiee: { label: "Verifiee", color: "bg-purple-100 text-purple-800", icon: CheckCircle },
  validee: { label: "Validee", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejetee: { label: "Rejetee", color: "bg-red-100 text-red-800", icon: AlertCircle },
  en_attente_it: { label: "En attente IT", color: "bg-indigo-100 text-indigo-800", icon: Clock },
  complete: { label: "Complete", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
}

export default function CandidatDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (user) {
      const apps = dataStore.getApplicationsByCandidat(user.id)
      setApplications(apps)
    }
  }, [user])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenue, {user?.prenom} {user?.nom}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerez votre candidature a l&apos;ISM depuis votre espace personnel
          </p>
        </div>

        {applications.length === 0 ? (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Aucune candidature
              </CardTitle>
              <CardDescription>
                Vous n&apos;avez pas encore soumis de candidature. Commencez des maintenant!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/candidat/candidature">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Soumettre ma candidature
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Mes candidatures</h2>
              <Link href="/candidat/candidature">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle candidature
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {applications.map((app) => {
                const status = statusConfig[app.status]
                const StatusIcon = status?.icon || Clock
                return (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{app.numero}</h3>
                            <Badge className={status?.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {app.ecole} - {app.classe}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Soumise le {new Date(app.dateCreation).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <Link href={`/candidat/suivi?id=${app.id}`}>
                          <Button variant="outline" size="sm">
                            Voir le suivi
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Etape 1</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Soumission</h3>
              <p className="text-sm text-muted-foreground">
                Remplissez le formulaire et telechargez vos documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Etape 2</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Verification</h3>
              <p className="text-sm text-muted-foreground">
                Nos agents verifient la conformite de votre dossier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Etape 3</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">Validation</h3>
              <p className="text-sm text-muted-foreground">
                Le directeur valide votre candidature
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
