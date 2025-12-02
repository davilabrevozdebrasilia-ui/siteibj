export default function VarjaoPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold text-blue-900 mb-10">
          Vídeos — Projeto IBJ no Varjão
        </h1>

        {/* --- VÍDEO 1 --- */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Vídeo 1 – Varjão</h2>

          <video
            controls
            className="w-full rounded-lg shadow"
          >
            <source src="/videos/varjao.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>

        {/* --- VÍDEO 2 --- */}
        <div className="bg-white p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Vídeo 2 – Teste</h2>

          <video
            controls
            className="w-full rounded-lg shadow"
          >
            <source src="/videos/teste.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>

      </div>
    </div>
  );
}
