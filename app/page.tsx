"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, Shield, Monitor, UserCheck } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { login, register, user } = useAuth()
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerNom, setRegisterNom] = useState("")
  const [registerPrenom, setRegisterPrenom] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Redirection si déjà connecté
  if (user) {
    const redirectPath = {
      candidat: "/candidat",
      agent: "/agent",
      directeur: "/directeur",
      superviseur: "/superviseur",
      it: "/it",
      admin: "/admin",
    }[user.role]
    router.push(redirectPath || "/")
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const loggedInUser = login(loginEmail, loginPassword)
    
    if (loggedInUser) {
      const redirectPath = {
        candidat: "/candidat",
        agent: "/agent",
        directeur: "/directeur",
        superviseur: "/superviseur",
        it: "/it",
        admin: "/admin",
      }[loggedInUser.role]
      router.push(redirectPath || "/")
    } else {
      setError("Email ou mot de passe incorrect")
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!registerEmail || !registerPassword || !registerNom || !registerPrenom) {
      setError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    register(registerEmail, registerPassword, registerNom, registerPrenom)
    router.push("/candidat")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-muted">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Section gauche - Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
                Bienvenue sur le Portail des Admissions
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Soumettez votre candidature en ligne et suivez son evolution en temps reel. 
                Une experience 100% numerique pour votre admission a l&apos;ISM.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Candidats</h3>
                  <p className="text-sm text-muted-foreground">
                    Creez votre compte et soumettez votre dossier de candidature
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <UserCheck className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Agents d&apos;Admission</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifiez les documents et gerez les candidatures sur place
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Directeurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Validez les candidatures et consultez les statistiques
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                <div className="p-2 bg-secondary/30 rounded-lg">
                  <Monitor className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Equipe IT</h3>
                  <p className="text-sm text-muted-foreground">
                    Creez les comptes etudiants et finalisez les admissions
                  </p>
                </div>
              </div>
            </div>

            {/* Comptes de démo */}
            <Card className="bg-card/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Comptes de demonstration</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p><span className="font-medium">Agent:</span> agent@ism.sn / agent123</p>
                <p><span className="font-medium">Directeur:</span> directeur@ism.sn / dir123</p>
                <p><span className="font-medium">Superviseur:</span> superviseur@ism.sn / sup123</p>
                <p><span className="font-medium">IT:</span> it@ism.sn / it123</p>
              </CardContent>
            </Card>
          </div>

          {/* Section droite - Formulaires */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Connexion</CardTitle>
              <CardDescription>
                Connectez-vous ou creez un compte candidat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Se connecter</TabsTrigger>
                  <TabsTrigger value="register">Creer un compte</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-prenom">Prenom</Label>
                        <Input
                          id="register-prenom"
                          placeholder="Prenom"
                          value={registerPrenom}
                          onChange={(e) => setRegisterPrenom(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-nom">Nom</Label>
                        <Input
                          id="register-nom"
                          placeholder="Nom"
                          value={registerNom}
                          onChange={(e) => setRegisterNom(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Mot de passe</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creation..." : "Creer mon compte candidat"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>2026 Institut Superieur de Management (ISM) - Tous droits reserves</p>
        </div>
      </footer>
    </div>
  )
}
