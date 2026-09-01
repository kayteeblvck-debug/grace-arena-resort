import { useId, useState } from 'react'

export interface AccordionEntry {
  question: string
  answer: string
}

export default function Accordion({ entries }: { entries: AccordionEntry[] }) {
  // Opening one closes the rest — the answers are short and this keeps the page still.
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()

  return (
    <div>
      {entries.map((entry, index) => {
        const open = openIndex === index
        const panelId = `${baseId}-panel-${index}`

        return (
          <div className={`accordion-item ${open ? 'open' : ''}`} key={entry.question}>
            <h3>
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                {entry.question}
                <span className="accordion-icon" aria-hidden="true" />
              </button>
            </h3>
            {open && (
              <div className="accordion-panel" id={panelId}>
                {entry.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
