export const getCategories = (questions) => {
  const categories = new Set()
  questions.forEach(q => {
    const match = q.id.match(/^([A-Z]\d[A-Z])/)
    if (match) {
      categories.add(match[1])
    }
  })
  return Array.from(categories).sort()
}

export const getCategoryLabel = (categoryCode) => {
  const labels = {
    T1: 'FCC Rules',
    T2: 'Operating Procedures',
    T3: 'Radio Wave Propagation',
    T4: 'Electrical Principles',
    T5: 'Station Equipment',
    T6: 'Operating Modes',
    T7: 'Antennas',
    T8: 'Signals & Emission',
    T9: 'Practical Operating',
    G1: 'Rules & Regulations',
    G2: 'Operating Practices',
    G3: 'Radio Wave Propagation',
    G4: ' Amateur Practices',
    G5: 'Electrical Principles',
    G6: 'Circuit Components',
    G7: 'Station Equipment',
    G8: 'Signals & Emission Modes',
    G9: 'Antennas & Feedlines',
    E1: 'Commission Rules',
    E2: 'Operating Practices',
    E3: 'Radio Wave Propagation',
    E4: 'Amateur Radio Practices',
    E5: 'Electrical Principles',
    E6: 'Circuit Components',
    E7: 'Station Equipment',
    E8: 'Signals & Emission',
    E9: 'Antennas & Feedlines',
    E0: 'Comprehensive'
  }
  return labels[categoryCode] || categoryCode
}

export const filterQuestionsByCategory = (questions, selectedCategories) => {
  if (!selectedCategories || selectedCategories.length === 0) {
    return questions
  }
  return questions.filter(q => {
    const match = q.id.match(/^([A-Z]\d[A-Z])/)
    return match && selectedCategories.includes(match[1])
  })
}