'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import AttendanceResultsTable from '@/components/attendance-results-table'

export default function CSVDateForm() {
  const [csvData, setCsvData] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [result, setResult] = useState<{ date: string; am: string; pm: string }[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData, startDate, endDate }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data.days)
    } catch (err) {
      setError('Failed to process data. Please check your input and try again.')
      console.error('Error submitting data:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="csv-input">CSV Data</Label>
          <Textarea
            id="csv-input"
            placeholder="Paste your CSV data here"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">Submit</Button>
      </form>

      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}

      <AttendanceResultsTable data={result} />
    </div>
  )
}