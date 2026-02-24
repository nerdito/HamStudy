import technicianQuestions from './technician.json'
import generalQuestions from './general.json'
import extraQuestions from './extra.json'

export const questionPools = {
  technician: technicianQuestions,
  general: generalQuestions,
  extra: extraQuestions,
}

export const licenseNames = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra',
}

export default questionPools
