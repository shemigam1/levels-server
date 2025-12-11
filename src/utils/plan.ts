/** 
export function getPlanDetails(plan: string) {
  switch (plan) {
    case "daily":
      return { slots: 1 };
    case "weekly":
      return { slots: 6 };
    case "monthly":
      return { slots: 30 };
    default:
      throw new Error("Invalid plan");
  }
}
  not needed now
//*/ 