export interface AgeInput {
  birthDate: string;
  referenceDate: string;
}

export interface AgeResult {
  internationalAge: number;
  koreanCountingAge: number;
  yearAge: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
}

export function calculateAge(input: AgeInput): AgeResult | null {
  const { birthDate, referenceDate } = input;
  if (!birthDate || !referenceDate) return null;

  const birth = new Date(birthDate);
  const ref = new Date(referenceDate);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime()) || birth > ref) return null;

  let internationalAge = ref.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    ref.getMonth() > birth.getMonth() ||
    (ref.getMonth() === birth.getMonth() && ref.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) internationalAge -= 1;

  const yearAge = ref.getFullYear() - birth.getFullYear();
  const koreanCountingAge = yearAge + 1;

  let nextBirthdayDate = new Date(ref.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthdayDate < ref) {
    nextBirthdayDate = new Date(ref.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilNextBirthday = Math.round((nextBirthdayDate.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));

  return {
    internationalAge,
    koreanCountingAge,
    yearAge,
    nextBirthday: `${nextBirthdayDate.getFullYear()}-${String(nextBirthdayDate.getMonth() + 1).padStart(2, "0")}-${String(nextBirthdayDate.getDate()).padStart(2, "0")}`,
    daysUntilNextBirthday,
  };
}
