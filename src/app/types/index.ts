export type EvaluationType = {
    score: string,
    summary: {
        overallAssesment: string,
        specificStrengths: string[],
        areasOfImprovement: string[],
        finalRecommendation: string,
    }
}