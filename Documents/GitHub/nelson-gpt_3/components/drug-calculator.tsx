"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DRUGS = {
  acetaminophen: { dosage: 15, unit: "mg/kg" },
  ibuprofen: { dosage: 10, unit: "mg/kg" },
  amoxicillin: { dosage: 50, unit: "mg/kg/day" },
}

type Drug = keyof typeof DRUGS

export function DrugCalculator() {
  const [weight, setWeight] = useState("")
  const [selectedDrug, setSelectedDrug] = useState<Drug>("acetaminophen")
  const [result, setResult] = useState("")

  const calculateDose = () => {
    const weightNum = Number.parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) {
      setResult("Please enter a valid weight.")
      return
    }

    const drug = DRUGS[selectedDrug]
    const dose = weightNum * drug.dosage
    setResult(`Recommended dose: ${dose.toFixed(2)} ${drug.unit.split("/")[0]}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pediatric Drug Calculator</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight in kg"
          />
        </div>
        <div>
          <Label htmlFor="drug">Select Drug</Label>
          <Select value={selectedDrug} onValueChange={(value: Drug) => setSelectedDrug(value)}>
            <SelectTrigger id="drug">
              <SelectValue placeholder="Select drug" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(DRUGS).map((drug) => (
                <SelectItem key={drug} value={drug}>
                  {drug.charAt(0).toUpperCase() + drug.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={calculateDose}>Calculate Dose</Button>
      {result && <p className="text-lg font-semibold">{result}</p>}
    </div>
  )
}

