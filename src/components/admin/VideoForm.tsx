"use client";

import ProjetoDropdown from "@/components/projetos/dropdown";
import { Upload } from "lucide-react";

type Props = {
    form: {
        titulo: string;
        descricao: string;
        url: string;
        projetos: string;
    };
    setForm: (form: any) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => void;
    onSubmit: () => void;
};

export default function VideoFormComponent({ form, setForm, handleFileChange, onSubmit }: Props) {
    return (
        <form className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="border p-2 rounded-md bg-white"
            />
            <textarea
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                className="border p-2 rounded-md bg-white"
            />
            <ProjetoDropdown
                value={form.projetos}
                onChange={(val) => setForm({ ...form, projetos: val })}
            />
            <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                <Upload size={18} />
                Enviar Vídeo
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, "video")}
                    className="hidden"
                />
            </label>
            {form.url && (
                <video src={form.url} controls className="max-h-40 object-contain" />
            )}
            <button
                type="button"
                onClick={onSubmit}
                className="bg-green-600 rounded-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold"
            >
                Cadastrar Vídeo
            </button>
        </form>
    );
}
