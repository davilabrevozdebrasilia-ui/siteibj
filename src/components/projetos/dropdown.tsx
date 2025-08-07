// components/ProjetoDropdown.tsx
"use client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

const projetos = [
    "mulheres-belas",
    "visao-para-todos",
    "tea-lacos-de-inclusao",
    "lacos-de-inclusao",
    "meninas-luz",
];

type Props = {
    value: string;
    onChange: (val: string) => void;
};

export default function ProjetoDropdown({ value, onChange }: Props) {
    const selected = value.split(",").filter(Boolean);

    const toggleProjeto = (proj: string) => {
        const isSelected = selected.includes(proj);
        const newSelection = isSelected
            ? selected.filter((p) => p !== proj)
            : [...selected, proj];

        onChange(newSelection.join(","));
    };

    return (
        <div className="space-y-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        {selected.length > 0 ? selected.join(", ") : "Selecione os projetos"}
                        <ChevronDown size={16} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                    <div className="space-y-2">
                        {projetos.map((proj) => (
                            <div
                                key={proj}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 rounded"
                                onClick={() => toggleProjeto(proj)}
                            >
                                <Checkbox id={proj} checked={selected.includes(proj)} />
                                <label htmlFor={proj} className="text-sm">
                                    {proj}
                                </label>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
