import React from 'react'

type StatProps = {
  label: string;
  value: string;
}

const Stat = ({ label, value }: StatProps) => {
  return (
    <div>
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="text-lg font-medium">{value}</dd>
    </div>
  )
}

export default Stat