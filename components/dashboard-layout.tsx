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
  Settings,
  Menu
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import type { UserRole } from "@/lib/store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="p-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <img src="/ism-logo.jpg" alt="ISM Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900">ISM Admissions</h1>
            <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User info & Logout */}
      <div className="p-3 border-t border-slate-100 mt-auto">
        <div className="mb-3">
          <p className="font-medium text-xs text-slate-900">{user.prenom} {user.nom}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={handleLogout}
        >
          <LogOut className="h-3 w-3 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded">
            <img src="/ism-logo.jpg" alt="ISM Logo" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold text-sm">ISM</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-white">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white flex-col border-r border-slate-100 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 overflow-auto w-full">
        {children}
      </main>
    </div>
  )
}
