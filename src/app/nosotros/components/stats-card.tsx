interface StatsCardProps {
    number: string
    label: string
    icon: React.ReactNode
}

export function StatsCard({ number, label, icon }: StatsCardProps) {
    return (
        <div className="flex flex-col items-center space-y-2 p-4">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
                {icon}
            </div>
            <h3 className="text-2xl font-bold">{number}</h3>
            <p className="text-sm text-muted-foreground text-center">{label}</p>
        </div>
    )
}

