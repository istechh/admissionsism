"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dataStore, type Application } from "@/lib/store"
import { CheckCircle, User, Mail, CreditCard, GraduationCap } from "lucide-react"

export default function ITHistorique() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    const apps = dataStore.getApplications({ status: "complete" })
    setApplications(apps)
  }, [])

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Historique des admissions</h1>
          <p className="text-muted-foreground mt-1">
            Liste des comptes etudiants crees
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              {applications.length} admission{applications.length > 1 ? "s" : ""} finalisee{applications.length > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Aucune admission finalisee</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="border rounded-lg p-4 bg-emerald-50/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{app.prenom} {app.nom}</h3>
                          <Badge className="bg-emerald-100 text-emerald-800">Complete</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{app.numero}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{app.emailISM}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">{app.numeroCarteEtudiant}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span>{app.classe}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{app.ecole}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          Finalise le {new Date(app.dateMiseAJour).toLocaleDateString("fr-FR")} a {new Date(app.dateMiseAJour).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
