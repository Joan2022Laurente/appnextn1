/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Search } from "./components/Search";
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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Search />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {bookmarks.length > 0 ? (
            bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="relative p-4 rounded-[30] overflow-hidden h-auto bg-opacity"
              >
                {/* Card clickeable */}
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity o"
                >
                  <img
                    src={bookmark.imagen}
                    alt={bookmark.titulo}
                    className="mt-2 w-full h-auto rounded-[10]"
                  />
                  <h3 className="text-lg font-[500] mt-4 truncate capitalize text-white">
                    {bookmark.titulo}
                  </h3>
                  <p className="text-[0.6rem] text-zinc-700 truncate">
                    {bookmark.url}
                  </p>
                </a>

                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="  text-white  py-1 rounded-full text-xs hover:bg-customColor1 hover:text-black hover:px-3  transition-all mt-3"
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p>No hay bookmarks disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
}
