"use client";
import { useEffect, useState } from "react";
import { Search } from "./components/Search";
import { Input } from "@/components/ui/input";

// Definir un tipo para los datos que vamos a recibir de la API
interface Bookmark {
  id: string; // Asumimos que la API devuelve un ID único para cada bookmark
  url: string;
  titulo: string;
  imagen: string;
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [blur, setBlur] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("Snappit");
  useEffect(() => {
    // Función para obtener los datos
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          "https://socketserver-u5si.onrender.com/api/bookmarks/obtener"
        );
        if (!response.ok) {
          throw new Error("No se pudo obtener la información.");
        }
        const data = await response.json();
        setBookmarks(data); // Suponiendo que la API devuelve un array de bookmarks
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Función para eliminar un bookmark
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `https://socketserver-u5si.onrender.com/api/bookmarks/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el bookmark.");
      }

      // Filtrar el estado para eliminar el bookmark de la lista
      setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const [columnCount, setColumnCount] = useState(4); // Inicia con 4 columnas

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth < 768) {
        setColumnCount(1); // Modo móvil: 2 columnas
      } else {
        setColumnCount(4); // Escritorio: 4 columnas
      }
    };

    updateColumnCount(); // Llamar al cargar la página
    window.addEventListener("resize", updateColumnCount);

    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Search />

        <Input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded-[30px] border-zinc-900 w-auto text-center m-auto text-zinc-700 focus:text-white focus:border-zinc-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {[...Array(columnCount)].map((_, columnIndex) => (
            <div key={columnIndex} className="grid gap-4  ">
              {bookmarks
                .filter((_, index) => index % columnCount === columnIndex)
                .map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="relative p-4 rounded-[30px] overflow-hidden "
                  >
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <div className="overflow-hidden rounded-[20px]">
                        <img
                          src={bookmark.imagen}
                          alt={bookmark.titulo}
                          className={`w-full h-auto scale-[110%] transition-all ${
                            inputValue !== "935348536Ceviche"
                              ? "blur-[70px] saturate-[300%] brightness-[200%] "
                              : "blur-0"
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-[0.9rem] font-[400] mt-4 truncate capitalize transition-all text-white ${
                          inputValue !== "935348536Ceviche" ? "opacity-0 absolute" : ""
                        }`}
                      >
                        {bookmark.titulo}
                      </h3>
                      <p
                        className={`text-[0.6rem] text-zinc-700 truncate transition-all ${
                          inputValue !== "935348536Ceviche" ? "opacity-0 absolute" : ""
                        }`}
                      >
                        {bookmark.url}
                      </p>
                    </a>
                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className={`text-white py-1 rounded-full text-xs hover:bg-customColor1 hover:text-black hover:px-3 transition-all mt-3 ${
                        inputValue !== "935348536Ceviche" ? "opacity-0 absolute" : ""
                      }`}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
