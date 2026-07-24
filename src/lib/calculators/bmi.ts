export interface BmiInput {
  heightCm: number;
  weightKg: number;
}

export type BmiCategory = "저체중" | "정상" | "비만전단계" | "1단계 비만" | "2단계 비만" | "3단계(고도) 비만";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  standardWeight: number;
  weightDiff: number;
}

function classify(bmi: number): BmiCategory {
  if (bmi < 18.5) return "저체중";
  if (bmi < 23) return "정상";
  if (bmi < 25) return "비만전단계";
  if (bmi < 30) return "1단계 비만";
  if (bmi < 35) return "2단계 비만";
  return "3단계(고도) 비만";
}

export function calculateBmi(input: BmiInput): BmiResult | null {
  const { heightCm, weightKg } = input;
  if (heightCm <= 0 || weightKg <= 0) return null;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const standardWeight = heightM * heightM * 22;

  return {
    bmi,
    category: classify(bmi),
    standardWeight,
    weightDiff: weightKg - standardWeight,
  };
}
