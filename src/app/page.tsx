"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Search } from "./components/Search";
import { Input } from "@/components/ui/input";

// Definir un tipo para los datos que vamos a recibir de la API
interface Bookmark {
  id: string;
  url: string;
  titulo: string;
  imagen: string;
  tags: string[];
  nota?: string; // Propiedad opcional
}

const BookmarkCard = ({
  bookmark,
  inputValue,
  onDelete,
  onUpdateTags,
  onUpdateNota,
  hoveredBookmarkId,
  setHoveredBookmarkId,
}: {
  bookmark: Bookmark;
  inputValue: string;
  onDelete: (id: string) => void;
  onUpdateTags: (id: string, newTags: string[]) => void;
  onUpdateNota: (id: string, newNota: string) => void;
  hoveredBookmarkId: string | null;
  setHoveredBookmarkId: (id: string | null) => void;
}) => {
  const handleAddTag = () => {
    const newTag = prompt("Ingrese un nuevo tag:");
    if (newTag) {
      onUpdateTags(bookmark.id, [...bookmark.tags, newTag]);
    }
  };

  // Determinamos si este bookmark está siendo hoverado o si otro lo está
  const isHovered = hoveredBookmarkId === bookmark.id;
  const isOtherHovered =
    hoveredBookmarkId !== null && hoveredBookmarkId !== bookmark.id;

  return (
    <div
      key={bookmark.id}
      className="relative p-4 rounded-[30px] transition-all duration-300 ease-out w-[250px]"
      onMouseEnter={() => setHoveredBookmarkId(bookmark.id)}
      onMouseLeave={() => setHoveredBookmarkId(null)}
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-80 transition-opacity "
      >
        <div className="relative group  rounded-[20px]">
          <img
            src={bookmark.imagen}
            alt={bookmark.titulo}
            className={`w-full h-auto scale-[110%] transition-all rounded-[20px] ${
              isOtherHovered ? "blur-[5px]" : "blur-0"
            }`}
          />
        </div>

        <h3
          className={`text-[0.9rem] font-[400] mt-4 truncate capitalize transition-all text-white`}
        >
          {bookmark.titulo}
        </h3>
      </a>

      <ul>
        {bookmark.tags && bookmark.tags.length > 0 ? (
          bookmark.tags.map((tag) => <li key={tag}>{tag}</li>)
        ) : (
          <div className="flex flex-row gap-2 mt-2 justify-start items-center">
            <p className="bg-white text-black px-3 py-1 rounded-full m-0 text-[0.7rem]">
              Sin tag
            </p>
            <button
              onClick={handleAddTag}
              className="bg-transparent text-white text-[0.8rem] flex justify-center items-center border border-white rounded-full w-[25px] h-[25px] hover:bg-white hover:text-black transition-all"
            >
              +
            </button>
          </div>
        )}
      </ul>

      <div className="mt-2">
        <p className="text-white text-sm">Nota:</p>
        <textarea
          className="w-full p-2 border rounded text-black"
          value={bookmark.nota || ""}
          onChange={(e) => onUpdateNota(bookmark.id, e.target.value)}
          placeholder="Escribe una nota..."
        />
      </div>

      <button
        onClick={() => onDelete(bookmark.id)}
        className={`text-white py-1 rounded-full text-xs hover:bg-customColor1 hover:text-black hover:px-3 transition-all mt-3 ${
          isHovered ? "opacity-100" : "opacity-0 absolute"
        }`}
      >
        Eliminar
      </button>
    </div>
  );
};

// Agregar este componente antes de la función Home
const BookmarkForm = ({
  onBookmarkAdded
}: {
  onBookmarkAdded: () => void
}) => {
  const [formData, setFormData] = useState({
    url: '',
    titulo: '',
    imagen: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://socketserver-u5si.onrender.com/api/bookmarks/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar el bookmark');
      
      setFormData({ url: '', titulo: '', imagen: '' });
      onBookmarkAdded();
    } catch (error) {
      alert('Error al guardar el bookmark');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8 space-y-4">
      <input
        type="url"
        value={formData.url}
        onChange={(e) => setFormData({...formData, url: e.target.value})}
        placeholder="URL del sitio"
        className="w-full p-2 rounded-lg border border-zinc-700 bg-transparent text-white"
        required
      />
      <input
        type="text"
        value={formData.titulo}
        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
        placeholder="Título"
        className="w-full p-2 rounded-lg border border-zinc-700 bg-transparent text-white"
        required
      />
      <input
        type="url"
        value={formData.imagen}
        onChange={(e) => setFormData({...formData, imagen: e.target.value})}
        placeholder="URL de la imagen"
        className="w-full p-2 rounded-lg border border-zinc-700 bg-transparent text-white"
        required
      />
      <button 
        type="submit"
        className="w-full p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
      >
        Agregar Bookmark
      </button>
    </form>
  );
};

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("935348536Ceviche");
  const [columnCount, setColumnCount] = useState(4);
  const [hoveredBookmarkId, setHoveredBookmarkId] = useState<string | null>(
    null
  );

  // Función para obtener los datos
  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await fetch(
        "https://socketserver-u5si.onrender.com/api/bookmarks/obtener"
      );
      if (!response.ok) throw new Error("No se pudo obtener la información.");
      const data = await response.json();
      setBookmarks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleUpdateTags = (id: string, newTags: string[]) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, tags: newTags } : bookmark
      )
    );
  };

  const handleUpdateNota = (id: string, newNota: string) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, nota: newNota } : bookmark
      )
    );
  };

  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(
        `https://socketserver-u5si.onrender.com/api/bookmarks/eliminar/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el bookmark.");

      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((bookmark) => bookmark.id !== id)
      );
    } catch (err: any) {
      alert(err.message);
    }
  }, []);

  useEffect(() => {
    const updateColumnCount = () => {
      if (window.innerWidth < 768) {
        setColumnCount(1); // Modo móvil
      } else {
        setColumnCount(4); // Escritorio
      }
    };
    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const bookmarkColumns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, columnIndex) =>
      bookmarks.filter((_, index) => index % columnCount === columnIndex)
    );
  }, [bookmarks, columnCount]);

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
        
        <BookmarkForm onBookmarkAdded={fetchBookmarks} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {bookmarkColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-4">
              {column.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  inputValue={inputValue}
                  onDelete={handleDelete}
                  onUpdateTags={handleUpdateTags}
                  onUpdateNota={handleUpdateNota}
                  hoveredBookmarkId={hoveredBookmarkId}
                  setHoveredBookmarkId={setHoveredBookmarkId}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
