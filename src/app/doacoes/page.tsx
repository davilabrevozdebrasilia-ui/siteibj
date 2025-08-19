"use client";

import React from "react";
import Image from "next/image";

const Doacoes = () => {
    const chavePix = "13.838.187/0001-49";

    const copiarChavePix = () => {
        navigator.clipboard.writeText(chavePix);
        alert("Chave Pix copiada!");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 mb-[80] justify-self-center items-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-6">Doações</h1>

            <p className="mb-4 text-gray-800">
                As doações são fundamentais para que o <strong>Instituto Brazil Just</strong>
                continue promovendo ações sociais que transformam vidas. Cada contribuição
                é um passo para garantir mais saúde, educação, cultura e inclusão para
                quem mais precisa.
            </p>

            <p className="mb-4 text-gray-800">
                Você pode ajudar de diversas formas: doando recursos financeiros, alimentos, roupas, móveis, utensílios para casa, brinquedos, material escolar, óculos de grau, equipamentos esportivos, informática e outros, ligue ou mande whatsapp que nossa equipe irá retirar em sua residência ou empresa.
            </p>

            <div className="flex  gap-4 flex-col bg-blue-50 p-6 rounded-lg shadow-md mb-6">
                <div className="flex gap-4 justify-between">
                    <div className="flex flex-col">

                        <p className="text-gray-800 mb-2">
                            <strong>Chave Pix (CNPJ):</strong> {chavePix}
                        </p>
                        <p>
                            <strong>Instituto Brazil Just - IBJ</strong>
                        </p>
                        <p>
                            <strong>Banco: 461 - Asaas I.P. S.A.</strong>
                        </p>
                        <p>
                            <strong>Agência: 0001 Conta 821110-6</strong>
                        </p>
                    </div>

                    <button
                        onClick={copiarChavePix}
                        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors mb-4 cursor-pointer"
                    >
                        Copiar Chave Pix
                    </button>
                </div>
                <div className="flex flex-col items-center mt-4 ">
                    <p className="text-gray-800 mb-2 font-semibold">QR Code da nossa chave Pix:</p>
                    <Image
                        src="/doacoes/pix_qrcode.png"
                        alt="QR Code para Pix"
                        width={250}
                        height={250}
                        className="shadow-lg rounded-lg border border-gray-300"
                    />
                </div>
            </div>

            <p className="mb-4 text-gray-800">
                Sua ajuda fortalece nosso compromisso com a solidariedade e nos permite
                continuar levando esperança e oportunidades para comunidades vulneráveis.
                Obrigado por acreditar na nossa missão!
            </p>
        </div>
    );
};

export default Doacoes;
