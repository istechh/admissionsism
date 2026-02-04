import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                    <FileQuestion className="h-8 w-8 text-amber-600" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Page introuvable</h1>
                    <p className="text-slate-600">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                </div>
                <Link href="/">
                    <Button className="gap-2">
                        <Home className="h-4 w-4" />
                        Retour à l'accueil
                    </Button>
                </Link>
            </div>
        </div>
    )
}
