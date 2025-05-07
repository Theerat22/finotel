import { useState } from "react";

// Define the prop types
interface PromptFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [prompt, setPrompt] = useState<string>("");
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Fire callback...
        if (prompt === "") {
          return;
        }
        onSubmit(prompt);
        setPrompt("");
      }}
    >
      <label>Question</label>
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="text"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      {isLoading && <div>Loading...</div>}
      <input
        className="w-full p-2 border border-gray-300 rounded-md"
        type="submit"
        disabled={isLoading}
      />
    </form>
  );
}