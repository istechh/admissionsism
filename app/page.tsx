"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react"

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

  // Redirect if logged in
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
      setIsLoading(false)
    }
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column: Visual & Branding (Desktop) - Professional Solid Style */}
      <div className="hidden lg:flex relative bg-[#0f172a] flex-col justify-between p-12 text-white overflow-hidden">
        {/* Abstract Branding Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 via-transparent to-orange-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 flex items-center justify-center">
              <img src="/ism-logo.jpg" alt="ISM Logo" className="h-full w-full object-contain rounded" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Groupe ISM</span>
          </div>

          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Portail <br /> d'Admission
          </h1>
          <p className="text-xl text-white/80 max-w-md font-light">
            Gestion centralisée des candidatures et suivi académique en temps réel.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
            <span className="font-medium">Accès Sécurisé pour le Personnel</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-orange-500" />
            <span className="font-medium">Tableau de Bord de Supervision</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          © 2026 Groupe ISM • Plateforme version 2.0
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex flex-col lg:justify-center min-h-screen bg-gray-50 lg:bg-white">

        {/* Mobile Hero Header - Clean Solid */}
        <div className="lg:hidden relative h-48 w-full bg-[#0f172a] flex flex-col justify-end p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 to-transparent"></div>

          <div className="relative z-10 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 bg-white/10 backdrop-blur rounded p-0.5">
                <img src="/ism-logo.jpg" alt="ISM Logo" className="h-full w-full object-contain rounded-sm" />
              </div>
              <span className="font-bold tracking-tight text-lg">Groupe ISM</span>
            </div>
            <h1 className="text-2xl font-bold leading-tight mb-1">
              Portail d'Admission
            </h1>
          </div>
        </div>

        {/* Content Container (Mobile: -margin to overlap header, Desktop: centered) */}
        <div className="w-full max-w-md mx-auto p-6 lg:p-0 -mt-6 lg:mt-0 relative z-20">
          <Card className="border-0 shadow-lg lg:shadow-none overflow-hidden">
            <CardHeader className="pb-2 pt-6 text-center space-y-1 lg:hidden">
              <CardTitle className="text-xl">Bienvenue</CardTitle>
              <CardDescription>Connectez-vous à votre espace</CardDescription>
            </CardHeader>

            <div className="hidden lg:flex flex-col space-y-2 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Portail d'Admission</h2>
              <p className="text-muted-foreground">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>

            <CardContent className="p-0 lg:p-6 space-y-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Candidature</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 px-4 lg:px-0 pb-4 lg:pb-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Académique</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="prénom.nom@ism.edu.sn"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                        {error}
                      </div>
                    )}

                    <Button className="w-full h-11 text-base bg-amber-700 hover:bg-amber-800 text-white" type="submit" disabled={isLoading}>
                      {isLoading ? "Authentification..." : "Se connecter"}
                    </Button>
                  </form>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Comptes de Démonstration
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex flex-col gap-1 p-2 rounded bg-amber-50 border border-amber-200">
                      <span className="font-semibold text-amber-900">Superviseur:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">superviseur@ism.sn</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-mono text-xs font-bold text-amber-700">sup123</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-2 rounded bg-gray-50 border border-gray-200">
                      <span className="font-semibold text-gray-900">Directeur:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">directeur@ism.sn</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-mono text-xs font-bold">dir123</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-2 rounded bg-gray-50 border border-gray-200">
                      <span className="font-semibold text-gray-900">Agent:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">agent@ism.sn</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-mono text-xs font-bold">agent123</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-2 rounded bg-gray-50 border border-gray-200">
                      <span className="font-semibold text-gray-900">IT:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">it@ism.sn</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-mono text-xs font-bold">it123</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

              <TabsContent value="register" className="space-y-4 px-4 lg:px-0 pb-4 lg:pb-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input placeholder="Jean" value={registerPrenom} onChange={e => setRegisterPrenom(e.target.value)} className="h-11" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input placeholder="Diop" value={registerNom} onChange={e => setRegisterNom(e.target.value)} className="h-11" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Personnel</Label>
                    <Input type="email" placeholder="jean.diop@gmail.com" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} className="h-11" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <Input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} className="h-11" required />
                  </div>

                  {error && (
                    <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <Button className="w-full h-11 text-base group" type="submit" disabled={isLoading}>
                    {isLoading ? "Création..." : "Démarrer ma candidature"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8 pb-8 lg:pb-0">
          En continuant, vous acceptez nos <a href="#" className="underline hover:text-primary">Conditions d'utilisation</a>.
        </p>
      </div>
    </div>
  </div>
  )
}
