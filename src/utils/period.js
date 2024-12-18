const determineTimePeriod = (hour) => {
  if (hour >= 3 && hour < 6) return "Dawn";
  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 14) return "Noon";
  if (hour >= 14 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 22) return "Evening";
  if (hour >= 22 || hour < 3) return "Night";
  return "Invalid hour";
};

const greetingPeriod = (hour) => {
  if (hour >= 6 && hour < 12) return "Morning!";
  if (hour >= 12 && hour < 18) return "Afternoon!";
  if (hour >= 18 && hour < 21) return "Evening!";
  return "Night!";
};

export { determineTimePeriod, greetingPeriod };
