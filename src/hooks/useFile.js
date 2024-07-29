import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export function useFile() {
    const [url, setUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false); // Nuevo estado de carga

    useEffect(() => {
      if (!selectedFile) {
        document.getElementsByTagName('button')[0].setAttribute('disabled', true);
      } else {
        document.getElementsByTagName('button')[0].removeAttribute('disabled');
      }
    }, [selectedFile]);
  
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        await uploadFile(file);
      }, []);
  
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
      onDrop,
      accept: {
        'application/pdf': []
      }
    });

    const uploadFile = async (file) => {
        const storageRef = ref(storage, `uploads/${file.name}`);
    
        try {
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          setUrl(downloadURL);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia el estado de carga

        try {
          const perplexity = createOpenAI({
            apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
            baseURL: 'https://api.perplexity.ai/',
          });

          const model = perplexity('llama-3-sonar-large-32k-online');

          const { text } = await generateText({
            model: model,
            prompt: `Crea un resumen sobre el siguiente PDF, hazlo de la mejor manera: ${url}`
          });

          setGeneratedText(text);
        } catch (error) {
          console.error('Error generating text:', error);
        } finally {
          setLoading(false); // Termina el estado de carga
        }
      };

    return { getRootProps, getInputProps, handleSubmit, acceptedFiles, generatedText, loading };
}
