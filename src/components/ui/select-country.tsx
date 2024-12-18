'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { countryCodes } from '@/lib/constants/phone-codes'

interface SelectCountryProps {
    value: string
    onValueChange: (value: string) => void
}

export function SelectCountry({ value, onValueChange }: SelectCountryProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[120px]" variant="country">
                <SelectValue>
                    {value && (
                        <div className="flex items-center gap-2">
                            <span className={`fi fi-${countryCodes.find(c => c.dial_code === value)?.code.toLowerCase()}`} />
                            <span>{value}</span>
                        </div>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.dial_code}>
                        <div className="flex items-center gap-2">
                            <span className={`fi fi-${country.code.toLowerCase()}`} />
                            <span>{country.name}</span>
                            <span className="ml-auto text-muted-foreground">
                                {country.dial_code}
                            </span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
} 