export default function VarjaoPage() {
  const videos = [
    { arquivo: "varjao.mp4", titulo: "Vídeo 1 – Varjão" },
    { arquivo: "teste.mp4", titulo: "Vídeo 2 – Varjão" },
    { arquivo: "varjao3.mp4", titulo: "Vídeo 3 – Varjão" },
    { arquivo: "varjao4.mp4", titulo: "Vídeo 4 – Varjão" },
    { arquivo: "varjao5.mp4", titulo: "Vídeo 5 – Varjão" },
    { arquivo: "varjao6.mp4", titulo: "Vídeo 6 – Varjão" },
    { arquivo: "varjao7.mp4", titulo: "Vídeo 7 – Varjão" },
    { arquivo: "varjao.mp4", titulo: "Vídeo 8 – Varjão" },
    { arquivo: "video9.mp4", titulo: "Vídeo 9 – Varjão" },
    { arquivo: "video10.mp4", titulo: "Vídeo 10 – Varjão" },
    { arquivo: "video11.mp4", titulo: "Vídeo 11 – Varjão" },
    { arquivo: "video12.mp4", titulo: "Vídeo 12 – Varjão" },
    { arquivo: "video13.mp4", titulo: "Vídeo 13 – Varjão" },
    { arquivo: "video14.mp4", titulo: "Vídeo 14 – Varjão" },
    { arquivo: "video15.mp4", titulo: "Vídeo 15 – Varjão" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-bold text-blue-900 mb-10">
          Vídeos — Projeto IBJ no Varjão
        </h1>

        {videos.map((video, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow mb-10">
            <h2 className="text-xl font-semibold mb-4">{video.titulo}</h2>

            <video controls className="w-full rounded-lg shadow">
              <source src={`/videos/${video.arquivo}`} type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          </div>
        ))}

      </div>
    </div>
  );
}
