import React, { useState } from 'react';
import { askGemini } from '../services/api';

const GeminiChat = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const aiResponse = await askGemini(prompt);
      setResponse(aiResponse);
    } catch (error) {
      setResponse('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Gemini something..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      {response && <div className="response">{response}</div>}
    </div>
  );
};

export default GeminiChat;