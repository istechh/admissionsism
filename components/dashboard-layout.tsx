"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  LogOut,
  Home,
  FileText,
  Users,
  CheckCircle,
  Monitor,
  BarChart3,
  Settings
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import type { UserRole } from "@/lib/store"

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  candidat: [
    { label: "Accueil", href: "/candidat", icon: <Home className="h-4 w-4" /> },
    { label: "Ma candidature", href: "/candidat/candidature", icon: <FileText className="h-4 w-4" /> },
    { label: "Suivi", href: "/candidat/suivi", icon: <BarChart3 className="h-4 w-4" /> },
  ],
  agent: [
    { label: "Tableau de bord", href: "/agent", icon: <Home className="h-4 w-4" /> },
    { label: "Candidatures", href: "/agent/candidatures", icon: <FileText className="h-4 w-4" /> },
    { label: "Nouvelle saisie", href: "/agent/saisie", icon: <Users className="h-4 w-4" /> },
  ],
  directeur: [
    { label: "Tableau de bord", href: "/directeur", icon: <Home className="h-4 w-4" /> },
    { label: "Validations", href: "/directeur/validations", icon: <CheckCircle className="h-4 w-4" /> },
    { label: "Statistiques", href: "/directeur/stats", icon: <BarChart3 className="h-4 w-4" /> },
  ],
  superviseur: [
    { label: "Tableau de bord", href: "/superviseur", icon: <Home className="h-4 w-4" /> },
    { label: "Toutes les candidatures", href: "/superviseur/candidatures", icon: <FileText className="h-4 w-4" /> },
    { label: "Statistiques", href: "/superviseur/stats", icon: <BarChart3 className="h-4 w-4" /> },
  ],
  it: [
    { label: "Tableau de bord", href: "/it", icon: <Home className="h-4 w-4" /> },
    { label: "Comptes a creer", href: "/it/comptes", icon: <Monitor className="h-4 w-4" /> },
    { label: "Historique", href: "/it/historique", icon: <FileText className="h-4 w-4" /> },
  ],
  admin: [
    { label: "Tableau de bord", href: "/admin", icon: <Home className="h-4 w-4" /> },
    { label: "Utilisateurs", href: "/admin/utilisateurs", icon: <Users className="h-4 w-4" /> },
    { label: "Parametres", href: "/admin/parametres", icon: <Settings className="h-4 w-4" /> },
  ],
}

const roleLabels: Record<UserRole, string> = {
  candidat: "Candidat",
  agent: "Agent d'admission",
  directeur: "Directeur",
  superviseur: "Superviseur",
  it: "Equipe IT",
  admin: "Administrateur",
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) {
    router.push("/")
    return null
  }

  const navItems = navItemsByRole[user.role] || []

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <img src="/ism-logo.jpg" alt="ISM Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ISM Admissions</h1>
              <p className="text-xs text-sidebar-foreground/70">{roleLabels[user.role]}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="mb-3">
            <p className="font-medium text-sm">{user.prenom} {user.nom}</p>
            <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Deconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  )
}
