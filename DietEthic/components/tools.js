export const calculateGoalWeight = (height) => {
    const heightInMeters = parseFloat(height) / 100;
    if (!heightInMeters || heightInMeters <= 0) return null;
    const targetBMI = 22;
    return (targetBMI * (heightInMeters ** 2)).toFixed(2);
  };
  