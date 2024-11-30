export const calculateGoalWeight = (height) => {
    const heightInMeters = parseFloat(height) / 100;
    if (!heightInMeters || heightInMeters <= 0) return null;
    const targetBMI = 22;
    return (targetBMI * (heightInMeters ** 2)).toFixed(2);
  };
  
  export const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return null; // Validation des entrées
  
    if (gender === "Male") {
      return (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age).toFixed(2);
    } else if (gender === "Female") {
      return (447.593 + 9.247 * weight + 3.098 * height - 4.330 * age).toFixed(2);
    }
  
    return null; // Retourne `null` si le genre n'est pas valide
  };
  