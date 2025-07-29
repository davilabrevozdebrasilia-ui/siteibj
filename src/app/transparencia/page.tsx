"use client";

export default function Transparencia() {
    return (
        <main className="min-h-screen my-8  max-w-7xl mx-auto text-blue-900">
            <h1 className="text-3xl font-bold mb-6">Transparência</h1>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-semibold mb-2">Atestado de capacidade técnica</h2>
                    <iframe
                        src="/docs/AtestadoDeCapacidadeTecnica.pdf"
                        width="100%"
                        height="600px"
                        className="border rounded-md"
                    />
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Estatuto Social</h2>
                    <iframe
                        src="/docs/SEI_MDHC.pdf"
                        width="100%"
                        height="600px"
                        className="border rounded-md"
                    />
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">Termo de fomento</h2>
                    <iframe
                        src="/docs/TermoDeFomento.pdf"
                        width="100%"
                        height="600px"
                        className="border rounded-md"
                    />
                </section>
            </div>
        </main>
    );
}
