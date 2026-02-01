export interface OCRResult {
    success: boolean;
    data?: {
        nom: string;
        prenom: string;
        dateNaissance: string; // YYYY-MM-DD
        lieuNaissance: string;
        sexe: 'M' | 'F';
        cniNumber: string;
        expirationDate: string; // YYYY-MM-DD
    };
    notes?: {
        matiere: string;
        note: number;
    }[];
    moyenne?: number;
    alerts?: string[]; // "Expire dans 30 jours", "Flou"
}

export interface PredictiveScoreDetails {
    score: number; // 0-100
    breakdown: {
        academic: number; // Max 70
        serie: number; // Max 15
        experience: number; // Max 10 (MBA only)
        speed: number; // Max 5
    };
    color: 'green' | 'yellow' | 'orange' | 'red';
    label: string;
}

/**
 * Simule l'analyse OCR d'un document (CNI ou Relevé de notes)
 * Délai simulé : 1.5 secondes
 */
export async function simulateOCR(file: File, type: 'cni' | 'notes'): Promise<OCRResult> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (file.name.includes('flou')) {
                resolve({ success: false, alerts: ['Document illisible ou flou'] });
                return;
            }
            if (file.name.includes('expire')) {
                resolve({
                    success: true,
                    data: mockCNIData,
                    alerts: ['CNI Expirée (2020)']
                });
                return;
            }

            if (type === 'cni') {
                resolve({
                    success: true,
                    data: mockCNIData,
                    alerts: []
                });
            } else {
                resolve({
                    success: true,
                    moyenne: 15.5,
                    notes: [
                        { matiere: 'Maths', note: 16 },
                        { matiere: 'Français', note: 14 },
                        { matiere: 'Anglais', note: 17 }
                    ],
                    alerts: []
                })
            }
        }, 1500); // Délai réaliste
    });
}

/**
 * Calcul du score prédictif selon l'algorithme du CDC v2.0 Section 7.2.1
 */
export function calculatePredictiveScore(
    moyenne: number,
    bacSerie: string,
    dateDepot: Date,
    isMBA: boolean = false,
    experienceYears: number = 0
): PredictiveScoreDetails {
    let score = 0;
    const breakdown = { academic: 0, serie: 0, experience: 0, speed: 0 };

    // 1. Académique (70%)
    if (moyenne > 14) breakdown.academic = 70;
    else if (moyenne >= 12) breakdown.academic = 50;
    else if (moyenne >= 10) breakdown.academic = 30;
    else breakdown.academic = 10;
    score += breakdown.academic;

    // 2. Série du Bac (15%)
    const serie = bacSerie.toLowerCase();
    if (serie.includes('s') || serie.includes('scientifique')) breakdown.serie = 15;
    else if (serie.includes('es') || serie.includes('economique')) breakdown.serie = 12;
    else if (serie.includes('l') || serie.includes('litteraire')) breakdown.serie = 8;
    else breakdown.serie = 5;
    score += breakdown.serie;

    // 3. Expérience (MBA uniquement - 10%) ou Bonus standard
    if (isMBA) {
        if (experienceYears > 5) breakdown.experience = 10;
        else if (experienceYears >= 3) breakdown.experience = 7;
        else breakdown.experience = 3;
        score += breakdown.experience;
    }

    // 4. Rapidité de dépôt (5%) - Hypothèse ouverture inscriptions : 1er Janvier de l'année
    const openingDate = new Date(dateDepot.getFullYear(), 0, 1);
    const diffTime = Math.abs(dateDepot.getTime() - openingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Simplification : si dépôt dans les 7 jours de la création du dossier/ouverture
    // Pour la démo, on considère < 7 jours par rapport à maintenant
    breakdown.speed = 5; // On donne toujours le bonus rapidité pour la démo positive
    score += breakdown.speed;

    // Détermination couleur / label
    let color: PredictiveScoreDetails['color'] = 'red';
    let label = 'Faible';

    if (score >= 80) { color = 'green'; label = 'Excellent'; }
    else if (score >= 60) { color = 'yellow'; label = 'Bon'; }
    else if (score >= 40) { color = 'orange'; label = 'Moyen'; }

    return { score, breakdown, color, label };
}

// Données Mock CNI
const mockCNIData = {
    nom: "Diop",
    prenom: "Amadou",
    dateNaissance: "2005-05-15",
    lieuNaissance: "Dakar",
    sexe: "M" as "M",
    cniNumber: "1234567890123",
    expirationDate: "2030-05-15"
};

export interface AccountDetails {
    email: string;
    passwordTemp: string;
    studentId: string;
}

export function generateAccountDetails(nom: string, prenom: string): AccountDetails {
    // Format: prenom.nom@ism.edu.sn (sanitize accents/spaces)
    const sanitize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ".");
    const email = `${sanitize(prenom)}.${sanitize(nom)}@ism.edu.sn`;

    // Password: ISM + Year + 4 random digits
    const passwordTemp = `ISM2026${Math.floor(1000 + Math.random() * 9000)}`;

    // StudentID: EXT-Year-Random
    const studentId = `EXT-26-${Math.floor(10000 + Math.random() * 90000)}`;

    return { email, passwordTemp, studentId };
}

/**
 * Recommande une filière basée sur le score prédictif
 */
export function recommendStream(predictiveScore: PredictiveScoreDetails | undefined, bacSerie?: string): string {
    if (!predictiveScore) return "Général";

    const { score, breakdown } = predictiveScore;
    
    // Si score académique très élevé (>60)
    if (breakdown.academic >= 70) {
        if (breakdown.serie >= 12) {
            return "Informatique"; // Filière technique exigeante
        }
        return "Gestion"; // Filière générale haut niveau
    }
    
    // Score académique bon (40-60)
    if (breakdown.academic >= 40) {
        if (breakdown.serie >= 12) {
            return "Engineering"; // Filière science/tech
        }
        return "Management"; // Filière business
    }
    
    // Par défaut selon série du bac
    if (bacSerie) {
        const serie = bacSerie.toLowerCase();
        if (serie.includes('s') || serie.includes('scientifique')) return "Informatique";
        if (serie.includes('es') || serie.includes('economique')) return "Gestion";
        if (serie.includes('l') || serie.includes('litteraire')) return "Management";
    }
    
    return "Général";
}
