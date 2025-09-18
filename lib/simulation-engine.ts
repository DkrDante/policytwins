import type { Avatar } from "./database"

export interface PolicyParameters {
  type: "tax" | "healthcare" | "education" | "housing" | "employment" | "social_security"
  name: string
  description: string
  parameters: Record<string, any>
}

export interface SimulationResult {
  financial_impact: {
    monthly_change: number
    annual_change: number
    percentage_change: number
  }
  quality_of_life: {
    score_change: number
    affected_areas: string[]
  }
  long_term_effects: {
    five_year_projection: number
    retirement_impact?: number
    education_opportunities?: string[]
  }
  detailed_breakdown: {
    category: string
    impact: string
    amount?: number
  }[]
  recommendations: string[]
}

export class PolicySimulationEngine {
  static async simulate(avatar: Avatar, policy: PolicyParameters): Promise<SimulationResult> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    switch (policy.type) {
      case "tax":
        return this.simulateTaxPolicy(avatar, policy)
      case "healthcare":
        return this.simulateHealthcarePolicy(avatar, policy)
      case "education":
        return this.simulateEducationPolicy(avatar, policy)
      case "housing":
        return this.simulateHousingPolicy(avatar, policy)
      case "employment":
        return this.simulateEmploymentPolicy(avatar, policy)
      case "social_security":
        return this.simulateSocialSecurityPolicy(avatar, policy)
      default:
        return this.simulateGenericPolicy(avatar, policy)
    }
  }

  private static simulateTaxPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const taxRate = policy.parameters.rate || 0.05
    const threshold = policy.parameters.threshold || 50000

    let monthlyChange = 0
    if (avatar.income > threshold) {
      const taxableIncome = avatar.income - threshold
      monthlyChange = -(taxableIncome * taxRate) / 12
    }

    const annualChange = monthlyChange * 12
    const percentageChange = (annualChange / avatar.income) * 100

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(annualChange),
        percentage_change: Math.round(percentageChange * 100) / 100,
      },
      quality_of_life: {
        score_change: monthlyChange < -200 ? -2 : monthlyChange < -100 ? -1 : 0,
        affected_areas: monthlyChange < 0 ? ["Disposable Income", "Savings"] : [],
      },
      long_term_effects: {
        five_year_projection: Math.round(annualChange * 5),
        retirement_impact: Math.round(annualChange * 0.1 * 20), // Assuming 20 years to retirement
      },
      detailed_breakdown: [
        {
          category: "Tax Liability",
          impact: monthlyChange < 0 ? "Increased tax burden" : "No additional tax",
          amount: Math.abs(monthlyChange),
        },
        {
          category: "Take-home Pay",
          impact: monthlyChange < 0 ? "Reduced monthly income" : "No change",
          amount: Math.abs(monthlyChange),
        },
      ],
      recommendations:
        monthlyChange < -100
          ? [
              "Consider adjusting budget to account for reduced income",
              "Look into tax-advantaged savings accounts",
              "Consult with a tax professional for optimization strategies",
            ]
          : ["Monitor future tax policy changes"],
    }
  }

  private static simulateHealthcarePolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const premiumChange = policy.parameters.premium_change || 0
    const deductibleChange = policy.parameters.deductible_change || 0
    const coverageImprovement = policy.parameters.coverage_improvement || false

    const monthlyChange = -premiumChange / 12
    const annualChange = -premiumChange
    const percentageChange = (annualChange / avatar.income) * 100

    const qualityChange = coverageImprovement ? 2 : premiumChange > 1000 ? -1 : 0

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(annualChange),
        percentage_change: Math.round(percentageChange * 100) / 100,
      },
      quality_of_life: {
        score_change: qualityChange,
        affected_areas: coverageImprovement
          ? ["Healthcare Access", "Peace of Mind"]
          : premiumChange > 0
            ? ["Healthcare Costs", "Budget Stress"]
            : [],
      },
      long_term_effects: {
        five_year_projection: Math.round(annualChange * 5),
      },
      detailed_breakdown: [
        {
          category: "Healthcare Premiums",
          impact: premiumChange > 0 ? "Increased monthly premiums" : "Reduced monthly premiums",
          amount: Math.abs(premiumChange / 12),
        },
        {
          category: "Deductible",
          impact: deductibleChange > 0 ? "Higher out-of-pocket costs" : "Lower out-of-pocket costs",
          amount: Math.abs(deductibleChange),
        },
      ],
      recommendations: [
        "Review your current healthcare needs and usage",
        "Compare available plan options during open enrollment",
        "Consider health savings account if eligible",
      ],
    }
  }

  private static simulateEducationPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const fundingIncrease = policy.parameters.funding_increase || 0
    const tuitionSupport = policy.parameters.tuition_support || 0

    // Education policies often have indirect benefits
    const monthlyChange = tuitionSupport / 12
    const qualityChange = fundingIncrease > 0 ? 1 : 0

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(tuitionSupport),
        percentage_change: Math.round((tuitionSupport / avatar.income) * 10000) / 100,
      },
      quality_of_life: {
        score_change: qualityChange,
        affected_areas: fundingIncrease > 0 ? ["Education Quality", "Future Opportunities"] : [],
      },
      long_term_effects: {
        five_year_projection: Math.round(tuitionSupport * 5),
        education_opportunities:
          fundingIncrease > 0
            ? [
                "Improved local school quality",
                "Enhanced vocational training programs",
                "Better college preparation resources",
              ]
            : [],
      },
      detailed_breakdown: [
        {
          category: "Education Funding",
          impact: fundingIncrease > 0 ? "Increased public education investment" : "No change in funding",
          amount: fundingIncrease,
        },
        {
          category: "Tuition Assistance",
          impact: tuitionSupport > 0 ? "Direct tuition support provided" : "No tuition assistance",
          amount: tuitionSupport,
        },
      ],
      recommendations: [
        "Research available educational programs in your area",
        "Consider long-term career development opportunities",
        "Stay informed about application deadlines for assistance programs",
      ],
    }
  }

  private static simulateHousingPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const housingCredit = policy.parameters.housing_credit || 0
    const rentControl = policy.parameters.rent_control || false
    const downPaymentAssistance = policy.parameters.down_payment_assistance || 0

    const monthlyChange = housingCredit / 12
    const annualChange = housingCredit
    const percentageChange = (annualChange / avatar.income) * 100

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(annualChange),
        percentage_change: Math.round(percentageChange * 100) / 100,
      },
      quality_of_life: {
        score_change: housingCredit > 0 || rentControl ? 1 : 0,
        affected_areas: ["Housing Affordability", "Financial Stability"],
      },
      long_term_effects: {
        five_year_projection: Math.round(annualChange * 5),
      },
      detailed_breakdown: [
        {
          category: "Housing Credit",
          impact: housingCredit > 0 ? "Tax credit for housing costs" : "No housing credit",
          amount: housingCredit,
        },
        {
          category: "Rent Stability",
          impact: rentControl ? "Protected from excessive rent increases" : "No rent protection",
        },
        {
          category: "Down Payment Help",
          impact: downPaymentAssistance > 0 ? "Assistance with home purchase" : "No purchase assistance",
          amount: downPaymentAssistance,
        },
      ],
      recommendations: [
        "Explore first-time homebuyer programs if applicable",
        "Consider long-term housing stability in your area",
        "Review local housing market trends",
      ],
    }
  }

  private static simulateEmploymentPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const minimumWageIncrease = policy.parameters.minimum_wage_increase || 0
    const jobTrainingFunding = policy.parameters.job_training_funding || 0
    const unemploymentBenefitIncrease = policy.parameters.unemployment_benefit_increase || 0

    let monthlyChange = 0
    if (avatar.employment_status.includes("employed") && avatar.income < 35000) {
      monthlyChange = minimumWageIncrease * 40 * 4.33 // Assuming 40 hours/week
    }

    const annualChange = monthlyChange * 12
    const percentageChange = avatar.income > 0 ? (annualChange / avatar.income) * 100 : 0

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(annualChange),
        percentage_change: Math.round(percentageChange * 100) / 100,
      },
      quality_of_life: {
        score_change: monthlyChange > 0 || jobTrainingFunding > 0 ? 1 : 0,
        affected_areas:
          monthlyChange > 0
            ? ["Income", "Job Security"]
            : jobTrainingFunding > 0
              ? ["Career Development", "Skills"]
              : [],
      },
      long_term_effects: {
        five_year_projection: Math.round(annualChange * 5),
      },
      detailed_breakdown: [
        {
          category: "Wage Impact",
          impact: monthlyChange > 0 ? "Increased minimum wage benefits" : "No direct wage impact",
          amount: Math.abs(monthlyChange),
        },
        {
          category: "Training Opportunities",
          impact: jobTrainingFunding > 0 ? "Enhanced job training programs" : "No additional training funding",
        },
      ],
      recommendations: [
        "Explore available job training programs",
        "Consider skill development opportunities",
        "Stay informed about labor market changes in your field",
      ],
    }
  }

  private static simulateSocialSecurityPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    const benefitIncrease = policy.parameters.benefit_increase || 0
    const taxCapIncrease = policy.parameters.tax_cap_increase || 0

    let monthlyChange = 0

    // If retired or disabled, might receive benefit increase
    if (avatar.employment_status === "Retired" || avatar.employment_status === "Disabled/Unable to work") {
      monthlyChange = benefitIncrease / 12
    }

    // If high earner, might pay more in SS taxes
    if (avatar.income > 160000 && taxCapIncrease > 0) {
      monthlyChange -= ((avatar.income - 160000) * 0.062) / 12 // 6.2% SS tax rate
    }

    const annualChange = monthlyChange * 12
    const percentageChange = avatar.income > 0 ? (annualChange / avatar.income) * 100 : 0

    return {
      financial_impact: {
        monthly_change: Math.round(monthlyChange),
        annual_change: Math.round(annualChange),
        percentage_change: Math.round(percentageChange * 100) / 100,
      },
      quality_of_life: {
        score_change: monthlyChange > 0 ? 1 : monthlyChange < -50 ? -1 : 0,
        affected_areas: monthlyChange !== 0 ? ["Retirement Security", "Social Safety Net"] : [],
      },
      long_term_effects: {
        five_year_projection: Math.round(annualChange * 5),
        retirement_impact: Math.round(annualChange * 15), // Assuming 15 years of retirement
      },
      detailed_breakdown: [
        {
          category: "Social Security Benefits",
          impact: benefitIncrease > 0 ? "Increased monthly benefits" : "No benefit change",
          amount: benefitIncrease / 12,
        },
        {
          category: "Social Security Taxes",
          impact: taxCapIncrease > 0 && avatar.income > 160000 ? "Increased SS tax liability" : "No tax change",
        },
      ],
      recommendations: [
        "Review your Social Security statement annually",
        "Consider the long-term sustainability of the program",
        "Plan for retirement with multiple income sources",
      ],
    }
  }

  private static simulateGenericPolicy(avatar: Avatar, policy: PolicyParameters): SimulationResult {
    // Generic simulation for policies that don't fit specific categories
    const estimatedImpact = policy.parameters.estimated_monthly_impact || 0

    return {
      financial_impact: {
        monthly_change: estimatedImpact,
        annual_change: estimatedImpact * 12,
        percentage_change: avatar.income > 0 ? ((estimatedImpact * 12) / avatar.income) * 100 : 0,
      },
      quality_of_life: {
        score_change: estimatedImpact > 0 ? 1 : estimatedImpact < 0 ? -1 : 0,
        affected_areas: ["General Welfare"],
      },
      long_term_effects: {
        five_year_projection: estimatedImpact * 12 * 5,
      },
      detailed_breakdown: [
        {
          category: "Policy Impact",
          impact: "Estimated general impact on household",
          amount: Math.abs(estimatedImpact),
        },
      ],
      recommendations: [
        "Monitor policy implementation for actual impacts",
        "Stay informed about policy changes",
        "Adjust financial planning as needed",
      ],
    }
  }
}
