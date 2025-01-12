'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
      const response = await fetch('/api/csv-processing', {
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
      console.log(data)
      setResult(data.days)
    } catch (err) {
      setError('Failed to process data. Please check your input and try again.')
      console.error('Error submitting data:', err)
    }
  }

  const groupByWeeks = (days: { date: string; am: string; pm: string }[]) => {
    const weeks: { weekStartDate: string; weekMarks: string[] }[] = []
    let currentWeekMarks: string[] = []
    let currentWeekStartDate: string | null = null

    days.forEach((day, index) => {
      const date = new Date(day.date)
      const dayOfWeek = date.getDay() // Sunday = 0, Monday = 1, ..., Saturday = 6

      if (dayOfWeek === 0 || !currentWeekStartDate) {
        // Start a new week
        if (currentWeekStartDate) {
          weeks.push({ weekStartDate: currentWeekStartDate, weekMarks: currentWeekMarks })
        }
        currentWeekStartDate = day.date
        currentWeekMarks = []
      }

      // Add AM and PM marks for the day
      currentWeekMarks.push(day.am || "", day.pm || "")
    })

    if (currentWeekStartDate) {
      weeks.push({ weekStartDate: currentWeekStartDate, weekMarks: currentWeekMarks })
    }

    return weeks
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

      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Result</h2>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Week Start Date</th>
                {["Mon AM", "Mon PM", "Tue AM", "Tue PM", "Wed AM", "Wed PM", "Thu AM", "Thu PM", 
                  "Fri AM", "Fri PM", "Sat AM", "Sat PM", "Sun AM", "Sun PM"].map((day, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupByWeeks(result).map((week, weekIndex) => (
                <tr key={weekIndex}>
                  <td className="border border-gray-300 px-4 py-2 text-center font-bold">
                    {week.weekStartDate}
                  </td>
                  {week.weekMarks.map((mark, markIndex) => (
                    <td key={markIndex} className="border border-gray-300 px-4 py-2">
                      {mark}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
