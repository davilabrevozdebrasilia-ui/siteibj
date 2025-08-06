"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

const Visao = () => {
  return (
    <div className="max-w-7xl mx-auto  py-12 mb-[80] justify-self-center items-center">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Nossa Visão</h1>

      <p className="mb-4 text-gray-800">
        Nossa visão é viver em uma sociedade onde todos tenham acesso a oportunidades justas,
        independentemente de gênero, raça, condição social ou deficiência.
      </p>

      <p className="mb-4 text-gray-800">
        Acreditamos na inclusão como fator de transformação estrutural, e por isso aspiramos
        ser reconhecidos como um instituto de referência na promoção de dignidade, cidadania
        e empoderamento social em Brasília e em todo o Distrito Federal.
      </p>

      <h2 className="text-xl font-semibold text-blue-800 mt-8 mb-4">Nossos Valores</h2>
      <ul className="space-y-2">
        <li className="flex items-start gap-2 text-gray-800">
          <CheckCircle className="text-blue-600 w-5 h-5 mt-1" /> Inclusão e equidade: cada pessoa merece visibilidade, oportunidade e acolhimento.
        </li>
        <li className="flex items-start gap-2 text-gray-800">
          <CheckCircle className="text-blue-600 w-5 h-5 mt-1" /> Impacto comunitário: agimos com foco em resultados concretos e transformadores.
        </li>
        <li className="flex items-start gap-2 text-gray-800">
          <CheckCircle className="text-blue-600 w-5 h-5 mt-1" /> Colaboração e transparência: trabalhamos junto às comunidades e parceiros com clareza e respeito.
        </li>
        <li className="flex items-start gap-2 text-gray-800">
          <CheckCircle className="text-blue-600 w-5 h-5 mt-1" /> Promoção da saúde e educação: fundamentais para autonomização individual e comunitária.
        </li>
      </ul>
    </div>
  );
};

export default Visao;