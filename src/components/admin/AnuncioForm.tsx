"use client";

import { Upload } from "lucide-react";

type Props = {
    form: {
        titulo: string;
        imagem: string;
        href: string;
    };
    setForm: (form: any) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => void;
    onSubmit: () => void;
};

export default function AnuncioFormComponent({ form, setForm, handleFileChange, onSubmit }: Props) {
    return (
        <form className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="border p-2 rounded-md bg-white"
            />
            <input
                type="text"
                placeholder="Link (href)"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
                className="border p-2 rounded-md bg-white "
            />
            <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                <Upload size={18} />
                Enviar Imagem
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "anuncio")}
                    className="hidden "
                />
            </label>
            {form.imagem && (
                <img src={form.imagem} className="max-h-40 object-contain" alt="Preview" />
            )}
            <button
                type="button"
                onClick={onSubmit}
                className="bg-green-600 rounded-md-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold"
            >
                Cadastrar Anúncio
            </button>
        </form>
    );
}
