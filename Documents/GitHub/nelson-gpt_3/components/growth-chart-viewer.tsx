"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const GROWTH_CHARTS = {
  "weight-for-age": {
    title: "Weight-for-age percentiles",
    yAxis: "Weight (kg)",
    data: [
      { age: 0, p3: 2.9, p15: 3.2, p50: 3.5, p85: 3.9, p97: 4.2 },
      { age: 12, p3: 8.6, p15: 9.4, p50: 10.3, p85: 11.3, p97: 12.2 },
      { age: 24, p3: 10.8, p15: 11.8, p50: 12.9, p85: 14.1, p97: 15.3 },
      { age: 36, p3: 12.7, p15: 13.9, p50: 15.3, p85: 16.8, p97: 18.3 },
      { age: 48, p3: 14.4, p15: 15.8, p50: 17.4, p85: 19.2, p97: 21.0 },
      { age: 60, p3: 16.1, p15: 17.7, p50: 19.6, p85: 21.7, p97: 23.8 },
    ],
  },
  "height-for-age": {
    title: "Height-for-age percentiles",
    yAxis: "Height (cm)",
    data: [
      { age: 0, p3: 47.9, p15: 49.2, p50: 50.8, p85: 52.3, p97: 53.7 },
      { age: 12, p3: 71.0, p15: 72.9, p50: 75.2, p85: 77.5, p97: 79.5 },
      { age: 24, p3: 82.4, p15: 84.6, p50: 87.3, p85: 90.0, p97: 92.3 },
      { age: 36, p3: 91.4, p15: 93.9, p50: 97.0, p85: 100.1, p97: 102.7 },
      { age: 48, p3: 99.0, p15: 101.8, p50: 105.3, p85: 108.8, p97: 111.7 },
      { age: 60, p3: 105.9, p15: 109.0, p50: 112.9, p85: 116.7, p97: 119.9 },
    ],
  },
} as const

type ChartType = keyof typeof GROWTH_CHARTS

export function GrowthChartViewer() {
  const [chartType, setChartType] = useState<ChartType>("weight-for-age")
  const [age, setAge] = useState("")
  const [measurement, setMeasurement] = useState("")
  const [chartData, setChartData] = useState(GROWTH_CHARTS[chartType].data)

  const handlePlotPoint = () => {
    if (age && measurement) {
      const newData = [...chartData]
      const parsedAge = Number.parseInt(age)
      const parsedMeasurement = Number.parseFloat(measurement)
      const index = newData.findIndex((d) => d.age === parsedAge)
      if (index !== -1) {
        newData[index] = { ...newData[index], patient: parsedMeasurement }
      } else {
        newData.push({ age: parsedAge, patient: parsedMeasurement })
      }
      setChartData(newData.sort((a, b) => a.age - b.age))
      setAge("")
      setMeasurement("")
    }
  }

  return (
    <div className="space-y-4">
      <Select
        value={chartType}
        onValueChange={(value: ChartType) => {
          setChartType(value)
          setChartData(GROWTH_CHARTS[value].data)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select chart type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weight-for-age">Weight-for-age</SelectItem>
          <SelectItem value="height-for-age">Height-for-age</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex space-x-2">
        <Input type="number" placeholder="Age (months)" value={age} onChange={(e) => setAge(e.target.value)} />
        <Input
          type="number"
          placeholder={chartType === "weight-for-age" ? "Weight (kg)" : "Height (cm)"}
          value={measurement}
          onChange={(e) => setMeasurement(e.target.value)}
        />
        <Button onClick={handlePlotPoint}>Plot</Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" label={{ value: "Age (months)", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: GROWTH_CHARTS[chartType].yAxis, angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="p3" stroke="#8884d8" name="3rd percentile" />
          <Line type="monotone" dataKey="p15" stroke="#82ca9d" name="15th percentile" />
          <Line type="monotone" dataKey="p50" stroke="#ffc658" name="50th percentile" />
          <Line type="monotone" dataKey="p85" stroke="#ff7300" name="85th percentile" />
          <Line type="monotone" dataKey="p97" stroke="#ff0000" name="97th percentile" />
          <Line type="monotone" dataKey="patient" stroke="#000000" name="Patient" dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

