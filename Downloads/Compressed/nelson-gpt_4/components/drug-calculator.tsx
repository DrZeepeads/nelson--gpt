"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const DRUG_CATEGORIES = {
  Respiratory: {
    Albuterol: { dosage: 2.5, unit: "mg nebulized every 4-6 hours" },
    Budesonide: { dosage: 0.5, unit: "mg nebulized twice daily" },
    Montelukast: { dosage: 4, unit: "mg daily for ages 2-5 years" },
    Fluticasone: { dosage: 50, unit: "mcg 1-2 puffs twice daily" },
    Ipratropium: { dosage: 0.25, unit: "mg nebulized every 6-8 hours" },
    Dexamethasone: { dosage: 0.6, unit: "mg/kg once daily for croup" },
    Azithromycin: { dosage: 10, unit: "mg/kg once daily for 3 days" },
    Amoxicillin: { dosage: 90, unit: "mg/kg/day divided every 12 hours" },
    Ceftriaxone: { dosage: 50, unit: "mg/kg IM or IV once daily" },
    Oseltamivir: { dosage: 3, unit: "mg/kg twice daily for 5 days" },
    Prednisolone: { dosage: 1, unit: "mg/kg daily for asthma exacerbation" },
    Cetirizine: { dosage: 2.5, unit: "mg daily for ages 6-12 months" },
    Loratadine: { dosage: 5, unit: "mg daily for ages 2-6 years" },
    Diphenhydramine: { dosage: 1.25, unit: "mg/kg every 6 hours" },
    Pseudoephedrine: { dosage: 4, unit: "mg/kg every 6 hours" },
    Guaifenesin: { dosage: 100, unit: "mg every 4 hours for ages 2-6 years" },
    Dextromethorphan: { dosage: 5, unit: "mg every 4 hours for ages 2-6 years" },
    Benzocaine: { dosage: 7.5, unit: "mg applied to gums up to 4 times daily" },
    Acetylcysteine: { dosage: 10, unit: "% solution nebulized every 6-8 hours" },
    "Caffeine citrate": { dosage: 20, unit: "mg/kg loading dose, then 5 mg/kg daily" },
  },
  Cardiovascular: {
    Enalapril: { dosage: 0.08, unit: "mg/kg once daily" },
    Furosemide: { dosage: 1, unit: "mg/kg/dose every 6-12 hours" },
    Spironolactone: { dosage: 1, unit: "mg/kg/day divided twice daily" },
    Propranolol: { dosage: 0.5, unit: "mg/kg/dose 3 times daily" },
    Atenolol: { dosage: 0.5, unit: "mg/kg once daily" },
    Amlodipine: { dosage: 0.1, unit: "mg/kg once daily" },
    Digoxin: { dosage: 0.005, unit: "mg/kg twice daily" },
    Aspirin: { dosage: 3, unit: "mg/kg once daily for Kawasaki disease" },
    Warfarin: { dosage: 0.1, unit: "mg/kg once daily, adjust based on INR" },
    Enoxaparin: { dosage: 1, unit: "mg/kg subcutaneously every 12 hours" },
    Sildenafil: { dosage: 0.5, unit: "mg/kg 3 times daily for pulmonary hypertension" },
    Bosentan: { dosage: 2, unit: "mg/kg twice daily for pulmonary hypertension" },
    Nifedipine: { dosage: 0.25, unit: "mg/kg 3 times daily" },
    Hydralazine: { dosage: 0.75, unit: "mg/kg/dose every 6 hours" },
    Metoprolol: { dosage: 1, unit: "mg/kg/day divided twice daily" },
    Losartan: { dosage: 0.7, unit: "mg/kg once daily" },
    Captopril: { dosage: 0.5, unit: "mg/kg/dose 3 times daily" },
    Milrinone: { dosage: 0.5, unit: "mcg/kg/min IV continuous infusion" },
    Dopamine: { dosage: 5, unit: "mcg/kg/min IV, titrate to effect" },
    Epinephrine: { dosage: 0.1, unit: "mcg/kg/min IV, titrate to effect" },
  },
  Endocrine: {
    Levothyroxine: { dosage: 0.05, unit: "mg/kg once daily" },
    Hydrocortisone: { dosage: 8, unit: "mg/m2/day divided 3 times daily" },
    Insulin: { dosage: 0.5, unit: "units/kg/day, divided for basal and bolus" },
    Metformin: { dosage: 500, unit: "mg twice daily, max 2000 mg/day" },
    "Growth hormone": { dosage: 0.3, unit: "mg/kg/week divided daily" },
    Desmopressin: { dosage: 0.1, unit: "mg orally twice daily" },
    Methimazole: { dosage: 0.5, unit: "mg/kg/day divided 3 times daily" },
    Propylthiouracil: { dosage: 5, unit: "mg/kg/day divided 3 times daily" },
    Octreotide: { dosage: 1, unit: "mcg/kg/dose subcutaneously 3 times daily" },
    Cabergoline: { dosage: 0.25, unit: "mg twice weekly" },
    Glucagon: { dosage: 1, unit: "mg IM/SC/IV for severe hypoglycemia" },
    Calcitriol: { dosage: 0.25, unit: "mcg daily" },
    Cinacalcet: { dosage: 0.2, unit: "mg/kg once daily" },
    Teriparatide: { dosage: 20, unit: "mcg subcutaneously daily" },
    Alendronate: { dosage: 35, unit: "mg once weekly" },
    Liraglutide: { dosage: 0.6, unit: "mg subcutaneously daily, increase to 1.2-1.8 mg" },
    Glimepiride: { dosage: 1, unit: "mg once daily, max 8 mg/day" },
    Pioglitazone: { dosage: 15, unit: "mg once daily, max 30 mg/day" },
    Sitagliptin: { dosage: 100, unit: "mg once daily" },
    Empagliflozin: { dosage: 10, unit: "mg once daily" },
  },
  Nephrology: {
    Enalapril: { dosage: 0.08, unit: "mg/kg once daily" },
    Lisinopril: { dosage: 0.07, unit: "mg/kg once daily" },
    Losartan: { dosage: 0.7, unit: "mg/kg once daily" },
    Amlodipine: { dosage: 0.1, unit: "mg/kg once daily" },
    Furosemide: { dosage: 1, unit: "mg/kg/dose every 6-12 hours" },
    Hydrochlorothiazide: { dosage: 1, unit: "mg/kg/day divided twice daily" },
    Spironolactone: { dosage: 1, unit: "mg/kg/day divided twice daily" },
    "Sodium bicarbonate": { dosage: 1, unit: "mEq/kg/day divided 3-4 times daily" },
    "Calcium carbonate": { dosage: 500, unit: "mg 3 times daily with meals" },
    Sevelamer: { dosage: 800, unit: "mg 3 times daily with meals" },
    Erythropoietin: { dosage: 50, unit: "units/kg 3 times weekly" },
    "Iron sucrose": { dosage: 2, unit: "mg/kg IV weekly" },
    Calcitriol: { dosage: 0.25, unit: "mcg daily" },
    "Darbepoetin alfa": { dosage: 0.45, unit: "mcg/kg subcutaneously weekly" },
    Cinacalcet: { dosage: 0.2, unit: "mg/kg once daily" },
    "Mycophenolate mofetil": { dosage: 600, unit: "mg/m2 twice daily" },
    Tacrolimus: { dosage: 0.1, unit: "mg/kg twice daily" },
    Cyclosporine: { dosage: 5, unit: "mg/kg twice daily" },
    Rituximab: { dosage: 375, unit: "mg/m2 IV weekly for 4 doses" },
    Eculizumab: { dosage: 900, unit: "mg IV weekly for 4 weeks, then 1200 mg every 2 weeks" },
  },
  Immunology: {
    Prednisone: { dosage: 1, unit: "mg/kg/day" },
    Methylprednisolone: { dosage: 1, unit: "mg/kg/dose IV every 6 hours" },
    Methotrexate: { dosage: 15, unit: "mg/m2 once weekly" },
    Hydroxychloroquine: { dosage: 5, unit: "mg/kg/day" },
    Azathioprine: { dosage: 2, unit: "mg/kg/day" },
    Cyclosporine: { dosage: 5, unit: "mg/kg twice daily" },
    Tacrolimus: { dosage: 0.1, unit: "mg/kg twice daily" },
    "Mycophenolate mofetil": { dosage: 600, unit: "mg/m2 twice daily" },
    Rituximab: { dosage: 375, unit: "mg/m2 IV weekly for 4 doses" },
    Infliximab: { dosage: 5, unit: "mg/kg IV at 0, 2, and 6 weeks, then every 8 weeks" },
    Adalimumab: { dosage: 20, unit: "mg subcutaneously every other week (15-30 kg)" },
    Etanercept: { dosage: 0.8, unit: "mg/kg subcutaneously weekly" },
    Tocilizumab: { dosage: 8, unit: "mg/kg IV every 4 weeks" },
    Anakinra: { dosage: 1, unit: "mg/kg/day subcutaneously, max 100 mg" },
    Abatacept: { dosage: 10, unit: "mg/kg IV at 0, 2, 4 weeks, then every 4 weeks" },
    Belimumab: { dosage: 10, unit: "mg/kg IV at 0, 2, 4 weeks, then every 4 weeks" },
    IVIG: { dosage: 2, unit: "g/kg IV" },
    Omalizumab: { dosage: 150, unit: "mg subcutaneously every 4 weeks" },
    Mepolizumab: { dosage: 100, unit: "mg subcutaneously every 4 weeks" },
    Dupilumab: { dosage: 200, unit: "mg subcutaneously every 2 weeks" },
  },
  Neurology: {
    Levetiracetam: { dosage: 20, unit: "mg/kg twice daily" },
    "Valproic acid": { dosage: 15, unit: "mg/kg twice daily" },
    Carbamazepine: { dosage: 10, unit: "mg/kg twice daily" },
    Phenobarbital: { dosage: 3, unit: "mg/kg once daily" },
    Phenytoin: { dosage: 5, unit: "mg/kg twice daily" },
    Topiramate: { dosage: 1, unit: "mg/kg twice daily" },
    Gabapentin: { dosage: 10, unit: "mg/kg 3 times daily" },
    Diazepam: { dosage: 0.3, unit: "mg/kg IV for status epilepticus" },
    Lorazepam: { dosage: 0.1, unit: "mg/kg IV for status epilepticus" },
    Midazolam: { dosage: 0.2, unit: "mg/kg IM for status epilepticus" },
    Methylphenidate: { dosage: 0.3, unit: "mg/kg once daily in the morning" },
    Atomoxetine: { dosage: 0.5, unit: "mg/kg once daily" },
    Risperidone: { dosage: 0.25, unit: "mg twice daily, titrate as needed" },
    Fluoxetine: { dosage: 10, unit: "mg once daily for ages 8 and older" },
    Sertraline: { dosage: 25, unit: "mg once daily for ages 6 and older" },
    Clonidine: { dosage: 0.1, unit: "mg/m2/day divided 3-4 times daily" },
    Baclofen: { dosage: 2.5, unit: "mg 3 times daily, increase gradually" },
    Sumatriptan: { dosage: 20, unit: "mg intranasal for acute migraine" },
    Amitriptyline: { dosage: 0.1, unit: "mg/kg once daily at bedtime for migraine prophylaxis" },
    "Botulinum toxin": {
      dosage: 155,
      unit: 'units divided among 31 "Botulinum toxin": { dosage: 155, unit: "units divided among 31 injection sites for chronic migraine',
    },
  },
  Urology: {
    Oxybutynin: { dosage: 0.2, unit: "mg/kg/dose 2-3 times daily" },
    Tolterodine: { dosage: 2, unit: "mg twice daily" },
    Desmopressin: { dosage: 0.2, unit: "mg orally at bedtime" },
    Nitrofurantoin: { dosage: 5, unit: "mg/kg/day divided every 6 hours" },
    "Trimethoprim-sulfamethoxazole": { dosage: 8, unit: "mg/kg/day of TMP component, divided twice daily" },
    Cephalexin: { dosage: 25, unit: "mg/kg/day divided twice daily" },
    Ciprofloxacin: { dosage: 20, unit: "mg/kg/day divided twice daily" },
    Amoxicillin: { dosage: 20, unit: "mg/kg/day divided 3 times daily" },
    Tamsulosin: { dosage: 0.4, unit: "mg once daily" },
    Finasteride: { dosage: 5, unit: "mg once daily" },
    Sildenafil: { dosage: 0.5, unit: "mg/kg/dose, max 20 mg/dose, 3 times daily" },
    Tadalafil: { dosage: 0.5, unit: "mg/kg once daily" },
    Alfuzosin: { dosage: 2.5, unit: "mg once daily" },
    Mirabegron: { dosage: 25, unit: "mg once daily" },
    Solifenacin: { dosage: 5, unit: "mg once daily" },
    Darifenacin: { dosage: 7.5, unit: "mg once daily" },
    Propiverine: { dosage: 5, unit: "mg twice daily" },
    Trospium: { dosage: 20, unit: "mg twice daily" },
    Imipramine: { dosage: 25, unit: "mg at bedtime" },
    Pseudoephedrine: { dosage: 4, unit: "mg/kg/day divided 3-4 times daily" },
  },
  Rheumatology: {
    Naproxen: { dosage: 10, unit: "mg/kg twice daily" },
    Ibuprofen: { dosage: 10, unit: "mg/kg every 6-8 hours" },
    Indomethacin: { dosage: 1, unit: "mg/kg/day divided 2-3 times daily" },
    Celecoxib: { dosage: 100, unit: "mg twice daily for weight >25 kg" },
    Prednisone: { dosage: 1, unit: "mg/kg/day" },
    Methotrexate: { dosage: 15, unit: "mg/m2 once weekly" },
    Hydroxychloroquine: { dosage: 5, unit: "mg/kg/day" },
    Sulfasalazine: { dosage: 50, unit: "mg/kg/day divided twice daily" },
    Leflunomide: { dosage: 10, unit: "mg daily for <20 kg, 20 mg daily for >20 kg" },
    Etanercept: { dosage: 0.8, unit: "mg/kg subcutaneously weekly" },
    Adalimumab: { dosage: 20, unit: "mg subcutaneously every other week (15-30 kg)" },
    Infliximab: { dosage: 5, unit: "mg/kg IV at 0, 2, and 6 weeks, then every 8 weeks" },
    Tocilizumab: { dosage: 8, unit: "mg/kg IV every 4 weeks" },
    Anakinra: { dosage: 1, unit: "mg/kg/day subcutaneously, max 100 mg" },
    Canakinumab: { dosage: 4, unit: "mg/kg subcutaneously every 4 weeks" },
    Rituximab: { dosage: 375, unit: "mg/m2 IV weekly for 4 doses" },
    Abatacept: { dosage: 10, unit: "mg/kg IV at 0, 2, 4 weeks, then every 4 weeks" },
    Colchicine: { dosage: 0.5, unit: "mg daily for children >4 years" },
    Allopurinol: { dosage: 5, unit: "mg/kg/day" },
    Febuxostat: { dosage: 40, unit: "mg daily" },
  },
  Oncology: {
    Vincristine: { dosage: 1.5, unit: "mg/m2 IV weekly" },
    Doxorubicin: { dosage: 30, unit: "mg/m2 IV every 3 weeks" },
    Methotrexate: { dosage: 12, unit: "g/m2 IV over 4 hours" },
    Cisplatin: { dosage: 100, unit: "mg/m2 IV every 3 weeks" },
    Cyclophosphamide: { dosage: 750, unit: "mg/m2 IV every 3 weeks" },
    Etoposide: { dosage: 100, unit: "mg/m2 IV daily for 5 days" },
    Ifosfamide: { dosage: 1800, unit: "mg/m2 IV daily for 5 days" },
    Carboplatin: { dosage: 560, unit: "mg/m2 IV every 3 weeks" },
    Imatinib: { dosage: 340, unit: "mg/m2 daily" },
    Rituximab: { dosage: 375, unit: "mg/m2 IV weekly" },
    Asparaginase: { dosage: 2500, unit: "IU/m2 IM 3 times weekly" },
    Mercaptopurine: { dosage: 75, unit: "mg/m2 daily" },
    Cytarabine: { dosage: 3, unit: "g/m2 IV every 12 hours for 4 doses" },
    Daunorubicin: { dosage: 30, unit: "mg/m2 IV daily for 3 days" },
    Bortezomib: { dosage: 1.3, unit: "mg/m2 IV on days 1, 4, 8, 11" },
    Temozolomide: { dosage: 150, unit: "mg/m2 daily for 5 days every 28 days" },
    Dasatinib: { dosage: 60, unit: "mg/m2 daily" },
    Nilotinib: { dosage: 230, unit: "mg/m2 twice daily" },
    Everolimus: { dosage: 3, unit: "mg/m2 daily" },
    Pembrolizumab: { dosage: 2, unit: "mg/kg IV every 3 weeks" },
  },
  "Infectious Diseases": {
    Amoxicillin: { dosage: 45, unit: "mg/kg twice daily" },
    Ceftriaxone: { dosage: 50, unit: "mg/kg once daily" },
    Azithromycin: { dosage: 10, unit: "mg/kg once daily for 3 days" },
    Cefdinir: { dosage: 14, unit: "mg/kg once daily" },
    Vancomycin: { dosage: 15, unit: "mg/kg every 6 hours" },
    Gentamicin: { dosage: 7.5, unit: "mg/kg once daily" },
    Metronidazole: { dosage: 10, unit: "mg/kg 3 times daily" },
    Acyclovir: { dosage: 20, unit: "mg/kg 3 times daily" },
    Oseltamivir: { dosage: 3, unit: "mg/kg twice daily for 5 days" },
    Fluconazole: { dosage: 6, unit: "mg/kg once daily" },
    "Trimethoprim-sulfamethoxazole": { dosage: 8, unit: "mg/kg (of TMP) twice daily" },
    Clindamycin: { dosage: 10, unit: "mg/kg 3 times daily" },
    Doxycycline: { dosage: 2, unit: "mg/kg twice daily (for children >8 years)" },
    Nitrofurantoin: { dosage: 5, unit: "mg/kg/day divided every 6 hours" },
    Rifampin: { dosage: 10, unit: "mg/kg once daily" },
    Isoniazid: { dosage: 10, unit: "mg/kg once daily (max 300 mg)" },
    Pyrazinamide: { dosage: 30, unit: "mg/kg once daily" },
    Ethambutol: { dosage: 20, unit: "mg/kg once daily" },
    Mebendazole: { dosage: 100, unit: "mg twice daily for 3 days" },
    Ivermectin: { dosage: 200, unit: "mcg/kg as a single dose" },
  },
  "Bones and Joints": {
    Ibuprofen: { dosage: 10, unit: "mg/kg every 6-8 hours" },
    Naproxen: { dosage: 5, unit: "mg/kg twice daily" },
    Celecoxib: { dosage: 100, unit: "mg twice daily for weight >25 kg" },
    Diclofenac: { dosage: 1, unit: "mg/kg 3 times daily" },
    Indomethacin: { dosage: 1, unit: "mg/kg/day divided 2-3 times daily" },
    Prednisone: { dosage: 1, unit: "mg/kg/day" },
    Methotrexate: { dosage: 15, unit: "mg/m2 once weekly" },
    Sulfasalazine: { dosage: 50, unit: "mg/kg/day divided twice daily" },
    Hydroxychloroquine: { dosage: 5, unit: "mg/kg/day" },
    Etanercept: { dosage: 0.8, unit: "mg/kg subcutaneously weekly" },
    Adalimumab: { dosage: 20, unit: "mg subcutaneously every other week (15-30 kg)" },
    Infliximab: { dosage: 5, unit: "mg/kg IV at 0, 2, and 6 weeks, then every 8 weeks" },
    Tocilizumab: { dosage: 8, unit: "mg/kg IV every 4 weeks" },
    Abatacept: { dosage: 10, unit: "mg/kg IV at 0, 2, 4 weeks, then every 4 weeks" },
    Alendronate: { dosage: 35, unit: "mg once weekly" },
    "Calcium carbonate": { dosage: 500, unit: "mg 3 times daily with meals" },
    "Vitamin D3": { dosage: 600, unit: "IU daily" },
    Calcitonin: { dosage: 100, unit: "IU subcutaneously daily" },
    Teriparatide: { dosage: 20, unit: "mcg subcutaneously daily" },
    Denosumab: { dosage: 60, unit: "mg subcutaneously every 6 months" },
  },
}

type DrugCategory = keyof typeof DRUG_CATEGORIES
type Drug = keyof (typeof DRUG_CATEGORIES)[DrugCategory]

export function DrugCalculator() {
  const [weight, setWeight] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | "">("")
  const [selectedDrug, setSelectedDrug] = useState<Drug | "">("")
  const [result, setResult] = useState("")

  const calculateDose = () => {
    const weightNum = Number.parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0 || !selectedCategory || !selectedDrug) {
      setResult("Please enter a valid weight and select a drug.")
      return
    }

    const drug = DRUG_CATEGORIES[selectedCategory][selectedDrug]
    const dose = weightNum * drug.dosage
    setResult(`Recommended dose: ${dose.toFixed(2)} ${drug.unit}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pediatric Drug Calculator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="category">Select Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value: DrugCategory) => {
              setSelectedCategory(value)
              setSelectedDrug("")
            }}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(DRUG_CATEGORIES).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="drug">Select Drug</Label>
          <Select value={selectedDrug} onValueChange={(value: Drug) => setSelectedDrug(value)}>
            <SelectTrigger id="drug">
              <SelectValue placeholder="Select drug" />
            </SelectTrigger>
            <SelectContent>
              {selectedCategory &&
                Object.keys(DRUG_CATEGORIES[selectedCategory]).map((drug) => (
                  <SelectItem key={drug} value={drug}>
                    {drug}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={calculateDose}>Calculate Dose</Button>
      {result && <p className="text-lg font-semibold">{result}</p>}
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(DRUG_CATEGORIES).map(([category, drugs]) => (
          <AccordionItem key={category} value={category}>
            <AccordionTrigger>{category}</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6">
                {Object.entries(drugs).map(([drug, info]) => (
                  <li key={drug}>
                    <strong>{drug}:</strong> {info.dosage} {info.unit}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

