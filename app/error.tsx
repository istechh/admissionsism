"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Une erreur est survenue</h1>
                    <p className="text-slate-600">
                        Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer.
                    </p>
                </div>
                <Button onClick={reset} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Réessayer
                </Button>
            </div>
        </div>
    )
}
