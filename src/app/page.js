'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [email, setEmail] = useState('');
  const [recipe, setRecipe] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setRecipe('');
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }
      setRecipe(data.generation);
    } catch (error) {
      setError(error.message || 'An error occurred while generating the recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-4 flex items-start flex-col space-y-4">
      <h1 className="text-2xl mb-4">Recipe Builder</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2 mr-2 text-black"
      />
      <input
        type="text"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="Enter your ingredients"
        className="border p-2 mr-2 text-black"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`${
          isSubmitting ? 'bg-gray-500' : 'bg-blue-500'
        } text-white px-4 py-2 rounded mr-2`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {recipe && (
        <p className="my-4 whitespace-pre">{recipe}</p>
      )}
    </div>
  )
}
