import React from 'react'
import InvestmentCalculator from '../sipLumpsum/invesementCalculator'
import GoalBasedSIPCalculator from '../goalBasedCalculator/goalBasedCalculator'
import './financial.css'
const Financials = () => {
  return (
    <div>
      <InvestmentCalculator/>
      <GoalBasedSIPCalculator/>
    </div>
  )
}

export default Financials
