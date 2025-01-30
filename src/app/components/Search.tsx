"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export const Search = () => {
  const placeholders = [
    "damn",
    "dnn andrea?",
    "Lucy L0tus?",
    "syrn dmer",
    "isbla rmrz?",
    "pat c acvd",
    "mikansu1",
    "nk mrs",
    "ptr tar k",
    "Adianababy",
    "lya robnsn",
    "elctra",
    "rl reign",
    "alizzbm",
    "naomih666",
    "zoenelli",
    "candy milady"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-auto flex flex-col justify-center  items-center px-4 w-full">
      <h2 className="mb-10 sm:mb-20 text-[3rem] text-center sm:text-[5rem] dark:text-white text-white font-bold font-utf ">
        Snappit
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
